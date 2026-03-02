/**
 * Canonical plan display names.
 * This is the single source of truth for how plan names render across the app.
 * Every component that shows a plan name must import from here.
 */

/** Full display names including the "SafePost" prefix */
const PLAN_DISPLAY_NAMES: Record<string, string> = {
  starter: 'SafePost Starter',
  free: 'SafePost Starter',
  professional: 'SafePost Professional',
  proplus: 'SafePost Pro+',
  ultra: 'SafePost Ultra',
};

/** Short tier labels without the "SafePost" prefix */
const PLAN_TIER_LABELS: Record<string, string> = {
  starter: 'Starter',
  free: 'Starter',
  professional: 'Professional',
  proplus: 'Pro+',
  ultra: 'Ultra',
};

/**
 * Returns the full canonical display name for a plan key.
 * e.g. "starter" | "free" → "SafePost Starter"
 */
export function getDisplayPlanName(planKey: string): string {
  const key = planKey?.toLowerCase().trim() || 'starter';
  return PLAN_DISPLAY_NAMES[key] ?? PLAN_DISPLAY_NAMES.starter;
}

/**
 * Returns the short tier label (without "SafePost" prefix).
 * e.g. "starter" | "free" → "Starter"
 */
export function getPlanTierLabel(planKey: string): string {
  const key = planKey?.toLowerCase().trim() || 'starter';
  return PLAN_TIER_LABELS[key] ?? PLAN_TIER_LABELS.starter;
}
