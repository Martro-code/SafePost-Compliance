-- User notification & email preferences
create table if not exists user_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,

  -- Email preferences
  email_product_updates boolean not null default true,
  email_compliance_alerts boolean not null default false,
  email_billing_notifications boolean not null default true,
  email_usage_summaries boolean not null default false,
  email_tips_education boolean not null default false,

  -- In-app notification preferences
  notif_compliance_results boolean not null default false,
  notif_guideline_updates boolean not null default false,
  notif_billing_activity boolean not null default false,
  notif_new_features boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table user_preferences enable row level security;

create policy "Users can read their own preferences"
  on user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
  on user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on user_preferences for update
  using (auth.uid() = user_id);
