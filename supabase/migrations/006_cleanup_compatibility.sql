-- ============================================================
-- PHASE 6: REMOVE COMPATIBILITY LAYER
-- ============================================================
-- Prerequisites (complete these BEFORE running this migration):
--
--   1. ElevatePCO.com: QBO routes updated to use platform schema ✓
--   2. ClaudeTruvoPay: Update supabase queries to use `sales` schema
--      for product tables, `data_warehouse` for synced data
--   3. ClaudeDataScraper: Update to write to `data_warehouse` schema
--      (uses service_role, so no schema change needed if already
--      targeting correct tables — verify table references)
--   4. ElevateExecution: Update to use `execution` schema
--   5. DispositionsAI: Update to use `data_warehouse` schema
--   6. Compliance/Permits apps: Update to use `compliance`/`permits`
--      schemas (currently use app_user role — will migrate to
--      Supabase Auth in a future phase)
--
-- Add product schemas to Supabase Dashboard > Settings > API >
-- Exposed schemas: platform, sales, compliance, permits, execution, finance
--
-- IMPORTANT: Run verification query BEFORE this migration to ensure
-- no active queries reference public compatibility views:
--
--   SELECT schemaname, viewname
--   FROM pg_views
--   WHERE schemaname = 'public'
--   AND viewname NOT IN ('pg_stat_statements', 'pg_stat_statements_info')
--   ORDER BY viewname;
-- ============================================================

BEGIN;

-- ============================================================
-- STEP 1: Drop public schema compatibility views
-- ============================================================
-- These were created in Phase 2 so apps could keep querying public.*
-- while we migrated schemas. Now that apps target correct schemas,
-- these are no longer needed.

-- Platform table views
DROP VIEW IF EXISTS public.tenants CASCADE;
DROP VIEW IF EXISTS public.products CASCADE;
DROP VIEW IF EXISTS public.tenant_products CASCADE;
DROP VIEW IF EXISTS public.users CASCADE;
DROP VIEW IF EXISTS public.tenant_users CASCADE;

-- user_product_access view (created in Phase 3)
DROP VIEW IF EXISTS public.user_product_access CASCADE;

-- Data warehouse: FieldRoutes (old unprefixed names)
DROP VIEW IF EXISTS public.appointments CASCADE;
DROP VIEW IF EXISTS public.customers CASCADE;
DROP VIEW IF EXISTS public.employees CASCADE;
DROP VIEW IF EXISTS public.chemicals CASCADE;
DROP VIEW IF EXISTS public.chemical_uses CASCADE;
DROP VIEW IF EXISTS public.invoices CASCADE;
DROP VIEW IF EXISTS public.payments CASCADE;
DROP VIEW IF EXISTS public.subscriptions CASCADE;
DROP VIEW IF EXISTS public.service_types CASCADE;
DROP VIEW IF EXISTS public.locations CASCADE;
DROP VIEW IF EXISTS public.branches CASCADE;

-- Data warehouse: Applause
DROP VIEW IF EXISTS public.applause_ratings CASCADE;
DROP VIEW IF EXISTS public.applause_reviews CASCADE;

-- Data warehouse: Azuga
DROP VIEW IF EXISTS public.azuga_driving_scores CASCADE;

-- Data warehouse: GHL
DROP VIEW IF EXISTS public.ghl_contacts CASCADE;
DROP VIEW IF EXISTS public.ghl_opportunities CASCADE;
DROP VIEW IF EXISTS public.ghl_pipelines CASCADE;

-- Data warehouse: Gusto
DROP VIEW IF EXISTS public.gusto_daily_hours CASCADE;

-- Data warehouse: DispositionsAI (old unprefixed names)
DROP VIEW IF EXISTS public.calls CASCADE;
DROP VIEW IF EXISTS public.transcripts CASCADE;
DROP VIEW IF EXISTS public.analyses CASCADE;

-- Data warehouse: QBO
DROP VIEW IF EXISTS public.qbo_accounts CASCADE;
DROP VIEW IF EXISTS public.qbo_balance_sheet CASCADE;
DROP VIEW IF EXISTS public.qbo_general_ledger CASCADE;
DROP VIEW IF EXISTS public.qbo_profit_loss CASCADE;
DROP VIEW IF EXISTS public.qbo_trial_balance CASCADE;

-- Data warehouse: Sync
DROP VIEW IF EXISTS public.sync_log CASCADE;
DROP VIEW IF EXISTS public.tenant_data_sources CASCADE;

-- Sales schema views
DROP VIEW IF EXISTS public.payscales CASCADE;
DROP VIEW IF EXISTS public.payscale_tiers CASCADE;
DROP VIEW IF EXISTS public.payscale_assignments CASCADE;
DROP VIEW IF EXISTS public.override_assignments CASCADE;
DROP VIEW IF EXISTS public.tenant_kpis CASCADE;
DROP VIEW IF EXISTS public.tenant_field_definitions CASCADE;
DROP VIEW IF EXISTS public.user_fieldroutes_ids CASCADE;
DROP VIEW IF EXISTS public.user_branches CASCADE;
DROP VIEW IF EXISTS public.qualified_leads CASCADE;

-- Compliance schema views
DROP VIEW IF EXISTS public.instruction_templates CASCADE;
DROP VIEW IF EXISTS public.instruction_template_products CASCADE;
DROP VIEW IF EXISTS public.insects CASCADE;
DROP VIEW IF EXISTS public.application_methods CASCADE;
DROP VIEW IF EXISTS public.custom_notes CASCADE;

-- Permits schema views
DROP VIEW IF EXISTS public.permit_reps CASCADE;
DROP VIEW IF EXISTS public.permit_rep_profiles CASCADE;
DROP VIEW IF EXISTS public.permit_templates CASCADE;
DROP VIEW IF EXISTS public.rep_permits CASCADE;
DROP VIEW IF EXISTS public.towns CASCADE;
DROP VIEW IF EXISTS public.teams CASCADE;
DROP VIEW IF EXISTS public.team_members CASCADE;
DROP VIEW IF EXISTS public.rep_invite_tokens CASCADE;
DROP VIEW IF EXISTS public.password_reset_tokens CASCADE;

-- Execution schema views
DROP VIEW IF EXISTS public.goals CASCADE;
DROP VIEW IF EXISTS public.milestones CASCADE;
DROP VIEW IF EXISTS public.tasks CASCADE;
DROP VIEW IF EXISTS public.visions CASCADE;
DROP VIEW IF EXISTS public.positions CASCADE;
DROP VIEW IF EXISTS public.comments CASCADE;

-- Data analysis views (created in Phase 2 STEP 9)
DROP VIEW IF EXISTS public.v_active_subscriptions CASCADE;
DROP VIEW IF EXISTS public.v_employee_productivity CASCADE;
DROP VIEW IF EXISTS public.v_revenue_by_month CASCADE;

-- ============================================================
-- STEP 2: Drop old quickbooks schema
-- ============================================================
-- Should be empty after Phase 2 moved all tables to data_warehouse.
-- Also removed from PostgREST exposed schemas.

DROP SCHEMA IF EXISTS quickbooks CASCADE;

-- ============================================================
-- STEP 3: Drop deprecated token columns from platform.tenants
-- ============================================================
-- Tokens moved to platform.qbo_oauth_credentials in Phase 5.
-- These columns were nulled out but kept for backward compat.

ALTER TABLE platform.tenants DROP COLUMN IF EXISTS qbo_access_token;
ALTER TABLE platform.tenants DROP COLUMN IF EXISTS qbo_refresh_token;
ALTER TABLE platform.tenants DROP COLUMN IF EXISTS qbo_token_expires_at;

-- ============================================================
-- STEP 4: Drop old helper functions
-- ============================================================
-- These were from the pre-Phase 3 auth system.

DROP FUNCTION IF EXISTS public.get_user_tenant_ids();
DROP FUNCTION IF EXISTS public.get_tenant_ids();

-- ============================================================
-- STEP 5: Revoke anon access to public schema tables
-- ============================================================
-- After dropping compatibility views, the public schema should
-- only contain the products view (if we want anon access for
-- the marketing site). But products is now in platform schema
-- and its view was just dropped. Re-create a minimal public
-- endpoint for the marketing site.

CREATE OR REPLACE VIEW public.products AS
    SELECT id, name, slug, description, created_at
    FROM platform.products;

GRANT SELECT ON public.products TO anon, authenticated;

-- ============================================================
-- STEP 6: Clean up grants on public schema
-- ============================================================
-- Revoke any remaining broad grants on public schema that
-- were left from the pre-migration state.

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename NOT IN ('schema_migrations')
    LOOP
        EXECUTE format('REVOKE ALL ON public.%I FROM anon', tbl);
        EXECUTE format('REVOKE ALL ON public.%I FROM authenticated', tbl);
    END LOOP;
END $$;

-- Re-grant the products view (revoked by the loop above)
GRANT SELECT ON public.products TO anon, authenticated;

COMMIT;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
--
-- 1. Verify no compatibility views remain in public:
--    SELECT viewname FROM pg_views
--    WHERE schemaname = 'public'
--    AND viewname NOT LIKE 'pg_%'
--    ORDER BY viewname;
--    -- Should only show 'products'
--
-- 2. Verify quickbooks schema is gone:
--    SELECT schema_name FROM information_schema.schemata
--    WHERE schema_name = 'quickbooks';
--    -- Should return 0 rows
--
-- 3. Verify token columns dropped from tenants:
--    SELECT column_name FROM information_schema.columns
--    WHERE table_schema = 'platform' AND table_name = 'tenants'
--    AND column_name LIKE 'qbo_%token%';
--    -- Should return 0 rows (only qbo_realm_id remains)
--
-- 4. Verify public.products view works:
--    SELECT * FROM public.products;
--
-- 5. Count remaining objects in public schema:
--    SELECT count(*) FROM pg_tables WHERE schemaname = 'public';
--    SELECT count(*) FROM pg_views WHERE schemaname = 'public'
--    AND viewname NOT LIKE 'pg_%';
--    -- Tables should be minimal, views should be 1 (products)
