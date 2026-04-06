-- SUPERSEDED by 20250328000100_fix_onboarding_cron_hardcoded.sql
--
-- This migration was originally written to restore app.settings.* database
-- parameters via ALTER DATABASE / ALTER ROLE, but both commands require
-- superuser privileges not available in the Supabase SQL Editor.
--
-- The pg_cron job has been updated to hardcode the values directly instead.
-- This file is intentionally left as a no-op so the migration history remains
-- consistent.
SELECT 1;
