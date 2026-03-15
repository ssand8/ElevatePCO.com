# ElevatePCO Database Schema Migration Reference

Where every table used to be and where it is now.

## Quick Lookup

**Need to find a table?** Search this document for the old name. The table shows the new schema and name.

**Supabase JS pattern:**
```typescript
// Old way (public schema, default)
supabase.from("tablename")

// New way (explicit schema)
supabase.schema("platform").from("tenants")
supabase.schema("sales").from("payscales")
supabase.schema("data_warehouse").from("fr_customers")
```

---

## Platform Schema

Auth, tenants, and user management.

| Old Name | Old Schema | New Name | New Schema |
|----------|-----------|----------|-----------|
| tenants | public | tenants | platform |
| products | public | products | platform |
| tenant_products | public | tenant_products | platform |
| users | public | users | platform |
| tenant_users | public | tenant_users | platform |
| *(new)* | — | user_product_access | platform |
| *(new)* | — | qbo_oauth_credentials | platform |
| *(new)* | — | audit_log | platform |

**Dropped columns from `platform.tenants`:**
- `qbo_access_token` → moved to `platform.qbo_oauth_credentials.access_token`
- `qbo_refresh_token` → moved to `platform.qbo_oauth_credentials.refresh_token`
- `qbo_token_expires_at` → moved to `platform.qbo_oauth_credentials.token_expires_at`
- `qbo_realm_id` → **still on tenants** (not a secret, used for QBO tenant mapping)

**Note:** `public.products` still exists as a read-only view for the marketing site (anon access).

---

## Data Warehouse Schema — FieldRoutes

All FieldRoutes tables were renamed with `fr_` prefix.

| Old Name | Old Schema | New Name | New Schema |
|----------|-----------|----------|-----------|
| appointments | public | fr_appointments | data_warehouse |
| branches | public | fr_branches | data_warehouse |
| chemicals | public | fr_chemicals | data_warehouse |
| chemical_uses | public | fr_chemical_uses | data_warehouse |
| customers | public | fr_customers | data_warehouse |
| employees | public | fr_employees | data_warehouse |
| invoices | public | fr_invoices | data_warehouse |
| locations | public | fr_locations | data_warehouse |
| payments | public | fr_payments | data_warehouse |
| service_types | public | fr_service_types | data_warehouse |
| subscriptions | public | fr_subscriptions | data_warehouse |

## Data Warehouse Schema — QuickBooks (from public)

These QBO summary/report tables came from the public schema. Names unchanged.

| Old Name | Old Schema | New Name | New Schema |
|----------|-----------|----------|-----------|
| qbo_accounts | public | qbo_accounts | data_warehouse |
| qbo_balance_sheet | public | qbo_balance_sheet | data_warehouse |
| qbo_general_ledger | public | qbo_general_ledger | data_warehouse |
| qbo_profit_loss | public | qbo_profit_loss | data_warehouse |
| qbo_trial_balance | public | qbo_trial_balance | data_warehouse |

## Data Warehouse Schema — QuickBooks (from quickbooks schema)

These QBO detail tables came from the old `quickbooks` schema. All renamed with `qbo_` prefix.

| Old Name | Old Schema | New Name | New Schema |
|----------|-----------|----------|-----------|
| accounts | quickbooks | qbo_accounts_detail | data_warehouse |
| bills | quickbooks | qbo_bills | data_warehouse |
| customers | quickbooks | qbo_customers | data_warehouse |
| invoices | quickbooks | qbo_invoices | data_warehouse |
| journal_entries | quickbooks | qbo_journal_entries | data_warehouse |
| payments | quickbooks | qbo_payments | data_warehouse |
| purchases | quickbooks | qbo_purchases | data_warehouse |
| sales_receipts | quickbooks | qbo_sales_receipts | data_warehouse |
| vendors | quickbooks | qbo_vendors | data_warehouse |
| oauth_tokens | quickbooks | qbo_oauth_tokens | data_warehouse |
| sync_errors | quickbooks | qbo_sync_errors | data_warehouse |
| sync_jobs | quickbooks | qbo_sync_jobs | data_warehouse |

**Note:** `quickbooks.accounts` became `qbo_accounts_detail` (not `qbo_accounts`) to avoid colliding with `public.qbo_accounts`.

## Data Warehouse Schema — Other Sources

Names unchanged, just moved schema.

| Old Name | Old Schema | New Name | New Schema |
|----------|-----------|----------|-----------|
| applause_ratings | public | applause_ratings | data_warehouse |
| applause_reviews | public | applause_reviews | data_warehouse |
| azuga_driving_scores | public | azuga_driving_scores | data_warehouse |
| ghl_contacts | public | ghl_contacts | data_warehouse |
| ghl_opportunities | public | ghl_opportunities | data_warehouse |
| ghl_pipelines | public | ghl_pipelines | data_warehouse |
| gusto_daily_hours | public | gusto_daily_hours | data_warehouse |

## Data Warehouse Schema — DispositionsAI

Renamed with `dispositionsai_` prefix.

| Old Name | Old Schema | New Name | New Schema |
|----------|-----------|----------|-----------|
| calls | public | dispositionsai_calls | data_warehouse |
| transcripts | public | dispositionsai_transcripts | data_warehouse |
| analyses | public | dispositionsai_analyses | data_warehouse |

**Note:** These tables have no `tenant_id` column yet. They are deny-all for authenticated users (service_role only). VFP integration will add tenant_id in the future.

## Data Warehouse Schema — Sync Infrastructure

| Old Name | Old Schema | New Name | New Schema |
|----------|-----------|----------|-----------|
| sync_log | public | sync_log | data_warehouse |
| tenant_data_sources | public | sync_tenant_data_sources | data_warehouse |

---

## Sales Schema (Product: Elevate Pay, slug: `pay`)

| Old Name | Old Schema | New Name | New Schema |
|----------|-----------|----------|-----------|
| payscales | public | payscales | sales |
| payscale_tiers | public | payscale_tiers | sales |
| payscale_assignments | public | payscale_assignments | sales |
| override_assignments | public | override_assignments | sales |
| tenant_kpis | public | tenant_kpis | sales |
| tenant_field_definitions | public | tenant_field_definitions | sales |
| user_fieldroutes_ids | public | user_fieldroutes_ids | sales |
| user_branches | public | user_branches | sales |
| qualified_leads | public | qualified_leads | sales |

---

## Compliance Schema (Product: Elevate Compliance, slug: `compliance`)

| Old Name | Old Schema | New Name | New Schema |
|----------|-----------|----------|-----------|
| instruction_templates | public | instruction_templates | compliance |
| instruction_template_products | public | instruction_template_products | compliance |
| insects | public | insects | compliance |
| application_methods | public | application_methods | compliance |
| custom_notes | public | custom_notes | compliance |

---

## Permits Schema (Product: Elevate Permits, slug: `permits`)

| Old Name | Old Schema | New Name | New Schema |
|----------|-----------|----------|-----------|
| permit_reps | public | permit_reps | permits |
| permit_rep_profiles | public | permit_rep_profiles | permits |
| permit_templates | public | permit_templates | permits |
| rep_permits | public | rep_permits | permits |
| towns | public | towns | permits |
| teams | public | teams | permits |
| team_members | public | team_members | permits |
| rep_invite_tokens | public | rep_invite_tokens | permits |
| password_reset_tokens | public | password_reset_tokens | permits |

---

## Execution Schema (Product: Elevate Execution, slug: `execution`)

| Old Name | Old Schema | New Name | New Schema |
|----------|-----------|----------|-----------|
| goals | public | goals | execution |
| milestones | public | milestones | execution |
| tasks | public | tasks | execution |
| visions | public | visions | execution |
| positions | public | positions | execution |
| comments | public | comments | execution |

---

## Finance Schema (Product: Elevate Dashboards, slug: `dashboards`)

No product-specific tables yet. Financial data is accessed through product views over data_warehouse QBO tables.

---

## Product Views over Data Warehouse

Each product schema has **read-only views** that gate access by product slug. These views have the same name as the underlying data_warehouse table.

### Sales views (`sales.*`)
`fr_appointments`, `fr_customers`, `fr_employees`, `fr_invoices`, `fr_payments`, `fr_subscriptions`, `fr_service_types`, `fr_locations`, `fr_branches`, `applause_ratings`, `applause_reviews`, `azuga_driving_scores`, `ghl_contacts`, `ghl_opportunities`, `ghl_pipelines`, `gusto_daily_hours`, `qbo_accounts`, `qbo_balance_sheet`, `qbo_general_ledger`, `qbo_profit_loss`, `qbo_trial_balance`, `qbo_accounts_detail`, `qbo_bills`, `qbo_customers`, `qbo_invoices`, `qbo_journal_entries`, `qbo_payments`, `qbo_purchases`, `qbo_sales_receipts`, `qbo_vendors`, `sync_log`, `sync_tenant_data_sources`

### Compliance views (`compliance.*`)
`fr_appointments`, `fr_chemicals`, `fr_chemical_uses`, `fr_customers`, `fr_employees`, `fr_locations`, `fr_service_types`

### Permits views (`permits.*`)
`fr_employees`, `fr_customers`, `fr_locations`, `fr_branches`

### Execution views (`execution.*`)
`fr_employees`, `fr_branches`

### Finance views (`finance.*`)
`qbo_accounts`, `qbo_balance_sheet`, `qbo_general_ledger`, `qbo_profit_loss`, `qbo_trial_balance`, `qbo_accounts_detail`, `qbo_bills`, `qbo_customers`, `qbo_invoices`, `qbo_journal_entries`, `qbo_payments`, `qbo_purchases`, `qbo_sales_receipts`, `qbo_vendors`, `fr_invoices`, `fr_payments`, `gusto_daily_hours`, `sync_log`, `sync_tenant_data_sources`

---

## Dropped/Removed

| What | Where It Was | Why |
|------|-------------|-----|
| `quickbooks` schema | Entire schema | All tables moved to data_warehouse |
| `v_monthly_pnl` | quickbooks | Recreated in data_warehouse |
| `v_monthly_expenses` | quickbooks | Recreated in data_warehouse |
| `v_monthly_revenue` | quickbooks | Recreated in data_warehouse |
| `v_active_subscriptions` | public | Recreated in data_warehouse |
| `v_employee_productivity` | public | Recreated in data_warehouse |
| `v_revenue_by_month` | public | Recreated in data_warehouse |
| 65 compatibility views | public | Dropped in Phase 6 after apps migrated |
| `get_user_tenant_ids()` | public | Replaced by `platform.get_tenant_id()` |
| `get_tenant_ids()` | public | Replaced by `platform.get_tenant_id()` |

---

## RLS Helper Functions

These replace all old auth patterns. All in `platform` schema.

| Function | Returns | Source |
|----------|---------|--------|
| `platform.get_tenant_id()` | UUID | JWT claims |
| `platform.has_product_access(slug)` | BOOLEAN | JWT claims |
| `platform.is_platform_admin()` | BOOLEAN | JWT claims |
| `platform.is_tenant_admin()` | BOOLEAN | JWT claims |
| `platform.get_product_role(slug)` | TEXT | JWT claims |
| `platform.is_active_user()` | BOOLEAN | DB lookup (instant revocation) |
| `platform.get_qbo_realm_id()` | TEXT | DB lookup via tenant_id |
