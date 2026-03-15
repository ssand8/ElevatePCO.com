-- ============================================================
-- PHASE 1: EMERGENCY GRANT LOCKDOWN
-- ============================================================
-- PROBLEM: The `anon` role has ALL privileges (INSERT, UPDATE, DELETE, TRUNCATE)
-- on every public table. The anon key is exposed in NEXT_PUBLIC env vars.
-- Several INSERT RLS policies have no restriction (qual = null),
-- meaning unauthenticated users can insert arbitrary data into:
--   comments, goals, milestones, positions, tasks, visions, tenant_users
--
-- This migration locks down grants to minimum required privileges.
-- RLS policies remain unchanged -- they provide the second layer of defense.
-- ============================================================

BEGIN;

-- ============================================================
-- STEP 1: Revoke ALL from anon on public schema tables
-- ============================================================
-- After this, anon cannot read, write, or modify ANY table.
-- The only exception is public.products (re-granted below).

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Allow anon to read the product catalog (used by marketing site)
GRANT SELECT ON public.products TO anon;

-- ============================================================
-- STEP 2: Revoke dangerous privileges from authenticated
-- ============================================================
-- No authenticated user should ever need TRUNCATE, TRIGGER, or REFERENCES.
-- These are admin-level operations that should only be done via service_role.

REVOKE TRUNCATE ON ALL TABLES IN SCHEMA public FROM authenticated;
REVOKE TRIGGER ON ALL TABLES IN SCHEMA public FROM authenticated;
REVOKE REFERENCES ON ALL TABLES IN SCHEMA public FROM authenticated;

-- ============================================================
-- STEP 3: Make synced/scraped data tables READ-ONLY for authenticated
-- ============================================================
-- These tables are written to by the sync engine (service_role) only.
-- Authenticated users should only SELECT from them.
-- RLS policies already enforce tenant isolation on SELECT.

-- FieldRoutes synced data
REVOKE INSERT, UPDATE, DELETE ON public.appointments FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.customers FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.employees FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.chemicals FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.chemical_uses FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.invoices FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.payments FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.subscriptions FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.service_types FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.locations FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.branches FROM authenticated;

-- Applause synced data
REVOKE INSERT, UPDATE, DELETE ON public.applause_ratings FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.applause_reviews FROM authenticated;

-- Azuga synced data
REVOKE INSERT, UPDATE, DELETE ON public.azuga_driving_scores FROM authenticated;

-- GHL synced data
REVOKE INSERT, UPDATE, DELETE ON public.ghl_contacts FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.ghl_opportunities FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.ghl_pipelines FROM authenticated;

-- Gusto synced data
REVOKE INSERT, UPDATE, DELETE ON public.gusto_daily_hours FROM authenticated;

-- QuickBooks synced data (public schema)
REVOKE INSERT, UPDATE, DELETE ON public.qbo_accounts FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.qbo_balance_sheet FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.qbo_general_ledger FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.qbo_profit_loss FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.qbo_trial_balance FROM authenticated;

-- Sync infrastructure (only sync engine writes)
REVOKE INSERT, UPDATE, DELETE ON public.sync_log FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.tenant_data_sources FROM authenticated;

-- ============================================================
-- STEP 4: Make admin/config tables READ-ONLY for authenticated
-- ============================================================
-- These are managed by admins/service_role, not regular users.
-- Exception: tenant_users needs INSERT/UPDATE for admin user management (RLS protects this).

REVOKE INSERT, UPDATE, DELETE ON public.tenants FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.products FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.tenant_products FROM authenticated;

-- ============================================================
-- STEP 5: Lock down quickbooks schema (same treatment)
-- ============================================================
-- Quickbooks schema tables are synced data -- read-only for authenticated.

REVOKE ALL ON ALL TABLES IN SCHEMA quickbooks FROM anon;
REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA quickbooks FROM authenticated;
REVOKE TRUNCATE, TRIGGER, REFERENCES ON ALL TABLES IN SCHEMA quickbooks FROM authenticated;

-- ============================================================
-- STEP 6: Fix INSERT policies that have no restriction
-- ============================================================
-- These policies allow any role (including anon before this migration,
-- and any authenticated user regardless of tenant) to INSERT.
-- Add WITH CHECK constraints requiring authentication and tenant membership.

-- Drop the unrestricted INSERT policies and recreate with proper checks
DROP POLICY IF EXISTS ee_comments_insert ON public.comments;
CREATE POLICY ee_comments_insert ON public.comments
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND tenant_id IN (SELECT get_user_tenant_ids())
    );

DROP POLICY IF EXISTS ee_goals_insert ON public.goals;
CREATE POLICY ee_goals_insert ON public.goals
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND tenant_id IN (SELECT get_user_tenant_ids())
    );

DROP POLICY IF EXISTS ee_milestones_insert ON public.milestones;
CREATE POLICY ee_milestones_insert ON public.milestones
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND tenant_id IN (SELECT get_user_tenant_ids())
    );

DROP POLICY IF EXISTS ee_positions_insert ON public.positions;
CREATE POLICY ee_positions_insert ON public.positions
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND tenant_id IN (SELECT get_user_tenant_ids())
    );

DROP POLICY IF EXISTS ee_tasks_insert ON public.tasks;
CREATE POLICY ee_tasks_insert ON public.tasks
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND tenant_id IN (SELECT get_user_tenant_ids())
    );

DROP POLICY IF EXISTS ee_visions_insert ON public.visions;
CREATE POLICY ee_visions_insert ON public.visions
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND tenant_id IN (SELECT get_user_tenant_ids())
    );

DROP POLICY IF EXISTS admin_manage_users ON public.tenant_users;
CREATE POLICY admin_manage_users ON public.tenant_users
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND tenant_id IN (
            SELECT tu.tenant_id
            FROM tenant_users tu
            WHERE tu.user_id = auth.uid()
            AND tu.role = 'admin'
        )
    );

COMMIT;

-- ============================================================
-- VERIFICATION QUERIES (run these after the migration)
-- ============================================================
--
-- 1. Verify anon has no grants except SELECT on products:
--    SELECT table_name, privilege_type
--    FROM information_schema.role_table_grants
--    WHERE grantee = 'anon' AND table_schema = 'public';
--
-- 2. Verify authenticated has no TRUNCATE/TRIGGER/REFERENCES:
--    SELECT table_name, privilege_type
--    FROM information_schema.role_table_grants
--    WHERE grantee = 'authenticated' AND table_schema = 'public'
--    AND privilege_type IN ('TRUNCATE', 'TRIGGER', 'REFERENCES');
--
-- 3. Verify synced data tables are read-only for authenticated:
--    SELECT table_name, privilege_type
--    FROM information_schema.role_table_grants
--    WHERE grantee = 'authenticated' AND table_schema = 'public'
--    AND table_name = 'appointments';
--    -- Should only show SELECT
--
-- 4. Verify INSERT policies now require authentication:
--    SELECT tablename, policyname, roles, cmd, qual
--    FROM pg_policies
--    WHERE cmd = 'INSERT' AND schemaname = 'public';
--    -- All INSERT policies should have non-null qual with auth.uid() check
