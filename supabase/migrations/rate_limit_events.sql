-- Rate limit events table for tracking Edge Function call frequency
create table if not exists public.rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  function_name text not null,
  created_at timestamptz not null default now()
);

-- Index for efficient lookups by user + function + time window
create index if not exists idx_rate_limit_events_lookup
  on public.rate_limit_events (user_id, function_name, created_at desc);

-- Enable RLS
alter table public.rate_limit_events enable row level security;

-- Users can only insert their own rows
create policy "Users can insert own rate limit events"
  on public.rate_limit_events for insert
  with check (auth.uid() = user_id);

-- Users can only read their own rows
create policy "Users can read own rate limit events"
  on public.rate_limit_events for select
  using (auth.uid() = user_id);

-- NOTE: Schedule a periodic cleanup job to purge records older than 24 hours.
-- Example using pg_cron (if enabled on your Supabase project):
--   select cron.schedule(
--     'purge-rate-limit-events',
--     '0 * * * *',  -- every hour
--     $$delete from public.rate_limit_events where created_at < now() - interval '24 hours'$$
--   );
