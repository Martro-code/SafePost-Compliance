# Supabase Migrations

These migrations have **already been applied** to the production database (project ref: `acvcwzaipsxyrwbxithc`).

## Do NOT re-run these migrations

Running `supabase db push` or `supabase db reset` against production will attempt to re-apply these files, which will fail or cause data loss. These files are checked in for reference and version control only.

If you need to make a new schema change:

1. Create a new file with a timestamp **after** `20250324000300`:
   ```
   supabase/migrations/YYYYMMDDHHMMSS_description.sql
   ```
2. Use `IF NOT EXISTS`, `IF EXISTS`, and other idempotent patterns where possible.
3. Test against a local Supabase instance or a staging project before applying to production.

## Migration order

Files are prefixed with `YYYYMMDDHHMMSS_` timestamps that enforce execution order. Key dependency constraints:

- `team_members` (001300) must run before `add_cascade_deletes` (001600)
- `migrate_existing_users` (001400) must run after base table modifications
- `create_user_preferences` (000200 on Mar 24) must run before `backfill_email_product_updates_default` (000300 on Mar 24)
- `process_onboarding_cron` (001900) must run after `create_onboarding_emails` (001200)
