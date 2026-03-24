-- Migration: Add ON DELETE CASCADE to all foreign keys referencing auth.users
--
-- When a user is deleted from Supabase Auth, all their associated data should
-- be automatically removed. This migration drops the existing foreign key
-- constraints (which default to NO ACTION) and recreates them with ON DELETE
-- CASCADE on the following columns:
--
--   - accounts.owner_user_id        → auth.users(id)
--   - account_members.user_id       → auth.users(id)
--   - compliance_checks.user_id     → auth.users(id)
--
-- Safe to re-run — uses IF EXISTS on drops and idempotent adds.

-- ============================================================================
-- 1. accounts.owner_user_id → auth.users(id) ON DELETE CASCADE
-- ============================================================================

-- Drop the existing constraint (name may vary; try the most common conventions)
ALTER TABLE public.accounts
  DROP CONSTRAINT IF EXISTS accounts_owner_user_id_fkey;

ALTER TABLE public.accounts
  ADD CONSTRAINT accounts_owner_user_id_fkey
  FOREIGN KEY (owner_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ============================================================================
-- 2. account_members.user_id → auth.users(id) ON DELETE CASCADE
-- ============================================================================

ALTER TABLE public.account_members
  DROP CONSTRAINT IF EXISTS account_members_user_id_fkey;

ALTER TABLE public.account_members
  ADD CONSTRAINT account_members_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ============================================================================
-- 3. compliance_checks.user_id → auth.users(id) ON DELETE CASCADE
-- ============================================================================

ALTER TABLE public.compliance_checks
  DROP CONSTRAINT IF EXISTS compliance_checks_user_id_fkey;

ALTER TABLE public.compliance_checks
  ADD CONSTRAINT compliance_checks_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
