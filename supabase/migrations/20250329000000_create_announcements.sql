-- Create announcements table for SafePost broadcast messages.
-- Announcements are managed directly via the Supabase SQL Editor by admins.
-- Authenticated users can read active announcements; no user-facing insert/update policy.

CREATE TABLE IF NOT EXISTS announcements (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  message    text NOT NULL,
  link_text  text,
  link_url   text,
  active     boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read rows where active = true.
CREATE POLICY "Authenticated users can read active announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (active = true);
