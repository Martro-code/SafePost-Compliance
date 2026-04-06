-- Register pg_cron job for process-renewal-notices.
--
-- This job runs daily at 09:00 UTC and calls the process-renewal-notices
-- Edge Function, which identifies annual subscribers whose reset_at date
-- falls exactly 30 days from today and sends them a renewal notice email.
--
-- IMPORTANT: Replace <SERVICE_ROLE_KEY> with the actual service role key from
-- Dashboard → Settings → API → service_role (secret) before running this.
-- Do NOT commit the real key value to source control.

SELECT cron.schedule(
  'process-renewal-notices',
  '0 9 * * *',  -- 09:00 UTC daily
  $$
  SELECT
    net.http_post(
      url := 'https://acvcwzaipsxyrwbxithc.supabase.co/functions/v1/process-renewal-notices',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
      ),
      body := '{}'::jsonb
    ) AS request_id;
  $$
);
