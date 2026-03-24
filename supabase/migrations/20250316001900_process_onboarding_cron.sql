-- Schedule the process-onboarding-sequence Edge Function to run daily at 23:00 UTC (9:00 AM AEST)
-- Requires the pg_cron and pg_net extensions to be enabled in your Supabase project.

select
  cron.schedule(
    'process-onboarding-sequence',   -- job name
    '0 23 * * *',                    -- 23:00 UTC = 09:00 AEST (UTC+10)
    $$
    select
      net.http_post(
        url := current_setting('app.settings.supabase_url') || '/functions/v1/process-onboarding-sequence',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        ),
        body := '{}'::jsonb
      ) as request_id;
    $$
  );
