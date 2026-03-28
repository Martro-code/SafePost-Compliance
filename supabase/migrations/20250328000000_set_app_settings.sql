-- Restore app.settings.* database parameters required by the pg_cron onboarding
-- email job (see 20250316001900_process_onboarding_cron.sql).
--
-- These settings were lost during the project migration from Mumbai (ap-south-1)
-- to Sydney (ap-southeast-2). They must be set on the new project before the
-- pg_cron job will fire successfully.
--
-- IMPORTANT: Replace <SERVICE_ROLE_KEY> below with the actual service role key
-- from Dashboard → Settings → API before running this in the SQL editor.
-- Do NOT commit the real key value to source control.
--
-- To find the values:
--   supabase_url:      Dashboard → Settings → API → Project URL
--   service_role_key:  Dashboard → Settings → API → service_role (secret)

ALTER DATABASE postgres SET app.settings.supabase_url = 'https://acvcwzaipsxyrwbxithc.supabase.co';
ALTER DATABASE postgres SET app.settings.service_role_key = '<SERVICE_ROLE_KEY>';
