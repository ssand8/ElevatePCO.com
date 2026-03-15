-- ============================================================
-- PHASE 7: AUDIT LOGGING
-- ============================================================
-- Creates an append-only audit log for sensitive operations:
--   - User management (platform.users)
--   - Product access changes (platform.user_product_access)
--   - Tenant configuration (platform.tenants)
--   - Tenant user membership (platform.tenant_users)
--   - OAuth credential changes (platform.qbo_oauth_credentials)
--
-- Design:
--   - INSERT-only for authenticated (no UPDATE/DELETE grants)
--   - Triggers fire AFTER INSERT/UPDATE/DELETE on watched tables
--   - Captures who, what, when, old data, new data
--   - auth.uid() identifies the actor from JWT
--   - service_role operations are logged with actor_id = NULL
-- ============================================================

BEGIN;

-- ============================================================
-- STEP 1: Create the audit_log table
-- ============================================================

CREATE TABLE platform.audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actor_id UUID,                          -- auth.uid() of who did it (NULL for service_role)
    tenant_id UUID,                         -- tenant context (from JWT claims)
    action TEXT NOT NULL,                    -- 'INSERT', 'UPDATE', 'DELETE'
    schema_name TEXT NOT NULL,
    table_name TEXT NOT NULL,
    row_id TEXT,                             -- primary key of affected row (text for flexibility)
    old_data JSONB,                          -- previous row state (UPDATE/DELETE)
    new_data JSONB,                          -- new row state (INSERT/UPDATE)
    ip_address INET,                         -- request IP if available
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partition-friendly index on created_at for time-based queries
CREATE INDEX idx_audit_log_created_at ON platform.audit_log(created_at);
-- Actor lookup
CREATE INDEX idx_audit_log_actor_id ON platform.audit_log(actor_id) WHERE actor_id IS NOT NULL;
-- Table + action lookup
CREATE INDEX idx_audit_log_table_action ON platform.audit_log(schema_name, table_name, action);
-- Tenant scoping
CREATE INDEX idx_audit_log_tenant_id ON platform.audit_log(tenant_id) WHERE tenant_id IS NOT NULL;

-- RLS: authenticated can INSERT (via triggers) and SELECT their tenant's logs
ALTER TABLE platform.audit_log ENABLE ROW LEVEL SECURITY;

-- Platform admins see all logs; tenant admins see their tenant's logs
CREATE POLICY audit_log_select ON platform.audit_log
    FOR SELECT TO authenticated
    USING (
        platform.is_platform_admin()
        OR (tenant_id = platform.get_tenant_id() AND platform.is_tenant_admin())
    );

-- No INSERT/UPDATE/DELETE policies for authenticated —
-- only triggers (running as trigger owner) write to this table.
-- Service role bypasses RLS for direct queries if needed.

GRANT SELECT ON platform.audit_log TO authenticated;
GRANT ALL ON platform.audit_log TO service_role;

-- ============================================================
-- STEP 2: Generic audit trigger function
-- ============================================================
-- A single function handles all watched tables. It captures the
-- operation type, old/new row data, and actor context from JWT.

CREATE OR REPLACE FUNCTION platform.audit_trigger_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = platform
AS $$
DECLARE
    v_actor_id UUID;
    v_tenant_id UUID;
    v_row_id TEXT;
    v_old_data JSONB;
    v_new_data JSONB;
    v_ip INET;
BEGIN
    -- Get actor context from JWT (NULL if service_role / no JWT)
    BEGIN
        v_actor_id := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        v_actor_id := NULL;
    END;

    BEGIN
        v_tenant_id := platform.get_tenant_id();
    EXCEPTION WHEN OTHERS THEN
        v_tenant_id := NULL;
    END;

    -- Try to get request IP
    BEGIN
        v_ip := inet(current_setting('request.headers', true)::jsonb ->> 'x-forwarded-for');
    EXCEPTION WHEN OTHERS THEN
        v_ip := NULL;
    END;

    -- Determine row ID and data based on operation
    IF TG_OP = 'DELETE' THEN
        v_row_id := OLD.id::TEXT;
        v_old_data := to_jsonb(OLD);
        v_new_data := NULL;
    ELSIF TG_OP = 'INSERT' THEN
        v_row_id := NEW.id::TEXT;
        v_old_data := NULL;
        v_new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        v_row_id := NEW.id::TEXT;
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
    END IF;

    -- Scrub sensitive fields from logged data
    IF v_old_data IS NOT NULL THEN
        v_old_data := v_old_data - 'access_token' - 'refresh_token';
    END IF;
    IF v_new_data IS NOT NULL THEN
        v_new_data := v_new_data - 'access_token' - 'refresh_token';
    END IF;

    INSERT INTO platform.audit_log (
        actor_id, tenant_id, action,
        schema_name, table_name, row_id,
        old_data, new_data, ip_address
    ) VALUES (
        v_actor_id, v_tenant_id, TG_OP,
        TG_TABLE_SCHEMA, TG_TABLE_NAME, v_row_id,
        v_old_data, v_new_data, v_ip
    );

    -- Return appropriate row for the trigger type
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

-- ============================================================
-- STEP 3: Attach triggers to sensitive tables
-- ============================================================

-- platform.users — track admin flag changes, deactivation, profile updates
CREATE TRIGGER audit_users
    AFTER INSERT OR UPDATE OR DELETE ON platform.users
    FOR EACH ROW EXECUTE FUNCTION platform.audit_trigger_fn();

-- platform.user_product_access — track product access grants/revocations
CREATE TRIGGER audit_user_product_access
    AFTER INSERT OR UPDATE OR DELETE ON platform.user_product_access
    FOR EACH ROW EXECUTE FUNCTION platform.audit_trigger_fn();

-- platform.tenants — track tenant configuration changes
CREATE TRIGGER audit_tenants
    AFTER INSERT OR UPDATE OR DELETE ON platform.tenants
    FOR EACH ROW EXECUTE FUNCTION platform.audit_trigger_fn();

-- platform.tenant_users — track user membership changes
CREATE TRIGGER audit_tenant_users
    AFTER INSERT OR UPDATE OR DELETE ON platform.tenant_users
    FOR EACH ROW EXECUTE FUNCTION platform.audit_trigger_fn();

-- platform.tenant_products — track product subscription changes
CREATE TRIGGER audit_tenant_products
    AFTER INSERT OR UPDATE OR DELETE ON platform.tenant_products
    FOR EACH ROW EXECUTE FUNCTION platform.audit_trigger_fn();

-- platform.qbo_oauth_credentials — track OAuth token changes (tokens scrubbed)
CREATE TRIGGER audit_qbo_oauth_credentials
    AFTER INSERT OR UPDATE OR DELETE ON platform.qbo_oauth_credentials
    FOR EACH ROW EXECUTE FUNCTION platform.audit_trigger_fn();

COMMIT;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
--
-- 1. Verify audit_log table exists with correct columns:
--    SELECT column_name, data_type
--    FROM information_schema.columns
--    WHERE table_schema = 'platform' AND table_name = 'audit_log'
--    ORDER BY ordinal_position;
--
-- 2. Verify triggers are attached:
--    SELECT event_object_schema, event_object_table, trigger_name
--    FROM information_schema.triggers
--    WHERE trigger_schema = 'platform'
--    AND trigger_name LIKE 'audit_%'
--    ORDER BY event_object_table;
--
-- 3. Test: update a user and check the log:
--    UPDATE platform.users SET is_active = true WHERE id = (
--      SELECT id FROM platform.users LIMIT 1
--    );
--    SELECT action, table_name, row_id, actor_id, created_at
--    FROM platform.audit_log
--    ORDER BY created_at DESC LIMIT 5;
--
-- 4. Verify RLS on audit_log (as non-admin, should see 0 rows):
--    SELECT count(*) FROM platform.audit_log;
--
-- 5. Verify sensitive fields are scrubbed:
--    -- After a QBO credential change, check:
--    SELECT new_data ? 'access_token' AS has_token
--    FROM platform.audit_log
--    WHERE table_name = 'qbo_oauth_credentials'
--    ORDER BY created_at DESC LIMIT 1;
--    -- Should return false
