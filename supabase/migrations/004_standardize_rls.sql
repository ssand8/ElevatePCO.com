-- ============================================================
-- PHASE 4: STANDARDIZE RLS POLICIES
-- ============================================================
-- Replaces all old RLS policies with standardized patterns:
--
-- DATA WAREHOUSE:  tenant_id = platform.get_tenant_id()  (SELECT only)
-- PRODUCT TABLES:  tenant_id + has_product_access('slug') (full CRUD)
-- ALL POLICIES:    include platform.is_active_user() for instant revocation
--
-- Product slug → schema mapping:
--   pay        → sales
--   compliance → compliance
--   permits    → permits
--   execution  → execution
--   dashboards → finance
--
-- NOTE: After this migration, users must re-authenticate (or wait for JWT
-- refresh) to get the new claims from the custom hook. During the refresh
-- window (~1 hour), users with old JWTs will lose access.
-- ============================================================

BEGIN;

-- ============================================================
-- STEP 1: Helper function for QBO realm-based isolation
-- ============================================================
-- QBO tables from the old quickbooks schema use realm_id (not tenant_id).
-- This maps the current tenant to their QBO realm_id via platform.tenants.

CREATE OR REPLACE FUNCTION platform.get_qbo_realm_id()
RETURNS TEXT
LANGUAGE sql STABLE
AS $$
    SELECT qbo_realm_id FROM platform.tenants WHERE id = platform.get_tenant_id();
$$;

GRANT EXECUTE ON FUNCTION platform.get_qbo_realm_id TO authenticated, service_role;

-- ============================================================
-- STEP 2: Create temporary helper for batch policy creation
-- ============================================================
-- Creates SELECT/INSERT/UPDATE/DELETE policies for product schema tables.
-- Dropped at end of migration.

CREATE OR REPLACE FUNCTION pg_temp.create_product_policies(
    p_schema TEXT, p_slug TEXT, p_tables TEXT[]
) RETURNS void AS $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY p_tables
    LOOP
        EXECUTE format(
            'CREATE POLICY %I ON %I.%I FOR SELECT TO authenticated
             USING (tenant_id = platform.get_tenant_id()
                 AND (platform.has_product_access(%L) OR platform.is_tenant_admin() OR platform.is_platform_admin())
                 AND platform.is_active_user())',
            tbl || '_select', p_schema, tbl, p_slug);
        EXECUTE format(
            'CREATE POLICY %I ON %I.%I FOR INSERT TO authenticated
             WITH CHECK (tenant_id = platform.get_tenant_id()
                 AND (platform.has_product_access(%L) OR platform.is_tenant_admin() OR platform.is_platform_admin())
                 AND platform.is_active_user())',
            tbl || '_insert', p_schema, tbl, p_slug);
        EXECUTE format(
            'CREATE POLICY %I ON %I.%I FOR UPDATE TO authenticated
             USING (tenant_id = platform.get_tenant_id()
                 AND (platform.has_product_access(%L) OR platform.is_tenant_admin() OR platform.is_platform_admin())
                 AND platform.is_active_user())',
            tbl || '_update', p_schema, tbl, p_slug);
        EXECUTE format(
            'CREATE POLICY %I ON %I.%I FOR DELETE TO authenticated
             USING (tenant_id = platform.get_tenant_id()
                 AND (platform.has_product_access(%L) OR platform.is_tenant_admin() OR platform.is_platform_admin())
                 AND platform.is_active_user())',
            tbl || '_delete', p_schema, tbl, p_slug);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- STEP 3: Drop ALL old policies (except user_product_access from Phase 3)
-- ============================================================
-- Clean slate: removes ~100 old policies across all schemas.
-- These used inconsistent patterns (get_user_tenant_ids(), app_user role,
-- realm_isolation, duplicate policies per table, etc.)

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname IN ('platform', 'data_warehouse', 'sales', 'compliance', 'permits', 'execution')
        AND NOT (schemaname = 'platform' AND tablename = 'user_product_access')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
            r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- ============================================================
-- STEP 4: Ensure RLS is enabled on all tables
-- ============================================================
-- Some tables may have been moved without RLS enabled.

ALTER TABLE data_warehouse.dispositionsai_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_warehouse.dispositionsai_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_warehouse.dispositionsai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_warehouse.sync_tenant_data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_warehouse.fr_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_warehouse.qbo_oauth_tokens ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 5: Platform schema policies
-- ============================================================

-- products: readable by everyone (marketing site uses anon)
CREATE POLICY products_select ON platform.products
    FOR SELECT TO authenticated, anon
    USING (true);

-- tenants: own tenant + platform admin
CREATE POLICY tenants_select ON platform.tenants
    FOR SELECT TO authenticated
    USING (
        (id = platform.get_tenant_id() OR platform.is_platform_admin())
        AND platform.is_active_user()
    );

-- tenant_products: own tenant + platform admin
CREATE POLICY tenant_products_select ON platform.tenant_products
    FOR SELECT TO authenticated
    USING (
        (tenant_id = platform.get_tenant_id() OR platform.is_platform_admin())
        AND platform.is_active_user()
    );

-- users: see self + all tenant members + platform admin sees all
CREATE POLICY users_select ON platform.users
    FOR SELECT TO authenticated
    USING (
        (auth_id = auth.uid() OR tenant_id = platform.get_tenant_id() OR platform.is_platform_admin())
        AND platform.is_active_user()
    );

-- users: can only update own record
CREATE POLICY users_update_own ON platform.users
    FOR UPDATE TO authenticated
    USING (auth_id = auth.uid() AND platform.is_active_user());

-- tenant_users: read own tenant
CREATE POLICY tenant_users_select ON platform.tenant_users
    FOR SELECT TO authenticated
    USING (
        (tenant_id = platform.get_tenant_id() OR platform.is_platform_admin())
        AND platform.is_active_user()
    );

-- tenant_users: admins can add/modify users in their tenant
CREATE POLICY tenant_users_insert ON platform.tenant_users
    FOR INSERT TO authenticated
    WITH CHECK (
        tenant_id = platform.get_tenant_id()
        AND (platform.is_tenant_admin() OR platform.is_platform_admin())
        AND platform.is_active_user()
    );

CREATE POLICY tenant_users_update ON platform.tenant_users
    FOR UPDATE TO authenticated
    USING (
        tenant_id = platform.get_tenant_id()
        AND (platform.is_tenant_admin() OR platform.is_platform_admin())
        AND platform.is_active_user()
    );

CREATE POLICY tenant_users_delete ON platform.tenant_users
    FOR DELETE TO authenticated
    USING (
        tenant_id = platform.get_tenant_id()
        AND (platform.is_tenant_admin() OR platform.is_platform_admin())
        AND platform.is_active_user()
    );

-- ============================================================
-- STEP 6: Data warehouse policies (SELECT only)
-- ============================================================
-- All data_warehouse tables are read-only for authenticated (Phase 1).
-- Written to by sync engine via service_role (bypasses RLS).

-- Tenant-id based tables
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'fr_appointments', 'fr_customers', 'fr_employees', 'fr_chemicals',
        'fr_chemical_uses', 'fr_invoices', 'fr_payments', 'fr_subscriptions',
        'fr_service_types', 'fr_locations', 'fr_branches',
        'applause_ratings', 'applause_reviews',
        'azuga_driving_scores',
        'ghl_contacts', 'ghl_opportunities', 'ghl_pipelines',
        'gusto_daily_hours',
        'qbo_accounts', 'qbo_balance_sheet', 'qbo_general_ledger',
        'qbo_profit_loss', 'qbo_trial_balance',
        'sync_log', 'sync_tenant_data_sources'
    ]
    LOOP
        EXECUTE format(
            'CREATE POLICY %I ON data_warehouse.%I
             FOR SELECT TO authenticated
             USING (tenant_id = platform.get_tenant_id() AND platform.is_active_user())',
            tbl || '_select', tbl);
    END LOOP;
END $$;

-- QBO realm_id based tables (from old quickbooks schema, no tenant_id yet)
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'qbo_accounts_detail', 'qbo_bills', 'qbo_customers', 'qbo_invoices',
        'qbo_journal_entries', 'qbo_payments', 'qbo_purchases',
        'qbo_sales_receipts', 'qbo_vendors', 'qbo_sync_errors', 'qbo_sync_jobs'
    ]
    LOOP
        EXECUTE format(
            'CREATE POLICY %I ON data_warehouse.%I
             FOR SELECT TO authenticated
             USING (realm_id = platform.get_qbo_realm_id() AND platform.is_active_user())',
            tbl || '_select', tbl);
    END LOOP;
END $$;

-- qbo_oauth_tokens: NO policy — service_role only (sensitive tokens)
-- dispositionsai_calls/transcripts/analyses: NO policy — no tenant_id column,
--   accessed via service_role (DispositionsAI pipeline). Product views will
--   expose this data with proper tenant checks in Phase 5.
-- RLS enabled + no authenticated policy = deny all for non-superusers

-- ============================================================
-- STEP 7: Product schema policies (full CRUD)
-- ============================================================
-- Each product schema requires the matching product slug for access.
-- Tenant admins and platform admins bypass product access checks.

-- Sales schema (product slug: 'pay')
SELECT pg_temp.create_product_policies('sales', 'pay', ARRAY[
    'payscales', 'payscale_assignments', 'override_assignments',
    'tenant_kpis', 'tenant_field_definitions', 'user_fieldroutes_ids', 'user_branches',
    'qualified_leads'
]);

-- payscale_tiers: no tenant_id — isolate through parent payscales.tenant_id
CREATE POLICY payscale_tiers_select ON sales.payscale_tiers FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM sales.payscales ps
        WHERE ps.id = payscale_id
        AND ps.tenant_id = platform.get_tenant_id()
        AND (platform.has_product_access('pay') OR platform.is_tenant_admin() OR platform.is_platform_admin())
        AND platform.is_active_user()
    ));
CREATE POLICY payscale_tiers_insert ON sales.payscale_tiers FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM sales.payscales ps
        WHERE ps.id = payscale_id
        AND ps.tenant_id = platform.get_tenant_id()
        AND (platform.has_product_access('pay') OR platform.is_tenant_admin() OR platform.is_platform_admin())
        AND platform.is_active_user()
    ));
CREATE POLICY payscale_tiers_update ON sales.payscale_tiers FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM sales.payscales ps
        WHERE ps.id = payscale_id
        AND ps.tenant_id = platform.get_tenant_id()
        AND (platform.has_product_access('pay') OR platform.is_tenant_admin() OR platform.is_platform_admin())
        AND platform.is_active_user()
    ));
CREATE POLICY payscale_tiers_delete ON sales.payscale_tiers FOR DELETE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM sales.payscales ps
        WHERE ps.id = payscale_id
        AND ps.tenant_id = platform.get_tenant_id()
        AND (platform.has_product_access('pay') OR platform.is_tenant_admin() OR platform.is_platform_admin())
        AND platform.is_active_user()
    ));

-- Compliance schema (product slug: 'compliance')
SELECT pg_temp.create_product_policies('compliance', 'compliance', ARRAY[
    'instruction_templates', 'instruction_template_products',
    'insects', 'application_methods', 'custom_notes'
]);

-- Permits schema (product slug: 'permits')
SELECT pg_temp.create_product_policies('permits', 'permits', ARRAY[
    'permit_reps', 'permit_rep_profiles', 'permit_templates',
    'rep_permits', 'towns', 'teams', 'team_members',
    'rep_invite_tokens', 'password_reset_tokens'
]);

-- Execution schema (product slug: 'execution')
SELECT pg_temp.create_product_policies('execution', 'execution', ARRAY[
    'goals', 'milestones', 'tasks', 'visions', 'positions', 'comments'
]);

-- ============================================================
-- STEP 8: app_user backward compatibility policies
-- ============================================================
-- The app_user PostgreSQL role is used by some compliance/permits apps.
-- These simple tenant_isolation policies maintain access until Phase 6
-- migrates those apps to Supabase Auth (authenticated role).

DO $$
DECLARE
    tbl TEXT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
        RETURN;
    END IF;

    -- Compliance tables
    FOREACH tbl IN ARRAY ARRAY[
        'instruction_templates', 'instruction_template_products',
        'insects', 'application_methods', 'custom_notes'
    ]
    LOOP
        EXECUTE format(
            'CREATE POLICY %I ON compliance.%I
             FOR SELECT TO app_user
             USING (tenant_id = platform.get_tenant_id())',
            'app_user_' || tbl || '_select', tbl);
    END LOOP;

    -- Data warehouse tables used by compliance app
    FOREACH tbl IN ARRAY ARRAY[
        'fr_appointments', 'fr_chemicals', 'fr_chemical_uses',
        'fr_customers', 'fr_employees', 'fr_locations', 'fr_service_types'
    ]
    LOOP
        EXECUTE format(
            'CREATE POLICY %I ON data_warehouse.%I
             FOR SELECT TO app_user
             USING (tenant_id = platform.get_tenant_id())',
            'app_user_' || tbl || '_select', tbl);
    END LOOP;
END $$;

COMMIT;

-- ============================================================
-- VERIFICATION QUERIES (run after the migration)
-- ============================================================
--
-- 1. Count policies per schema (should be ~130+):
--    SELECT schemaname, count(*)
--    FROM pg_policies
--    WHERE schemaname IN ('platform','data_warehouse','sales','compliance','permits','execution')
--    GROUP BY schemaname
--    ORDER BY schemaname;
--
-- 2. Verify no old policies remain (should return 0):
--    SELECT count(*)
--    FROM pg_policies
--    WHERE schemaname IN ('platform','data_warehouse','sales','compliance','permits','execution')
--    AND policyname IN (
--        'tenant_isolation', 'app_user_tenant_isolation', 'realm_isolation',
--        'appointments_tenant_isolation', 'chemicals_tenant_isolation',
--        'customers_tenant_isolation', 'employees_tenant_isolation',
--        'ee_comments_select', 'ee_goals_select', 'ee_tasks_select'
--    );
--
-- 3. Verify product access enforcement (should show product policies):
--    SELECT schemaname, tablename, policyname
--    FROM pg_policies
--    WHERE schemaname IN ('sales','compliance','permits','execution')
--    ORDER BY schemaname, tablename, policyname;
--
-- 4. Verify data warehouse is SELECT-only:
--    SELECT DISTINCT cmd
--    FROM pg_policies
--    WHERE schemaname = 'data_warehouse'
--    AND roles::text LIKE '%authenticated%';
--    -- Should only show 'SELECT'
--
-- 5. Verify all policies include is_active_user():
--    SELECT schemaname, tablename, policyname
--    FROM pg_policies
--    WHERE schemaname IN ('platform','data_warehouse','sales','compliance','permits','execution')
--    AND qual NOT LIKE '%is_active_user%'
--    AND with_check NOT LIKE '%is_active_user%'
--    AND NOT (schemaname = 'platform' AND tablename = 'products')
--    AND NOT (schemaname = 'platform' AND tablename = 'user_product_access')
--    AND roles::text NOT LIKE '%app_user%';
--    -- Should return 0 rows (only products and app_user policies skip is_active_user)
