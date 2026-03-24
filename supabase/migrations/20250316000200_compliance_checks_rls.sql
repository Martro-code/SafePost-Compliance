-- Migration: Enable RLS and add policies for compliance_checks table
--
-- Ensures authenticated users can only INSERT and SELECT their own rows.
-- The service_role key (used by Edge Functions) bypasses RLS, so these
-- policies only affect client-side (anon key) access.

-- Enable RLS (safe to re-run)
ALTER TABLE public.compliance_checks ENABLE ROW LEVEL SECURITY;

-- Users can insert their own compliance checks
CREATE POLICY IF NOT EXISTS "Users can insert own compliance checks"
  ON public.compliance_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own compliance checks
CREATE POLICY IF NOT EXISTS "Users can select own compliance checks"
  ON public.compliance_checks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own compliance checks (e.g. saving rewrite options)
CREATE POLICY IF NOT EXISTS "Users can update own compliance checks"
  ON public.compliance_checks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own compliance checks
CREATE POLICY IF NOT EXISTS "Users can delete own compliance checks"
  ON public.compliance_checks FOR DELETE
  USING (auth.uid() = user_id);

-- To audit existing policies, run:
-- SELECT policyname, cmd, roles, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'compliance_checks';
