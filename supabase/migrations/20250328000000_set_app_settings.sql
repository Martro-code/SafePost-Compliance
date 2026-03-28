-- Restore app.settings.* database parameters required by the pg_cron onboarding
-- email job (see 20250316001900_process_onboarding_cron.sql).
--
-- These settings were lost during the project migration from Mumbai (ap-south-1)
-- to Sydney (ap-southeast-2). They must be set on the new project before the
-- pg_cron job will fire successfully.
--
-- pg_cron jobs in Supabase run as the postgres role, so ALTER ROLE postgres SET
-- ensures the settings are available in every new session that role starts.
-- The set_config() calls apply the settings to the current session immediately
-- (ALTER ROLE only takes effect for new connections).
--
-- IMPORTANT: Replace <SERVICE_ROLE_KEY> with the actual service role key from
-- Dashboard → Settings → API → service_role (secret) before running this.
-- Do NOT commit the real key value to source control.

-- Persist for all future sessions under the postgres role
ALTER ROLE postgres SET app.settings.supabase_url TO 'https://acvcwzaipsxyrwbxithc.supabase.co';
ALTER ROLE postgres SET app.settings.service_role_key TO '<SERVICE_ROLE_KEY>';

-- Apply immediately to the current session
SELECT set_config('app.settings.supabase_url', 'https://acvcwzaipsxyrwbxithc.supabase.co', false);
SELECT set_config('app.settings.service_role_key', '<SERVICE_ROLE_KEY>', false);
