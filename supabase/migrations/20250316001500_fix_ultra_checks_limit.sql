-- Fix: Ultra plan accounts incorrectly had checks_limit set to 3 instead of NULL (unlimited).
-- This was caused by the nullish coalescing operator (??) in UpgradeConfirmation.tsx
-- treating null as a fallback value.
--
-- Safe to re-run — only affects accounts where plan = 'ultra' and checks_limit is not NULL.

UPDATE public.accounts
SET checks_limit = NULL
WHERE plan = 'ultra'
  AND checks_limit IS NOT NULL;
