-- Fix pg_cron job for process-onboarding-sequence post-migration.
--
-- The original job (20250316001900_process_onboarding_cron.sql) read the
-- Supabase URL and service role key from app.settings.* database parameters.
-- Those parameters cannot be set in Supabase (ALTER DATABASE / ALTER ROLE both
-- require superuser privileges not available in the SQL Editor).
--
-- This migration drops the existing job and recreates it with the values
-- hardcoded directly in the cron body.
--
-- IMPORTANT: Replace <SERVICE_ROLE_KEY> with the actual service role key from
-- Dashboard → Settings → API → service_role (secret) before running this.
-- Do NOT commit the real key value to source control.

-- Drop the existing job if it exists
SELECT cron.unschedule('process-onboarding-sequence');

-- Recreate with hardcoded URL and service role key
SELECT cron.schedule(
  'process-onboarding-sequence',
  '0 23 * * *',  -- 23:00 UTC = 09:00 AEST (UTC+10)
  $$
  SELECT
    net.http_post(
      url := 'https://acvcwzaipsxyrwbxithc.supabase.co/functions/v1/process-onboarding-sequence',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
      ),
      body := '{}'::jsonb
    ) AS request_id;
  $$
);
