CREATE TABLE audit_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'in_progress', -- 'in_progress' | 'complete'
  steps jsonb NOT NULL DEFAULT '[]'
);

ALTER TABLE audit_sessions ENABLE ROW LEVEL SECURITY;

-- Users can manage audit sessions that belong to their account.
-- Covers both account owners (via owner_user_id) and active account members.
CREATE POLICY "Users can manage their own audit sessions"
  ON audit_sessions
  FOR ALL
  USING (
    account_id IN (
      SELECT account_id FROM account_members
      WHERE user_id = auth.uid()
        AND status = 'active'
    )
  );
