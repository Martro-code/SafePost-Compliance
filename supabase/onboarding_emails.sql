-- Create onboarding_emails table to track email sequence state per user
create table if not exists public.onboarding_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_tier text not null check (plan_tier in ('starter', 'professional', 'pro_plus', 'ultra')),
  email_number integer not null check (email_number between 1 and 5),
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  created_at timestamptz not null default now(),

  -- Prevent duplicate sends for the same user + email number
  constraint onboarding_emails_user_email_unique unique (user_id, email_number)
);

-- Index for efficient cron queries that find unsent emails due to be sent
create index if not exists idx_onboarding_emails_schedule
  on public.onboarding_emails (scheduled_for)
  where sent_at is null;

-- Index on sent_at for querying sent history
create index if not exists idx_onboarding_emails_sent_at
  on public.onboarding_emails (sent_at);

-- Enable Row Level Security
alter table public.onboarding_emails enable row level security;

-- Authenticated users can only read their own rows
create policy "Users can read own onboarding emails"
  on public.onboarding_emails
  for select
  to authenticated
  using (auth.uid() = user_id);
