-- ============================================================
-- PHASE 5: SECURE DATA WAREHOUSE ACCESS
-- ============================================================
-- Two objectives:
--   A) Create product-specific views over data_warehouse tables.
--      Each view gates access by product slug so a user with only
--      Sales access cannot read Compliance data, even within the
--      same tenant. The underlying RLS on data_warehouse tables
--      still enforces tenant isolation + is_active_user().
--
--   B) Isolate QBO OAuth tokens from authenticated users.
--      Move tokens out of platform.tenants (visible to all tenant
--      members) into a separate table with no authenticated RLS
--      policies (service_role only).
--
-- NOTE: Direct SELECT on data_warehouse is NOT revoked here.
-- That happens in Phase 6 after apps migrate to product views.
-- These views use SECURITY INVOKER (default), so the underlying
-- RLS on data_warehouse tables still applies.
-- ============================================================

BEGIN;

-- ============================================================
-- PART A: PRODUCT-SPECIFIC VIEWS
-- ============================================================

-- Helper to batch-create product views over data_warehouse tables.
-- Each view adds a product access gate; tenant isolation and
-- is_active_user() are enforced by the underlying DW table's RLS.
CREATE OR REPLACE FUNCTION pg_temp.create_dw_views(
    p_schema TEXT, p_slug TEXT, p_tables TEXT[]
) RETURNS void AS $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY p_tables
    LOOP
        EXECUTE format(
            'CREATE OR REPLACE VIEW %I.%I AS
             SELECT * FROM data_warehouse.%I
             WHERE (platform.has_product_access(%L)
                 OR platform.is_tenant_admin()
                 OR platform.is_platform_admin())',
            p_schema, tbl, tbl, p_slug);

        EXECUTE format(
            'GRANT SELECT ON %I.%I TO authenticated',
            p_schema, tbl);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------
-- Sales views (product slug: 'pay')
-- ----------------------------------------------------------
-- Sales Performance uses FR data (subscriptions, customers,
-- appointments, invoices, payments, employees, branches,
-- service_types, locations), GHL, Applause, Azuga, Gusto,
-- QBO summary tables, and sync metadata.

SELECT pg_temp.create_dw_views('sales', 'pay', ARRAY[
    -- FieldRoutes
    'fr_appointments', 'fr_customers', 'fr_employees',
    'fr_invoices', 'fr_payments', 'fr_subscriptions',
    'fr_service_types', 'fr_locations', 'fr_branches',
    -- Applause
    'applause_ratings', 'applause_reviews',
    -- Azuga
    'azuga_driving_scores',
    -- GoHighLevel
    'ghl_contacts', 'ghl_opportunities', 'ghl_pipelines',
    -- Gusto
    'gusto_daily_hours',
    -- QBO (tenant_id tables)
    'qbo_accounts', 'qbo_balance_sheet', 'qbo_general_ledger',
    'qbo_profit_loss', 'qbo_trial_balance',
    -- Sync metadata
    'sync_log', 'sync_tenant_data_sources'
]);

-- ----------------------------------------------------------
-- Compliance views (product slug: 'compliance')
-- ----------------------------------------------------------
-- Compliance app uses FR appointments, chemicals, chemical_uses,
-- customers, employees, locations, service_types.

SELECT pg_temp.create_dw_views('compliance', 'compliance', ARRAY[
    'fr_appointments', 'fr_chemicals', 'fr_chemical_uses',
    'fr_customers', 'fr_employees',
    'fr_locations', 'fr_service_types'
]);

-- ----------------------------------------------------------
-- Permits views (product slug: 'permits')
-- ----------------------------------------------------------
-- Permits app needs employee and location data for rep profiles
-- and service area management.

SELECT pg_temp.create_dw_views('permits', 'permits', ARRAY[
    'fr_employees', 'fr_customers', 'fr_locations', 'fr_branches'
]);

-- ----------------------------------------------------------
-- Execution views (product slug: 'execution')
-- ----------------------------------------------------------
-- Execution tracking needs employee and branch data for
-- assigning goals and org structure.

SELECT pg_temp.create_dw_views('execution', 'execution', ARRAY[
    'fr_employees', 'fr_branches'
]);

-- ----------------------------------------------------------
-- Finance views (product slug: 'dashboards')
-- ----------------------------------------------------------
-- Financial dashboards need all QBO data plus FR revenue data
-- and labor hours.

SELECT pg_temp.create_dw_views('finance', 'dashboards', ARRAY[
    -- QBO (tenant_id tables)
    'qbo_accounts', 'qbo_balance_sheet', 'qbo_general_ledger',
    'qbo_profit_loss', 'qbo_trial_balance',
    -- FR revenue data
    'fr_invoices', 'fr_payments',
    -- Labor costs
    'gusto_daily_hours',
    -- Sync metadata
    'sync_log', 'sync_tenant_data_sources'
]);

-- ----------------------------------------------------------
-- QBO realm_id views (special handling)
-- ----------------------------------------------------------
-- The QBO detail tables use realm_id (not tenant_id) for isolation.
-- The underlying RLS uses get_qbo_realm_id(). These views just add
-- the product access gate — same pattern as tenant_id views.

-- Sales needs QBO detail tables
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'qbo_accounts_detail', 'qbo_bills', 'qbo_customers',
        'qbo_invoices', 'qbo_journal_entries', 'qbo_payments',
        'qbo_purchases', 'qbo_sales_receipts', 'qbo_vendors'
    ]
    LOOP
        EXECUTE format(
            'CREATE OR REPLACE VIEW sales.%I AS
             SELECT * FROM data_warehouse.%I
             WHERE (platform.has_product_access(''pay'')
                 OR platform.is_tenant_admin()
                 OR platform.is_platform_admin())',
            tbl, tbl);
        EXECUTE format('GRANT SELECT ON sales.%I TO authenticated', tbl);
    END LOOP;
END $$;

-- Finance needs QBO detail tables too
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'qbo_accounts_detail', 'qbo_bills', 'qbo_customers',
        'qbo_invoices', 'qbo_journal_entries', 'qbo_payments',
        'qbo_purchases', 'qbo_sales_receipts', 'qbo_vendors'
    ]
    LOOP
        EXECUTE format(
            'CREATE OR REPLACE VIEW finance.%I AS
             SELECT * FROM data_warehouse.%I
             WHERE (platform.has_product_access(''dashboards'')
                 OR platform.is_tenant_admin()
                 OR platform.is_platform_admin())',
            tbl, tbl);
        EXECUTE format('GRANT SELECT ON finance.%I TO authenticated', tbl);
    END LOOP;
END $$;

-- ============================================================
-- PART B: ISOLATE QBO OAUTH TOKENS
-- ============================================================
-- Currently, QBO tokens live in platform.tenants columns and are
-- visible to any authenticated user in that tenant (via the
-- tenants_select RLS policy). Move tokens to a dedicated table
-- with no authenticated access (service_role only).

-- Step 1: Create the credentials table
CREATE TABLE IF NOT EXISTS platform.qbo_oauth_credentials (
    tenant_id UUID PRIMARY KEY REFERENCES platform.tenants(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    token_expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS enabled + no authenticated policies = deny all for non-service-role
ALTER TABLE platform.qbo_oauth_credentials ENABLE ROW LEVEL SECURITY;

-- Only service_role can read/write (bypasses RLS)
GRANT ALL ON platform.qbo_oauth_credentials TO service_role;
-- Explicitly deny authenticated (no GRANT = no access, but be explicit)
REVOKE ALL ON platform.qbo_oauth_credentials FROM authenticated;
REVOKE ALL ON platform.qbo_oauth_credentials FROM anon;

-- Step 2: Migrate existing tokens from tenants to new table
INSERT INTO platform.qbo_oauth_credentials (tenant_id, access_token, refresh_token, token_expires_at)
SELECT id, qbo_access_token, qbo_refresh_token, qbo_token_expires_at
FROM platform.tenants
WHERE qbo_access_token IS NOT NULL
  AND qbo_refresh_token IS NOT NULL
ON CONFLICT (tenant_id) DO UPDATE SET
    access_token = EXCLUDED.access_token,
    refresh_token = EXCLUDED.refresh_token,
    token_expires_at = EXCLUDED.token_expires_at,
    updated_at = now();

-- Step 3: Clear plaintext tokens from tenants table
-- (Keep the columns for now — Phase 6 will drop them after all apps are updated)
UPDATE platform.tenants
SET qbo_access_token = NULL,
    qbo_refresh_token = NULL,
    qbo_token_expires_at = NULL
WHERE qbo_access_token IS NOT NULL;

COMMIT;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
--
-- 1. Count product views per schema:
--    SELECT schemaname, count(*)
--    FROM pg_views
--    WHERE schemaname IN ('sales','compliance','permits','execution','finance')
--    AND viewname LIKE 'fr_%' OR viewname LIKE 'qbo_%' OR viewname LIKE 'applause_%'
--        OR viewname LIKE 'azuga_%' OR viewname LIKE 'ghl_%' OR viewname LIKE 'gusto_%'
--        OR viewname LIKE 'sync_%'
--    GROUP BY schemaname
--    ORDER BY schemaname;
--
-- 2. Verify a sample view returns data (as a user with 'pay' product access):
--    SELECT count(*) FROM sales.fr_customers;
--
-- 3. Verify QBO tokens moved to credentials table:
--    SELECT tenant_id, token_expires_at FROM platform.qbo_oauth_credentials;
--
-- 4. Verify tenants table tokens are cleared:
--    SELECT id, qbo_access_token IS NULL AS token_cleared
--    FROM platform.tenants
--    WHERE qbo_realm_id IS NOT NULL;
--
-- 5. Verify credentials table denies authenticated access:
--    -- As authenticated user, this should return 0 rows:
--    SELECT count(*) FROM platform.qbo_oauth_credentials;
