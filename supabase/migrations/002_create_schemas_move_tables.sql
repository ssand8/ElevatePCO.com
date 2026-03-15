-- ============================================================
-- PHASE 2: CREATE SCHEMAS + MOVE TABLES
-- ============================================================
-- Moves all tables from public (and quickbooks) into their
-- correct schemas per the architecture plan:
--   platform, data_warehouse, sales, compliance, permits, execution, finance
--
-- Creates compatibility views in public so existing apps
-- keep working without code changes. Simple views are
-- auto-updatable in PostgreSQL, so INSERT/UPDATE/DELETE
-- through the views works transparently.
--
-- Functions remain in public for now (moved in a later phase).
-- RLS policies move with their tables automatically.
-- Foreign keys across schemas work natively in PostgreSQL.
-- ============================================================

BEGIN;

-- ============================================================
-- STEP 1: Create new schemas
-- ============================================================

CREATE SCHEMA IF NOT EXISTS platform;
CREATE SCHEMA IF NOT EXISTS data_warehouse;
CREATE SCHEMA IF NOT EXISTS sales;
CREATE SCHEMA IF NOT EXISTS compliance;
CREATE SCHEMA IF NOT EXISTS permits;
CREATE SCHEMA IF NOT EXISTS execution;
CREATE SCHEMA IF NOT EXISTS finance;

-- ============================================================
-- STEP 2: Drop views that reference tables about to move
-- ============================================================
-- These views use unqualified table names that will break.
-- We recreate them with schema-qualified names in Step 7.

DROP VIEW IF EXISTS public.v_active_subscriptions;
DROP VIEW IF EXISTS public.v_employee_productivity;
DROP VIEW IF EXISTS public.v_revenue_by_month;

-- ============================================================
-- STEP 3: Move tables to platform schema
-- ============================================================
-- Core multi-tenant tables: tenants, users, products, access control

ALTER TABLE public.tenants SET SCHEMA platform;
ALTER TABLE public.products SET SCHEMA platform;
ALTER TABLE public.tenant_products SET SCHEMA platform;
ALTER TABLE public.users SET SCHEMA platform;
ALTER TABLE public.tenant_users SET SCHEMA platform;
-- user_product_access does not exist yet; will be created in Phase 3

-- ============================================================
-- STEP 4: Move tables to data_warehouse schema
-- ============================================================
-- All scraped/synced data from external systems

-- FieldRoutes: rename with fr_ prefix first, then move
ALTER TABLE public.appointments RENAME TO fr_appointments;
ALTER TABLE public.customers RENAME TO fr_customers;
ALTER TABLE public.employees RENAME TO fr_employees;
ALTER TABLE public.chemicals RENAME TO fr_chemicals;
ALTER TABLE public.chemical_uses RENAME TO fr_chemical_uses;
ALTER TABLE public.invoices RENAME TO fr_invoices;
ALTER TABLE public.payments RENAME TO fr_payments;
ALTER TABLE public.subscriptions RENAME TO fr_subscriptions;
ALTER TABLE public.service_types RENAME TO fr_service_types;
ALTER TABLE public.locations RENAME TO fr_locations;
ALTER TABLE public.branches RENAME TO fr_branches;

ALTER TABLE public.fr_appointments SET SCHEMA data_warehouse;
ALTER TABLE public.fr_customers SET SCHEMA data_warehouse;
ALTER TABLE public.fr_employees SET SCHEMA data_warehouse;
ALTER TABLE public.fr_chemicals SET SCHEMA data_warehouse;
ALTER TABLE public.fr_chemical_uses SET SCHEMA data_warehouse;
ALTER TABLE public.fr_invoices SET SCHEMA data_warehouse;
ALTER TABLE public.fr_payments SET SCHEMA data_warehouse;
ALTER TABLE public.fr_subscriptions SET SCHEMA data_warehouse;
ALTER TABLE public.fr_service_types SET SCHEMA data_warehouse;
ALTER TABLE public.fr_locations SET SCHEMA data_warehouse;
ALTER TABLE public.fr_branches SET SCHEMA data_warehouse;

-- Applause
ALTER TABLE public.applause_ratings SET SCHEMA data_warehouse;
ALTER TABLE public.applause_reviews SET SCHEMA data_warehouse;

-- Azuga
ALTER TABLE public.azuga_driving_scores SET SCHEMA data_warehouse;

-- GHL
ALTER TABLE public.ghl_contacts SET SCHEMA data_warehouse;
ALTER TABLE public.ghl_opportunities SET SCHEMA data_warehouse;
ALTER TABLE public.ghl_pipelines SET SCHEMA data_warehouse;

-- Gusto
ALTER TABLE public.gusto_daily_hours SET SCHEMA data_warehouse;

-- DispositionsAI: rename with dispositionsai_ prefix first, then move
ALTER TABLE public.calls RENAME TO dispositionsai_calls;
ALTER TABLE public.transcripts RENAME TO dispositionsai_transcripts;
ALTER TABLE public.analyses RENAME TO dispositionsai_analyses;

ALTER TABLE public.dispositionsai_calls SET SCHEMA data_warehouse;
ALTER TABLE public.dispositionsai_transcripts SET SCHEMA data_warehouse;
ALTER TABLE public.dispositionsai_analyses SET SCHEMA data_warehouse;

-- QuickBooks (from public schema)
ALTER TABLE public.qbo_accounts SET SCHEMA data_warehouse;
ALTER TABLE public.qbo_balance_sheet SET SCHEMA data_warehouse;
ALTER TABLE public.qbo_general_ledger SET SCHEMA data_warehouse;
ALTER TABLE public.qbo_profit_loss SET SCHEMA data_warehouse;
ALTER TABLE public.qbo_trial_balance SET SCHEMA data_warehouse;

-- Sync infrastructure: prefix with sync_ where not already prefixed
-- sync_log already has the prefix
ALTER TABLE public.tenant_data_sources RENAME TO sync_tenant_data_sources;

ALTER TABLE public.sync_log SET SCHEMA data_warehouse;
ALTER TABLE public.sync_tenant_data_sources SET SCHEMA data_warehouse;

-- ============================================================
-- STEP 5: Move tables to product schemas
-- ============================================================

-- Sales
ALTER TABLE public.payscales SET SCHEMA sales;
ALTER TABLE public.payscale_tiers SET SCHEMA sales;
ALTER TABLE public.payscale_assignments SET SCHEMA sales;
ALTER TABLE public.override_assignments SET SCHEMA sales;
ALTER TABLE public.tenant_kpis SET SCHEMA sales;
ALTER TABLE public.tenant_field_definitions SET SCHEMA sales;
ALTER TABLE public.user_fieldroutes_ids SET SCHEMA sales;
ALTER TABLE public.user_branches SET SCHEMA sales;
ALTER TABLE public.qualified_leads SET SCHEMA sales;

-- Compliance
ALTER TABLE public.instruction_templates SET SCHEMA compliance;
ALTER TABLE public.instruction_template_products SET SCHEMA compliance;
ALTER TABLE public.insects SET SCHEMA compliance;
ALTER TABLE public.application_methods SET SCHEMA compliance;
ALTER TABLE public.custom_notes SET SCHEMA compliance;

-- Permits
ALTER TABLE public.permit_reps SET SCHEMA permits;
ALTER TABLE public.permit_rep_profiles SET SCHEMA permits;
ALTER TABLE public.permit_templates SET SCHEMA permits;
ALTER TABLE public.rep_permits SET SCHEMA permits;
ALTER TABLE public.towns SET SCHEMA permits;
ALTER TABLE public.teams SET SCHEMA permits;
ALTER TABLE public.team_members SET SCHEMA permits;
-- These will be removed in Phase 6 (replaced by Supabase Auth), but move for now
ALTER TABLE public.rep_invite_tokens SET SCHEMA permits;
ALTER TABLE public.password_reset_tokens SET SCHEMA permits;

-- Execution
ALTER TABLE public.goals SET SCHEMA execution;
ALTER TABLE public.milestones SET SCHEMA execution;
ALTER TABLE public.tasks SET SCHEMA execution;
ALTER TABLE public.visions SET SCHEMA execution;
ALTER TABLE public.positions SET SCHEMA execution;
ALTER TABLE public.comments SET SCHEMA execution;

-- Finance (empty for now, but move QuickBooks from quickbooks schema)
-- QuickBooks schema tables get renamed with qbo_ prefix to avoid collisions
-- and moved to data_warehouse (not finance, since they're synced data).
--
-- IMPORTANT: Rename FIRST in quickbooks schema to avoid name collisions
-- with FieldRoutes tables already in data_warehouse (customers, invoices, payments).

-- Drop QuickBooks views BEFORE renaming/moving tables (they depend on these tables)
-- Drop in dependency order: v_monthly_pnl depends on the other two
DROP VIEW IF EXISTS quickbooks.v_monthly_pnl;
DROP VIEW IF EXISTS quickbooks.v_monthly_expenses;
DROP VIEW IF EXISTS quickbooks.v_monthly_revenue;

-- Rename all quickbooks tables in place first (using qbo_ prefix for QuickBooks Online)
ALTER TABLE quickbooks.accounts RENAME TO qbo_accounts_detail;
ALTER TABLE quickbooks.bills RENAME TO qbo_bills;
ALTER TABLE quickbooks.customers RENAME TO qbo_customers;
ALTER TABLE quickbooks.invoices RENAME TO qbo_invoices;
ALTER TABLE quickbooks.journal_entries RENAME TO qbo_journal_entries;
ALTER TABLE quickbooks.payments RENAME TO qbo_payments;
ALTER TABLE quickbooks.purchases RENAME TO qbo_purchases;
ALTER TABLE quickbooks.sales_receipts RENAME TO qbo_sales_receipts;
ALTER TABLE quickbooks.vendors RENAME TO qbo_vendors;
ALTER TABLE quickbooks.oauth_tokens RENAME TO qbo_oauth_tokens;
ALTER TABLE quickbooks.sync_errors RENAME TO qbo_sync_errors;
ALTER TABLE quickbooks.sync_jobs RENAME TO qbo_sync_jobs;

-- Rename indexes on FieldRoutes tables to have fr_ prefix
-- (target FR tables specifically to avoid accidentally prefixing other sources)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'data_warehouse'
        AND tablename IN (
            'fr_appointments', 'fr_customers', 'fr_employees', 'fr_chemicals',
            'fr_chemical_uses', 'fr_invoices', 'fr_payments', 'fr_subscriptions',
            'fr_service_types', 'fr_locations', 'fr_branches'
        )
        AND indexname NOT LIKE 'fr_%'
    LOOP
        EXECUTE format('ALTER INDEX data_warehouse.%I RENAME TO %I', r.indexname, 'fr_' || r.indexname);
    END LOOP;
END $$;

-- Rename indexes on DispositionsAI tables to have dispositionsai_ prefix
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'data_warehouse'
        AND tablename IN ('dispositionsai_calls', 'dispositionsai_transcripts', 'dispositionsai_analyses')
        AND indexname NOT LIKE 'dispositionsai_%'
    LOOP
        EXECUTE format('ALTER INDEX data_warehouse.%I RENAME TO %I', r.indexname, 'dispositionsai_' || r.indexname);
    END LOOP;
END $$;

-- Rename indexes on sync_tenant_data_sources to have sync_ prefix
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'data_warehouse'
        AND tablename = 'sync_tenant_data_sources'
        AND indexname NOT LIKE 'sync_%'
    LOOP
        EXECUTE format('ALTER INDEX data_warehouse.%I RENAME TO %I', r.indexname, 'sync_' || r.indexname);
    END LOOP;
END $$;

-- Rename indexes on qbo_accounts_detail FIRST to avoid collision with qbo_accounts indexes.
-- Strip any leading idx_ and accounts_ prefix, then rebuild with qbo_accounts_detail_ prefix.
-- This ensures all names start with qbo_ so the general block below skips them.
-- (e.g., accounts_pkey → qbo_accounts_detail_pkey, idx_accounts_realm → qbo_accounts_detail_idx_realm)
DO $$
DECLARE
    r RECORD;
    new_name TEXT;
BEGIN
    FOR r IN
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'quickbooks'
        AND tablename = 'qbo_accounts_detail'
    LOOP
        new_name := 'qbo_accounts_detail_' || regexp_replace(r.indexname, '^(idx_)?accounts_?', '');
        EXECUTE format('ALTER INDEX quickbooks.%I RENAME TO %I', r.indexname, new_name);
    END LOOP;
END $$;

-- Rename all remaining indexes/constraints on QuickBooks tables to have qbo_ prefix
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'quickbooks'
        AND indexname NOT LIKE 'qbo_%'
    LOOP
        EXECUTE format('ALTER INDEX quickbooks.%I RENAME TO %I', r.indexname, 'qbo_' || r.indexname);
    END LOOP;
END $$;

-- Now move renamed tables to data_warehouse (no collisions)
ALTER TABLE quickbooks.qbo_accounts_detail SET SCHEMA data_warehouse;
ALTER TABLE quickbooks.qbo_bills SET SCHEMA data_warehouse;
ALTER TABLE quickbooks.qbo_customers SET SCHEMA data_warehouse;
ALTER TABLE quickbooks.qbo_invoices SET SCHEMA data_warehouse;
ALTER TABLE quickbooks.qbo_journal_entries SET SCHEMA data_warehouse;
ALTER TABLE quickbooks.qbo_payments SET SCHEMA data_warehouse;
ALTER TABLE quickbooks.qbo_purchases SET SCHEMA data_warehouse;
ALTER TABLE quickbooks.qbo_sales_receipts SET SCHEMA data_warehouse;
ALTER TABLE quickbooks.qbo_vendors SET SCHEMA data_warehouse;
ALTER TABLE quickbooks.qbo_oauth_tokens SET SCHEMA data_warehouse;
ALTER TABLE quickbooks.qbo_sync_errors SET SCHEMA data_warehouse;
ALTER TABLE quickbooks.qbo_sync_jobs SET SCHEMA data_warehouse;

-- ============================================================
-- STEP 6: Grant USAGE on new schemas
-- ============================================================

-- Platform: all roles need to read platform data
GRANT USAGE ON SCHEMA platform TO authenticated, anon, service_role;
-- Data warehouse: only service_role writes; authenticated reads during transition
-- (Phase 5 will revoke authenticated access and use product views instead)
GRANT USAGE ON SCHEMA data_warehouse TO authenticated, service_role;
-- Product schemas: authenticated users interact via RLS
GRANT USAGE ON SCHEMA sales TO authenticated, service_role;
GRANT USAGE ON SCHEMA compliance TO authenticated, service_role;
GRANT USAGE ON SCHEMA permits TO authenticated, service_role;
GRANT USAGE ON SCHEMA execution TO authenticated, service_role;
GRANT USAGE ON SCHEMA finance TO authenticated, service_role;
-- app_user role (used by some compliance/permits policies)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
        GRANT USAGE ON SCHEMA data_warehouse TO app_user;
        GRANT USAGE ON SCHEMA compliance TO app_user;
        GRANT USAGE ON SCHEMA platform TO app_user;
    END IF;
END $$;

-- ============================================================
-- STEP 6b: Grant table-level permissions in new schemas
-- ============================================================

-- Platform tables
GRANT SELECT ON platform.tenants TO authenticated;
GRANT SELECT ON platform.products TO authenticated, anon;
GRANT SELECT ON platform.tenant_products TO authenticated;
GRANT SELECT ON platform.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON platform.tenant_users TO authenticated;
-- user_product_access will be granted when created in Phase 3
GRANT ALL ON ALL TABLES IN SCHEMA platform TO service_role;

-- Data warehouse tables (read-only for authenticated during transition)
GRANT SELECT ON ALL TABLES IN SCHEMA data_warehouse TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA data_warehouse TO service_role;
-- Grant sequences for service_role writes
GRANT ALL ON ALL SEQUENCES IN SCHEMA data_warehouse TO service_role;

-- Sales tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA sales TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA sales TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA sales TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA sales TO service_role;

-- Compliance tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA compliance TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA compliance TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA compliance TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA compliance TO service_role;

-- Permits tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA permits TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA permits TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA permits TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA permits TO service_role;

-- Execution tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA execution TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA execution TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA execution TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA execution TO service_role;

-- Finance (empty for now but set up grants)
GRANT ALL ON ALL TABLES IN SCHEMA finance TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA finance TO service_role;

-- app_user grants (mirrors what it had before on relevant tables)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
        GRANT SELECT ON ALL TABLES IN SCHEMA data_warehouse TO app_user;
        GRANT SELECT ON ALL TABLES IN SCHEMA compliance TO app_user;
        GRANT SELECT ON platform.tenants TO app_user;
        GRANT SELECT ON platform.users TO app_user;
    END IF;
END $$;

-- ============================================================
-- STEP 7: Create compatibility views in public schema
-- ============================================================
-- These let existing app code keep working with unqualified table names.
-- Simple single-table views are auto-updatable in PostgreSQL,
-- so INSERT/UPDATE/DELETE through them works transparently.
-- These views will be dropped in Phase 6 after apps are updated.

-- Platform
CREATE VIEW public.tenants AS SELECT * FROM platform.tenants;
CREATE VIEW public.products AS SELECT * FROM platform.products;
CREATE VIEW public.tenant_products AS SELECT * FROM platform.tenant_products;
CREATE VIEW public.users AS SELECT * FROM platform.users;
CREATE VIEW public.tenant_users AS SELECT * FROM platform.tenant_users;
-- user_product_access view will be created when the table is created in Phase 3

-- Data warehouse: FieldRoutes (compatibility views use old unprefixed names)
CREATE VIEW public.appointments AS SELECT * FROM data_warehouse.fr_appointments;
CREATE VIEW public.customers AS SELECT * FROM data_warehouse.fr_customers;
CREATE VIEW public.employees AS SELECT * FROM data_warehouse.fr_employees;
CREATE VIEW public.chemicals AS SELECT * FROM data_warehouse.fr_chemicals;
CREATE VIEW public.chemical_uses AS SELECT * FROM data_warehouse.fr_chemical_uses;
CREATE VIEW public.invoices AS SELECT * FROM data_warehouse.fr_invoices;
CREATE VIEW public.payments AS SELECT * FROM data_warehouse.fr_payments;
CREATE VIEW public.subscriptions AS SELECT * FROM data_warehouse.fr_subscriptions;
CREATE VIEW public.service_types AS SELECT * FROM data_warehouse.fr_service_types;
CREATE VIEW public.locations AS SELECT * FROM data_warehouse.fr_locations;
CREATE VIEW public.branches AS SELECT * FROM data_warehouse.fr_branches;

-- Data warehouse: Applause
CREATE VIEW public.applause_ratings AS SELECT * FROM data_warehouse.applause_ratings;
CREATE VIEW public.applause_reviews AS SELECT * FROM data_warehouse.applause_reviews;

-- Data warehouse: Azuga
CREATE VIEW public.azuga_driving_scores AS SELECT * FROM data_warehouse.azuga_driving_scores;

-- Data warehouse: GHL
CREATE VIEW public.ghl_contacts AS SELECT * FROM data_warehouse.ghl_contacts;
CREATE VIEW public.ghl_opportunities AS SELECT * FROM data_warehouse.ghl_opportunities;
CREATE VIEW public.ghl_pipelines AS SELECT * FROM data_warehouse.ghl_pipelines;

-- Data warehouse: Gusto
CREATE VIEW public.gusto_daily_hours AS SELECT * FROM data_warehouse.gusto_daily_hours;

-- Data warehouse: DispositionsAI (compatibility views use old unprefixed names)
CREATE VIEW public.calls AS SELECT * FROM data_warehouse.dispositionsai_calls;
CREATE VIEW public.transcripts AS SELECT * FROM data_warehouse.dispositionsai_transcripts;
CREATE VIEW public.analyses AS SELECT * FROM data_warehouse.dispositionsai_analyses;

-- Data warehouse: QBO
CREATE VIEW public.qbo_accounts AS SELECT * FROM data_warehouse.qbo_accounts;
CREATE VIEW public.qbo_balance_sheet AS SELECT * FROM data_warehouse.qbo_balance_sheet;
CREATE VIEW public.qbo_general_ledger AS SELECT * FROM data_warehouse.qbo_general_ledger;
CREATE VIEW public.qbo_profit_loss AS SELECT * FROM data_warehouse.qbo_profit_loss;
CREATE VIEW public.qbo_trial_balance AS SELECT * FROM data_warehouse.qbo_trial_balance;

-- Data warehouse: Sync infrastructure
CREATE VIEW public.sync_log AS SELECT * FROM data_warehouse.sync_log;
CREATE VIEW public.tenant_data_sources AS SELECT * FROM data_warehouse.sync_tenant_data_sources;

-- Sales
CREATE VIEW public.payscales AS SELECT * FROM sales.payscales;
CREATE VIEW public.payscale_tiers AS SELECT * FROM sales.payscale_tiers;
CREATE VIEW public.payscale_assignments AS SELECT * FROM sales.payscale_assignments;
CREATE VIEW public.override_assignments AS SELECT * FROM sales.override_assignments;
CREATE VIEW public.tenant_kpis AS SELECT * FROM sales.tenant_kpis;
CREATE VIEW public.tenant_field_definitions AS SELECT * FROM sales.tenant_field_definitions;
CREATE VIEW public.user_fieldroutes_ids AS SELECT * FROM sales.user_fieldroutes_ids;
CREATE VIEW public.user_branches AS SELECT * FROM sales.user_branches;
CREATE VIEW public.qualified_leads AS SELECT * FROM sales.qualified_leads;

-- Compliance
CREATE VIEW public.instruction_templates AS SELECT * FROM compliance.instruction_templates;
CREATE VIEW public.instruction_template_products AS SELECT * FROM compliance.instruction_template_products;
CREATE VIEW public.insects AS SELECT * FROM compliance.insects;
CREATE VIEW public.application_methods AS SELECT * FROM compliance.application_methods;
CREATE VIEW public.custom_notes AS SELECT * FROM compliance.custom_notes;

-- Permits
CREATE VIEW public.permit_reps AS SELECT * FROM permits.permit_reps;
CREATE VIEW public.permit_rep_profiles AS SELECT * FROM permits.permit_rep_profiles;
CREATE VIEW public.permit_templates AS SELECT * FROM permits.permit_templates;
CREATE VIEW public.rep_permits AS SELECT * FROM permits.rep_permits;
CREATE VIEW public.towns AS SELECT * FROM permits.towns;
CREATE VIEW public.teams AS SELECT * FROM permits.teams;
CREATE VIEW public.team_members AS SELECT * FROM permits.team_members;
CREATE VIEW public.rep_invite_tokens AS SELECT * FROM permits.rep_invite_tokens;
CREATE VIEW public.password_reset_tokens AS SELECT * FROM permits.password_reset_tokens;

-- Execution
CREATE VIEW public.goals AS SELECT * FROM execution.goals;
CREATE VIEW public.milestones AS SELECT * FROM execution.milestones;
CREATE VIEW public.tasks AS SELECT * FROM execution.tasks;
CREATE VIEW public.visions AS SELECT * FROM execution.visions;
CREATE VIEW public.positions AS SELECT * FROM execution.positions;
CREATE VIEW public.comments AS SELECT * FROM execution.comments;

-- ============================================================
-- STEP 8: Grant permissions on compatibility views
-- ============================================================
-- Views need their own grants (separate from underlying tables).
-- Match the grants from Phase 1 (anon: products only, authenticated: as needed).

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
-- service_role can do everything
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- ============================================================
-- STEP 9: Recreate the data analysis views with schema-qualified names
-- ============================================================

CREATE VIEW public.v_active_subscriptions AS
    SELECT tenant_id,
        "serviceType",
        count(*) AS count,
        sum("recurringCharge") AS monthly_recurring_revenue
    FROM data_warehouse.fr_subscriptions
    WHERE (active = 1)
    GROUP BY tenant_id, "serviceType";

CREATE VIEW public.v_employee_productivity AS
    SELECT a.tenant_id,
        e.id AS employee_id,
        ((e.first_name || ' '::text) || e.last_name) AS employee_name,
        date_trunc('week'::text, (a.date)::timestamp with time zone) AS week,
        count(*) AS appointments_completed,
        avg(a.duration_minutes) AS avg_duration,
        sum(a.amount) AS revenue_generated
    FROM (data_warehouse.fr_appointments a
        JOIN data_warehouse.fr_employees e ON ((a.employee_id = e.id)))
    WHERE (a.status = 'completed'::text)
    GROUP BY a.tenant_id, e.id, e.first_name, e.last_name, (date_trunc('week'::text, (a.date)::timestamp with time zone));

CREATE VIEW public.v_revenue_by_month AS
    SELECT tenant_id,
        date_trunc('month'::text, (payment_date)::timestamp with time zone) AS month,
        sum(amount) AS total_revenue,
        count(*) AS payment_count
    FROM data_warehouse.fr_payments
    WHERE (status = 'completed'::text)
    GROUP BY tenant_id, (date_trunc('month'::text, (payment_date)::timestamp with time zone));

-- Grant on recreated views
GRANT SELECT ON public.v_active_subscriptions TO authenticated, service_role;
GRANT SELECT ON public.v_employee_productivity TO authenticated, service_role;
GRANT SELECT ON public.v_revenue_by_month TO authenticated, service_role;

-- ============================================================
-- STEP 10: Recreate QuickBooks views in data_warehouse
-- ============================================================
-- These previously lived in the quickbooks schema.
-- Recreated with references to the renamed tables in data_warehouse.
-- Note: these use realm_id (QBO company ID), not tenant_id.
-- A later migration will add tenant_id to QB tables and update these views.

CREATE VIEW data_warehouse.v_monthly_revenue AS
    SELECT qbo_invoices.realm_id,
        date_trunc('month'::text, (qbo_invoices.txn_date)::timestamp with time zone) AS month,
        'invoice'::text AS source,
        count(*) AS transaction_count,
        sum(qbo_invoices.total_amt) AS total_amount,
        sum(qbo_invoices.balance) AS outstanding_balance
    FROM data_warehouse.qbo_invoices
    GROUP BY qbo_invoices.realm_id, (date_trunc('month'::text, (qbo_invoices.txn_date)::timestamp with time zone))
UNION ALL
    SELECT qbo_sales_receipts.realm_id,
        date_trunc('month'::text, (qbo_sales_receipts.txn_date)::timestamp with time zone) AS month,
        'sales_receipt'::text AS source,
        count(*) AS transaction_count,
        sum(qbo_sales_receipts.total_amt) AS total_amount,
        0 AS outstanding_balance
    FROM data_warehouse.qbo_sales_receipts
    GROUP BY qbo_sales_receipts.realm_id, (date_trunc('month'::text, (qbo_sales_receipts.txn_date)::timestamp with time zone))
    ORDER BY 2 DESC;

CREATE VIEW data_warehouse.v_monthly_expenses AS
    SELECT qbo_bills.realm_id,
        date_trunc('month'::text, (qbo_bills.txn_date)::timestamp with time zone) AS month,
        'bill'::text AS source,
        count(*) AS transaction_count,
        sum(qbo_bills.total_amt) AS total_amount
    FROM data_warehouse.qbo_bills
    GROUP BY qbo_bills.realm_id, (date_trunc('month'::text, (qbo_bills.txn_date)::timestamp with time zone))
UNION ALL
    SELECT qbo_purchases.realm_id,
        date_trunc('month'::text, (qbo_purchases.txn_date)::timestamp with time zone) AS month,
        'purchase'::text AS source,
        count(*) AS transaction_count,
        sum(qbo_purchases.total_amt) AS total_amount
    FROM data_warehouse.qbo_purchases
    WHERE (qbo_purchases.credit = false)
    GROUP BY qbo_purchases.realm_id, (date_trunc('month'::text, (qbo_purchases.txn_date)::timestamp with time zone))
    ORDER BY 2 DESC;

CREATE VIEW data_warehouse.v_monthly_pnl AS
    SELECT COALESCE(r.realm_id, e.realm_id) AS realm_id,
        COALESCE(r.month, e.month) AS month,
        COALESCE(r.revenue, (0)::numeric) AS revenue,
        COALESCE(e.expenses, (0)::numeric) AS expenses,
        (COALESCE(r.revenue, (0)::numeric) - COALESCE(e.expenses, (0)::numeric)) AS net_income
    FROM (( SELECT v_monthly_revenue.realm_id,
                v_monthly_revenue.month,
                sum(v_monthly_revenue.total_amount) AS revenue
            FROM data_warehouse.v_monthly_revenue
            GROUP BY v_monthly_revenue.realm_id, v_monthly_revenue.month) r
        FULL JOIN ( SELECT v_monthly_expenses.realm_id,
                v_monthly_expenses.month,
                sum(v_monthly_expenses.total_amount) AS expenses
            FROM data_warehouse.v_monthly_expenses
            GROUP BY v_monthly_expenses.realm_id, v_monthly_expenses.month) e
        ON ((((r.realm_id)::text = (e.realm_id)::text) AND (r.month = e.month))))
    ORDER BY COALESCE(r.month, e.month) DESC;

GRANT SELECT ON data_warehouse.v_monthly_expenses TO authenticated, service_role;
GRANT SELECT ON data_warehouse.v_monthly_revenue TO authenticated, service_role;
GRANT SELECT ON data_warehouse.v_monthly_pnl TO authenticated, service_role;

-- Compatibility: apps that referenced quickbooks.accounts, quickbooks.invoices, etc.
-- The quickbooks schema still exists but tables have been moved out.
-- Create views in quickbooks schema pointing to data_warehouse for backward compat.
CREATE OR REPLACE VIEW quickbooks.accounts AS SELECT * FROM data_warehouse.qbo_accounts_detail;
CREATE OR REPLACE VIEW quickbooks.bills AS SELECT * FROM data_warehouse.qbo_bills;
CREATE OR REPLACE VIEW quickbooks.customers AS SELECT * FROM data_warehouse.qbo_customers;
CREATE OR REPLACE VIEW quickbooks.invoices AS SELECT * FROM data_warehouse.qbo_invoices;
CREATE OR REPLACE VIEW quickbooks.journal_entries AS SELECT * FROM data_warehouse.qbo_journal_entries;
CREATE OR REPLACE VIEW quickbooks.payments AS SELECT * FROM data_warehouse.qbo_payments;
CREATE OR REPLACE VIEW quickbooks.purchases AS SELECT * FROM data_warehouse.qbo_purchases;
CREATE OR REPLACE VIEW quickbooks.sales_receipts AS SELECT * FROM data_warehouse.qbo_sales_receipts;
CREATE OR REPLACE VIEW quickbooks.vendors AS SELECT * FROM data_warehouse.qbo_vendors;
CREATE OR REPLACE VIEW quickbooks.oauth_tokens AS SELECT * FROM data_warehouse.qbo_oauth_tokens;
CREATE OR REPLACE VIEW quickbooks.sync_errors AS SELECT * FROM data_warehouse.qbo_sync_errors;
CREATE OR REPLACE VIEW quickbooks.sync_jobs AS SELECT * FROM data_warehouse.qbo_sync_jobs;
CREATE OR REPLACE VIEW quickbooks.v_monthly_expenses AS SELECT * FROM data_warehouse.v_monthly_expenses;
CREATE OR REPLACE VIEW quickbooks.v_monthly_revenue AS SELECT * FROM data_warehouse.v_monthly_revenue;
CREATE OR REPLACE VIEW quickbooks.v_monthly_pnl AS SELECT * FROM data_warehouse.v_monthly_pnl;
GRANT SELECT ON ALL TABLES IN SCHEMA quickbooks TO authenticated, service_role;

COMMIT;

-- ============================================================
-- VERIFICATION QUERIES (run after the migration)
-- ============================================================
--
-- 1. Verify schemas exist:
--    SELECT schema_name FROM information_schema.schemata
--    WHERE schema_name IN ('platform','data_warehouse','sales','compliance','permits','execution','finance')
--    ORDER BY schema_name;
--
-- 2. Verify no tables left in public (only views):
--    SELECT table_name, table_type
--    FROM information_schema.tables
--    WHERE table_schema = 'public'
--    ORDER BY table_type, table_name;
--    -- Should all be 'VIEW', no 'BASE TABLE'
--
-- 3. Verify table counts per schema:
--    SELECT table_schema, count(*)
--    FROM information_schema.tables
--    WHERE table_type = 'BASE TABLE'
--    AND table_schema IN ('platform','data_warehouse','sales','compliance','permits','execution')
--    GROUP BY table_schema
--    ORDER BY table_schema;
--
-- 4. Test a compatibility view works (returns data):
--    SELECT count(*) FROM public.appointments;
--
-- 5. Verify RLS still works on moved tables:
--    SELECT schemaname, tablename, policyname
--    FROM pg_policies
--    WHERE schemaname IN ('platform','data_warehouse','sales','compliance','permits','execution')
--    ORDER BY schemaname, tablename;
