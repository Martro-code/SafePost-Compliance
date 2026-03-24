-- Create onboarding_emails table
-- This table stores scheduled onboarding email sequences for users.
-- Used by: initialise-onboarding-sequence, process-onboarding-sequence, send-onboarding-email

create table if not exists public.onboarding_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email_number integer not null,
  plan_tier text not null,
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),

  -- initialise-onboarding-sequence upserts with onConflict: 'user_id,email_number'
  constraint onboarding_emails_user_id_email_number_key unique (user_id, email_number)
);

-- Index for process-onboarding-sequence: fetches rows where scheduled_for <= now,
-- sent_at is null, and cancelled_at is null
create index if not exists idx_onboarding_emails_pending
  on public.onboarding_emails (scheduled_for)
  where sent_at is null and cancelled_at is null;

-- Enable RLS
alter table public.onboarding_emails enable row level security;

-- Users can read their own onboarding email rows
create policy "Users can view their own onboarding emails"
  on public.onboarding_emails
  for select
  using (auth.uid() = user_id);

-- Service role (used by Edge Functions) bypasses RLS automatically.
-- No INSERT/UPDATE/DELETE policies needed for end users.
