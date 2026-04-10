-- Add composite index on compliance_checks for account_id and created_at
-- This replaces the current sequential table scan with an index seek
CREATE INDEX IF NOT EXISTS idx_compliance_checks_account_created
  ON compliance_checks (account_id, created_at DESC);

-- Add index on audit_sessions for account_id
CREATE INDEX IF NOT EXISTS idx_audit_sessions_account_created
  ON audit_sessions (account_id, updated_at DESC);
