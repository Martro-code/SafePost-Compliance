-- Migration: Add ON DELETE CASCADE to remaining foreign keys
--
-- Ensures that when a parent row is deleted, all dependent rows are
-- automatically cleaned up. This covers account-level cascades that were
-- not addressed by the earlier add_cascade_delete_auth_users.sql migration
-- (which handled auth.users cascades on accounts, account_members, and
-- compliance_checks).
--
-- Tables addressed here:
--   - account_members.account_id  → accounts(id)   ON DELETE CASCADE
--   - compliance_checks.account_id → accounts(id)   ON DELETE CASCADE
--   - team_members.member_user_id → auth.users(id)  ON DELETE CASCADE  (was SET NULL)
--
-- Tables confirmed already correct (no changes needed):
--   - rate_limit_events.user_id   → auth.users(id)  ON DELETE CASCADE  ✓
--   - notification_reads.user_id  → auth.users(id)  ON DELETE CASCADE  ✓
--   - onboarding_emails.user_id   → auth.users(id)  ON DELETE CASCADE  ✓
--   - accounts.owner_user_id      → auth.users(id)  ON DELETE CASCADE  ✓
--   - account_members.user_id     → auth.users(id)  ON DELETE CASCADE  ✓
--   - compliance_checks.user_id   → auth.users(id)  ON DELETE CASCADE  ✓
--   - team_members.account_owner_id → auth.users(id) ON DELETE CASCADE ✓
--
-- Safe to re-run — uses IF EXISTS on drops.

-- ============================================================================
-- 1. account_members.account_id → accounts(id) ON DELETE CASCADE
--    When an account is deleted, all memberships for that account are removed.
-- ============================================================================

ALTER TABLE public.account_members
  DROP CONSTRAINT IF EXISTS account_members_account_id_fkey;

ALTER TABLE public.account_members
  ADD CONSTRAINT account_members_account_id_fkey
  FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;

-- ============================================================================
-- 2. compliance_checks.account_id → accounts(id) ON DELETE CASCADE
--    When an account is deleted, all compliance checks for that account are removed.
-- ============================================================================

ALTER TABLE public.compliance_checks
  DROP CONSTRAINT IF EXISTS compliance_checks_account_id_fkey;

ALTER TABLE public.compliance_checks
  ADD CONSTRAINT compliance_checks_account_id_fkey
  FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;

-- ============================================================================
-- 3. team_members.member_user_id → auth.users(id) ON DELETE CASCADE
--    Previously ON DELETE SET NULL — upgrade to CASCADE so that when a member
--    user is deleted, the team_members row is fully removed rather than left
--    as an orphaned record with a NULL member_user_id.
-- ============================================================================

ALTER TABLE public.team_members
  DROP CONSTRAINT IF EXISTS team_members_member_user_id_fkey;

ALTER TABLE public.team_members
  ADD CONSTRAINT team_members_member_user_id_fkey
  FOREIGN KEY (member_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
