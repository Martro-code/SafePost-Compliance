-- Add structured analytics columns to compliance_checks
-- These columns materialise data that previously existed only inside the
-- result_json JSONB blob, making aggregate queries possible without JSONB
-- parsing or full-text search.
--
-- Run manually in the Supabase SQL Editor (service role required).
-- All columns use IF NOT EXISTS / DEFAULT values so the migration is safe
-- to re-run and does not affect existing rows.

ALTER TABLE public.compliance_checks
  -- Denormalised from accounts.specialty at insert time.
  -- Enables per-specialty non-compliance rate queries without a join.
  ADD COLUMN IF NOT EXISTS specialty text,

  -- Structured breach taxonomy populated from result_json.issues at insert time.
  -- Values are short kebab-case identifiers, e.g.:
  --   'testimonial', 'patient_privacy', 'tga_advertising', 'comparative_claim',
  --   'guarantee', 'before_after', 'conduct_risk'
  ADD COLUMN IF NOT EXISTS breach_categories text[] DEFAULT '{}',

  -- Which regulatory frameworks were triggered: 'ahpra', 'tga', or both.
  -- Enables AHPRA-only vs TGA-only vs dual-framework split analysis.
  ADD COLUMN IF NOT EXISTS frameworks_triggered text[] DEFAULT '{}',

  -- Materialised issue counts from result_json.issues filtered by severity.
  -- Avoids JSONB aggregation for common "how severe was this check" queries.
  ADD COLUMN IF NOT EXISTS critical_issue_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS warning_issue_count  integer DEFAULT 0,

  -- Raw Claude status before normalisation.
  -- Preserves the distinction between 'WARNING' and 'NOT_HEALTHCARE', both of
  -- which are currently collapsed into overall_status = 'requires_review'.
  -- Values: 'COMPLIANT', 'NON_COMPLIANT', 'WARNING', 'NOT_HEALTHCARE', 'CONDUCT_RISK'
  ADD COLUMN IF NOT EXISTS ai_status text;

-- ── Indexes ───────────────────────────────────────────────────────────────────

-- B-tree index on specialty for equality/GROUP BY queries
-- (e.g. non-compliance rate by specialty)
CREATE INDEX IF NOT EXISTS idx_compliance_checks_specialty
  ON public.compliance_checks (specialty);

-- GIN index on breach_categories array for containment queries
-- (e.g. WHERE breach_categories @> ARRAY['testimonial'])
CREATE INDEX IF NOT EXISTS idx_compliance_checks_breach_categories
  ON public.compliance_checks USING gin (breach_categories);

-- GIN index on frameworks_triggered array for containment queries
-- (e.g. WHERE frameworks_triggered @> ARRAY['tga'])
CREATE INDEX IF NOT EXISTS idx_compliance_checks_frameworks
  ON public.compliance_checks USING gin (frameworks_triggered);
