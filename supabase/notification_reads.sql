-- Migration: Create notification_reads table
-- Run this SQL in your Supabase SQL Editor before deploying the code changes.

-- Table to persist which notifications each user has read
create table if not exists notification_reads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  notification_id int not null,
  read_at timestamptz default now() not null,
  unique(user_id, notification_id)
);

-- Enable Row Level Security
alter table notification_reads enable row level security;

-- Users can only view their own notification reads
create policy "Users can view their own notification reads"
  on notification_reads for select
  using (auth.uid() = user_id);

-- Users can only insert their own notification reads
create policy "Users can insert their own notification reads"
  on notification_reads for insert
  with check (auth.uid() = user_id);
