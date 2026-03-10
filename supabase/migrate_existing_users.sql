-- Migration: Provision accounts and account_members for existing users
-- This script creates an accounts row and account_members row for every
-- Supabase Auth user who does not yet have an account_members entry.
-- It also backfills account_id on existing compliance_checks.
--
-- Run this once after the accounts and account_members tables have been created.
-- Safe to re-run — uses NOT EXISTS guards.

-- Step 1: Create accounts and account_members for existing users without one
DO $$
DECLARE
  r RECORD;
  new_account_id UUID;
  user_plan TEXT;
  plan_limit INT;
  monthly_count INT;
BEGIN
  FOR r IN
    SELECT id, email, raw_user_meta_data
    FROM auth.users
    WHERE id NOT IN (SELECT user_id FROM public.account_members WHERE user_id IS NOT NULL)
  LOOP
    -- Determine the user's plan from their metadata
    user_plan := COALESCE(r.raw_user_meta_data->>'plan', 'starter');

    -- Map plan to checks_limit
    plan_limit := CASE user_plan
      WHEN 'ultra' THEN NULL
      WHEN 'pro_plus' THEN 100
      WHEN 'professional' THEN 30
      WHEN 'starter' THEN 3
      WHEN 'free' THEN 3
      ELSE 3
    END;

    -- Count this month's existing checks for the user
    SELECT COUNT(*)
    INTO monthly_count
    FROM public.compliance_checks
    WHERE user_id = r.id
      AND created_at >= date_trunc('month', NOW());

    -- Create the account
    INSERT INTO public.accounts (owner_user_id, plan, checks_used, checks_limit, billing_email)
    VALUES (r.id, user_plan, monthly_count, plan_limit, r.email)
    RETURNING id INTO new_account_id;

    -- Create the account membership
    INSERT INTO public.account_members (account_id, user_id, role, status, invited_email)
    VALUES (new_account_id, r.id, 'owner', 'active', r.email);

    -- Backfill account_id on this user's compliance_checks
    UPDATE public.compliance_checks
    SET account_id = new_account_id
    WHERE user_id = r.id
      AND account_id IS NULL;

    RAISE NOTICE 'Provisioned account % for user % (%)', new_account_id, r.id, r.email;
  END LOOP;
END $$;

-- Step 2: Backfill any remaining compliance_checks that have a user_id but no account_id
-- (handles edge cases where a user was partially migrated)
UPDATE public.compliance_checks cc
SET account_id = am.account_id
FROM public.account_members am
WHERE cc.user_id = am.user_id
  AND cc.account_id IS NULL
  AND am.status = 'active';
