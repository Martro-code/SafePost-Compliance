-- In-app notifications
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null,           -- e.g. compliance_complete, guideline_update, billing, new_feature
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Index for fast unread-count and feed queries
create index if not exists idx_notifications_user_read_created
  on notifications (user_id, read, created_at desc);

-- RLS
alter table notifications enable row level security;

create policy "Users can read their own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on notifications for update
  using (auth.uid() = user_id);
