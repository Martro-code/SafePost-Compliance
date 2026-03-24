-- Migration: Allow 'conduct_risk' as a valid overall_status in compliance_checks
--
-- The CONDUCT_RISK verdict category was added to the application but the
-- compliance_checks table constraint on overall_status did not include it,
-- causing inserts with overall_status = 'conduct_risk' to fail silently.
--
-- This migration updates the CHECK constraint to accept 'conduct_risk'.

-- Drop the existing constraint (name may vary — try common patterns)
ALTER TABLE public.compliance_checks
  DROP CONSTRAINT IF EXISTS compliance_checks_overall_status_check;

ALTER TABLE public.compliance_checks
  DROP CONSTRAINT IF EXISTS compliance_checks_status_check;

-- Re-create with conduct_risk included
ALTER TABLE public.compliance_checks
  ADD CONSTRAINT compliance_checks_overall_status_check
  CHECK (overall_status IN ('compliant', 'non_compliant', 'requires_review', 'conduct_risk'));
