-- ============================================================
-- PHASE 3: UNIFY AUTH
-- ============================================================
-- Creates the unified auth infrastructure:
--   1. Add admin/activation columns to platform.users
--   2. Add slug column to platform.products
--   3. Create platform.user_product_access table
--   4. Create RLS helper functions (JWT-based)
--   5. Create custom access token hook for Supabase Auth
--   6. RLS policies on user_product_access
--   7. Grants and compatibility view
--
-- ASSUMPTION: platform.users has an `auth_id` column referencing auth.users.id.
-- If users.id IS auth.users.id, replace `auth_id` with `id` throughout this file.
--
-- AFTER RUNNING: Enable the custom hook in Supabase Dashboard:
--   Authentication → Hooks → Custom Access Token → platform.custom_access_token_hook
-- ============================================================

-- PREREQUISITE: Verify your schema before running. Uncomment and run:
-- SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_schema = 'platform' AND table_name = 'users' ORDER BY ordinal_position;
-- SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_schema = 'platform' AND table_name = 'products' ORDER BY ordinal_position;

BEGIN;

-- ============================================================
-- STEP 1: Add admin and activation columns to platform.users
-- ============================================================
-- is_platform_admin: internal Elevate staff with cross-tenant access
-- is_tenant_admin: customer's top admin, manages all products in their tenant
-- is_active / revoked_at: instant deactivation even with valid JWT

ALTER TABLE platform.users ADD COLUMN IF NOT EXISTS is_platform_admin BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE platform.users ADD COLUMN IF NOT EXISTS is_tenant_admin BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE platform.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE platform.users ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ;

-- Index for JWT hook lookups (auth_id → user record)
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON platform.users(auth_id);

-- ============================================================
-- STEP 2: Add slug column to platform.products
-- ============================================================
-- The JWT hook builds a {slug: role} map. Products need a stable slug identifier.

ALTER TABLE platform.products ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Populate slugs based on product names
-- Adjust these patterns if your product names differ
UPDATE platform.products SET slug = 'sales' WHERE slug IS NULL AND name ILIKE '%sales%';
UPDATE platform.products SET slug = 'compliance' WHERE slug IS NULL AND name ILIKE '%compliance%';
UPDATE platform.products SET slug = 'permits' WHERE slug IS NULL AND name ILIKE '%permit%';
UPDATE platform.products SET slug = 'execution' WHERE slug IS NULL AND name ILIKE '%execution%';
UPDATE platform.products SET slug = 'finance' WHERE slug IS NULL AND name ILIKE '%finance%';

-- Verify all products got a slug (fails if any are still NULL)
ALTER TABLE platform.products ALTER COLUMN slug SET NOT NULL;

-- ============================================================
-- STEP 3: Create platform.user_product_access
-- ============================================================
-- Maps users to products with per-product roles.
-- A user with {product: compliance, role: branch_manager} can access
-- compliance data filtered by their branch (enforced in product schema).

CREATE TABLE platform.user_product_access (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES platform.products(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, product_id)
);

ALTER TABLE platform.user_product_access ENABLE ROW LEVEL SECURITY;

-- Index for JWT hook: lookup product access by user
CREATE INDEX idx_user_product_access_user_id ON platform.user_product_access(user_id);

-- ============================================================
-- STEP 4: RLS helper functions
-- ============================================================
-- These read from JWT claims (no DB round-trip per query).
-- Claims are injected by the custom hook in Step 5.

-- Get the caller's tenant UUID from JWT
CREATE OR REPLACE FUNCTION platform.get_tenant_id()
RETURNS UUID
LANGUAGE sql STABLE
AS $$
    SELECT ((current_setting('request.jwt.claims', true)::jsonb) ->> 'tenant_id')::UUID;
$$;

-- Check if caller has access to a product (by slug)
CREATE OR REPLACE FUNCTION platform.has_product_access(product_slug TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE
AS $$
    SELECT ((current_setting('request.jwt.claims', true)::jsonb) -> 'products') ? product_slug;
$$;

-- Check if caller is a platform admin
CREATE OR REPLACE FUNCTION platform.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE
AS $$
    SELECT COALESCE(
        ((current_setting('request.jwt.claims', true)::jsonb) ->> 'is_platform_admin')::BOOLEAN,
        false
    );
$$;

-- Check if caller is a tenant admin
CREATE OR REPLACE FUNCTION platform.is_tenant_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE
AS $$
    SELECT COALESCE(
        ((current_setting('request.jwt.claims', true)::jsonb) ->> 'is_tenant_admin')::BOOLEAN,
        false
    );
$$;

-- Get caller's role for a specific product
CREATE OR REPLACE FUNCTION platform.get_product_role(product_slug TEXT)
RETURNS TEXT
LANGUAGE sql STABLE
AS $$
    SELECT ((current_setting('request.jwt.claims', true)::jsonb) -> 'products') ->> product_slug;
$$;

-- Check if caller's account is active (DB lookup for instant revocation)
-- This hits the database on every query — intentional for security.
-- Even if a user has a valid JWT, deactivating them takes effect immediately.
CREATE OR REPLACE FUNCTION platform.is_active_user()
RETURNS BOOLEAN
LANGUAGE sql STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM platform.users
        WHERE auth_id = auth.uid()
        AND is_active = true
    );
$$;

-- ============================================================
-- STEP 5: Custom access token hook
-- ============================================================
-- Called by Supabase Auth on every token issue/refresh.
-- Injects custom claims: tenant_id, admin flags, product roles map.
--
-- JWT claims format:
-- {
--   "tenant_id": "uuid",
--   "is_platform_admin": false,
--   "is_tenant_admin": true,
--   "products": {
--     "compliance": "branch_manager",
--     "sales": "sales_rep",
--     "permits": "product_admin"
--   }
-- }

CREATE OR REPLACE FUNCTION platform.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = platform
AS $$
DECLARE
    claims jsonb;
    platform_user_id UUID;
    user_tenant_id UUID;
    user_is_platform_admin BOOLEAN;
    user_is_tenant_admin BOOLEAN;
    user_is_active BOOLEAN;
    product_roles jsonb;
BEGIN
    claims := event -> 'claims';

    -- Look up user in platform.users by their Supabase Auth ID
    SELECT u.id, u.tenant_id, u.is_platform_admin, u.is_tenant_admin, u.is_active
    INTO platform_user_id, user_tenant_id, user_is_platform_admin, user_is_tenant_admin, user_is_active
    FROM platform.users u
    WHERE u.auth_id = (event ->> 'user_id')::UUID;

    -- User not found or deactivated: return minimal claims
    IF NOT FOUND OR NOT user_is_active THEN
        claims := jsonb_set(claims, '{tenant_id}', 'null'::jsonb);
        claims := jsonb_set(claims, '{is_platform_admin}', 'false'::jsonb);
        claims := jsonb_set(claims, '{is_tenant_admin}', 'false'::jsonb);
        claims := jsonb_set(claims, '{products}', '{}'::jsonb);
        RETURN jsonb_set(event, '{claims}', claims);
    END IF;

    -- Build product roles map: {"sales": "product_admin", "compliance": "technician"}
    SELECT COALESCE(jsonb_object_agg(p.slug, upa.role), '{}'::jsonb)
    INTO product_roles
    FROM platform.user_product_access upa
    JOIN platform.products p ON p.id = upa.product_id
    WHERE upa.user_id = platform_user_id;

    -- Inject custom claims
    claims := jsonb_set(claims, '{tenant_id}', to_jsonb(user_tenant_id));
    claims := jsonb_set(claims, '{is_platform_admin}', to_jsonb(user_is_platform_admin));
    claims := jsonb_set(claims, '{is_tenant_admin}', to_jsonb(user_is_tenant_admin));
    claims := jsonb_set(claims, '{products}', product_roles);

    RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

-- Restrict hook execution: only Supabase Auth internals should call it
REVOKE EXECUTE ON FUNCTION platform.custom_access_token_hook FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION platform.custom_access_token_hook FROM authenticated;
REVOKE EXECUTE ON FUNCTION platform.custom_access_token_hook FROM anon;

-- Grant to supabase_auth_admin (required for Supabase Auth hooks)
GRANT USAGE ON SCHEMA platform TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION platform.custom_access_token_hook TO supabase_auth_admin;

-- The hook reads from these tables (via SECURITY DEFINER, but explicit grants are cleaner)
GRANT SELECT ON platform.users TO supabase_auth_admin;
GRANT SELECT ON platform.user_product_access TO supabase_auth_admin;
GRANT SELECT ON platform.products TO supabase_auth_admin;

-- ============================================================
-- STEP 6: RLS policies on platform.user_product_access
-- ============================================================
-- Who can see/manage product access:
--   - Users can see their own access
--   - Tenant admins can manage all access within their tenant
--   - Product admins can manage access for their specific product within their tenant
--   - Platform admins can manage everything

-- SELECT: see your own access, or admin views
CREATE POLICY user_product_access_select ON platform.user_product_access
    FOR SELECT TO authenticated
    USING (
        user_id = (SELECT u.id FROM platform.users u WHERE u.auth_id = auth.uid())
        OR platform.is_platform_admin()
        OR (
            platform.is_tenant_admin()
            AND user_id IN (
                SELECT u.id FROM platform.users u
                WHERE u.tenant_id = platform.get_tenant_id()
            )
        )
    );

-- INSERT: admins can grant product access within their scope
CREATE POLICY user_product_access_insert ON platform.user_product_access
    FOR INSERT TO authenticated
    WITH CHECK (
        platform.is_platform_admin()
        OR (
            -- Tenant admins can grant any product access within their tenant
            platform.is_tenant_admin()
            AND user_id IN (
                SELECT u.id FROM platform.users u
                WHERE u.tenant_id = platform.get_tenant_id()
            )
        )
        OR (
            -- Product admins can grant access to their specific product
            product_id IN (
                SELECT upa.product_id FROM platform.user_product_access upa
                WHERE upa.user_id = (SELECT u.id FROM platform.users u WHERE u.auth_id = auth.uid())
                AND upa.role = 'product_admin'
            )
            AND user_id IN (
                SELECT u.id FROM platform.users u
                WHERE u.tenant_id = platform.get_tenant_id()
            )
        )
    );

-- UPDATE: same scope as INSERT
CREATE POLICY user_product_access_update ON platform.user_product_access
    FOR UPDATE TO authenticated
    USING (
        platform.is_platform_admin()
        OR (
            platform.is_tenant_admin()
            AND user_id IN (
                SELECT u.id FROM platform.users u
                WHERE u.tenant_id = platform.get_tenant_id()
            )
        )
        OR (
            product_id IN (
                SELECT upa.product_id FROM platform.user_product_access upa
                WHERE upa.user_id = (SELECT u.id FROM platform.users u WHERE u.auth_id = auth.uid())
                AND upa.role = 'product_admin'
            )
            AND user_id IN (
                SELECT u.id FROM platform.users u
                WHERE u.tenant_id = platform.get_tenant_id()
            )
        )
    );

-- DELETE: same scope as INSERT
CREATE POLICY user_product_access_delete ON platform.user_product_access
    FOR DELETE TO authenticated
    USING (
        platform.is_platform_admin()
        OR (
            platform.is_tenant_admin()
            AND user_id IN (
                SELECT u.id FROM platform.users u
                WHERE u.tenant_id = platform.get_tenant_id()
            )
        )
        OR (
            product_id IN (
                SELECT upa.product_id FROM platform.user_product_access upa
                WHERE upa.user_id = (SELECT u.id FROM platform.users u WHERE u.auth_id = auth.uid())
                AND upa.role = 'product_admin'
            )
            AND user_id IN (
                SELECT u.id FROM platform.users u
                WHERE u.tenant_id = platform.get_tenant_id()
            )
        )
    );

-- ============================================================
-- STEP 7: Grants
-- ============================================================

-- Authenticated users interact via RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.user_product_access TO authenticated;

-- Service role bypasses RLS (sync engine, admin tools)
GRANT ALL ON platform.user_product_access TO service_role;

-- app_user role (if it exists, used by some compliance/permits apps)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
        GRANT SELECT ON platform.user_product_access TO app_user;
    END IF;
END $$;

-- Grant execute on helper functions to authenticated
GRANT EXECUTE ON FUNCTION platform.get_tenant_id TO authenticated;
GRANT EXECUTE ON FUNCTION platform.has_product_access TO authenticated;
GRANT EXECUTE ON FUNCTION platform.is_platform_admin TO authenticated;
GRANT EXECUTE ON FUNCTION platform.is_tenant_admin TO authenticated;
GRANT EXECUTE ON FUNCTION platform.get_product_role TO authenticated;
GRANT EXECUTE ON FUNCTION platform.is_active_user TO authenticated;

-- Service role also needs these
GRANT EXECUTE ON FUNCTION platform.get_tenant_id TO service_role;
GRANT EXECUTE ON FUNCTION platform.has_product_access TO service_role;
GRANT EXECUTE ON FUNCTION platform.is_platform_admin TO service_role;
GRANT EXECUTE ON FUNCTION platform.is_tenant_admin TO service_role;
GRANT EXECUTE ON FUNCTION platform.get_product_role TO service_role;
GRANT EXECUTE ON FUNCTION platform.is_active_user TO service_role;

-- ============================================================
-- STEP 8: Compatibility view
-- ============================================================

CREATE VIEW public.user_product_access AS SELECT * FROM platform.user_product_access;
GRANT SELECT ON public.user_product_access TO authenticated;
GRANT ALL ON public.user_product_access TO service_role;

COMMIT;

-- ============================================================
-- VERIFICATION QUERIES (run after the migration)
-- ============================================================
--
-- 1. Verify new columns on platform.users:
--    SELECT column_name, data_type, column_default
--    FROM information_schema.columns
--    WHERE table_schema = 'platform' AND table_name = 'users'
--    AND column_name IN ('is_platform_admin', 'is_tenant_admin', 'is_active', 'revoked_at');
--
-- 2. Verify product slugs:
--    SELECT id, name, slug FROM platform.products;
--
-- 3. Verify user_product_access table exists with RLS:
--    SELECT tablename, rowsecurity
--    FROM pg_tables
--    WHERE schemaname = 'platform' AND tablename = 'user_product_access';
--
-- 4. Verify RLS policies on user_product_access:
--    SELECT policyname, cmd, roles
--    FROM pg_policies
--    WHERE schemaname = 'platform' AND tablename = 'user_product_access';
--
-- 5. Verify custom hook function exists:
--    SELECT routine_name, security_type
--    FROM information_schema.routines
--    WHERE routine_schema = 'platform' AND routine_name = 'custom_access_token_hook';
--
-- 6. Verify helper functions exist:
--    SELECT routine_name
--    FROM information_schema.routines
--    WHERE routine_schema = 'platform'
--    AND routine_name IN ('get_tenant_id', 'has_product_access', 'is_platform_admin',
--                         'is_tenant_admin', 'get_product_role', 'is_active_user');
--
-- 7. Verify supabase_auth_admin has execute permission on hook:
--    SELECT grantee, privilege_type
--    FROM information_schema.routine_privileges
--    WHERE routine_schema = 'platform' AND routine_name = 'custom_access_token_hook';
--
-- NEXT STEP: Enable the hook in Supabase Dashboard:
--   Authentication → Hooks → Custom Access Token
--   Schema: platform
--   Function: custom_access_token_hook
