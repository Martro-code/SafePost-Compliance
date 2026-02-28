<<<<<<< claude/review-repository-code-5gsoN
import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Sparkles, Info } from 'lucide-react';

interface ComplianceIssue {
  description: string;
  guidelineRef?: string;
}

interface RewriteSuggestion {
  original: string;
  rewrite: string;
}

interface ComplianceResultsProps {
  verdict: 'compliant' | 'non-compliant' | 'warning';
  summary: string;
  issues: ComplianceIssue[];
  rewrites?: RewriteSuggestion[];
  onNewCheck: () => void;
  onGenerateRewrites?: () => void;
}

const ComplianceResults: React.FC<ComplianceResultsProps> = ({
  verdict,
  summary,
  issues,
  rewrites,
  onNewCheck,
  onGenerateRewrites,
}) => {
  const verdictConfig = {
    'compliant': {
      bgClass: 'bg-green-50 dark:bg-green-950',
      borderClass: 'border-green-200 dark:border-green-800',
      iconBgClass: 'bg-green-100 dark:bg-green-900',
      iconClass: 'text-green-600 dark:text-green-400',
      labelClass: 'text-green-500 dark:text-green-400',
      titleClass: 'text-green-700 dark:text-green-300',
      textClass: 'text-green-700/80 dark:text-green-300/80',
      label: 'Compliant',
      Icon: CheckCircle2,
    },
    'non-compliant': {
      bgClass: 'bg-red-50 dark:bg-red-950',
      borderClass: 'border-red-200 dark:border-red-800',
      iconBgClass: 'bg-red-100 dark:bg-red-900',
      iconClass: 'text-red-600 dark:text-red-400',
      labelClass: 'text-red-500 dark:text-red-400',
      titleClass: 'text-red-700 dark:text-red-300',
      textClass: 'text-red-700/80 dark:text-red-300/80',
      label: 'Non-Compliant',
      Icon: XCircle,
    },
    'warning': {
      bgClass: 'bg-amber-50 dark:bg-amber-950',
      borderClass: 'border-amber-200 dark:border-amber-800',
      iconBgClass: 'bg-amber-100 dark:bg-amber-900',
      iconClass: 'text-amber-600 dark:text-amber-400',
      labelClass: 'text-amber-500 dark:text-amber-400',
      titleClass: 'text-amber-700 dark:text-amber-300',
      textClass: 'text-amber-700/80 dark:text-amber-300/80',
      label: 'Needs Review',
      Icon: AlertTriangle,
    },
  };

  const config = verdictConfig[verdict];
  const VerdictIcon = config.Icon;

  return (
    <div className="space-y-4">
      {/* Prominent disclaimer — shown above rewrites */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 dark:bg-blue-950 dark:border-blue-900">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-[12px] text-blue-700 dark:text-blue-300 leading-relaxed">
          <span className="font-semibold">Important:</span> SafePost&trade; is an AI-powered guidance tool and does not constitute legal or regulatory advice.
          Practitioners are solely responsible for ensuring their social media activities and advertising complies with the National Law and AHPRA guidelines.
        </p>
      </div>

      {/* Verdict card */}
      <div className={`${config.bgClass} rounded-2xl border ${config.borderClass} p-6 md:p-8`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl ${config.iconBgClass} flex items-center justify-center`}>
            <VerdictIcon className={`w-5 h-5 ${config.iconClass}`} />
          </div>
          <div>
            <p className={`text-[11px] font-semibold ${config.labelClass} uppercase tracking-wider`}>Verdict</p>
            <h3 className={`text-lg font-bold ${config.titleClass}`}>{config.label}</h3>
          </div>
        </div>
        <p className={`text-[14px] ${config.textClass} leading-relaxed mb-5`}>
          {summary}
        </p>

        {issues.length > 0 && (
          <div className="space-y-3">
            <h4 className={`text-[12px] font-semibold ${config.labelClass} uppercase tracking-wider`}>Identified Risks</h4>
            <div className="space-y-2">
              {issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <AlertTriangle className={`w-4 h-4 ${config.iconClass} mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className={`text-[13px] ${config.textClass}`}>{issue.description}</p>
                    {issue.guidelineRef && (
                      <p className={`text-[11px] ${config.labelClass} mt-0.5`}>{issue.guidelineRef}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rewrite suggestions */}
      {rewrites && rewrites.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6 md:p-8 space-y-4">
          <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Suggested Rewrites</h3>
          {rewrites.map((rewrite, index) => (
            <div key={index} className="space-y-2">
              <div className="px-4 py-3 bg-red-50 rounded-lg border border-red-100 dark:bg-red-950 dark:border-red-900">
                <p className="text-[11px] font-semibold text-red-500 uppercase tracking-wider mb-1">Original</p>
                <p className="text-[13px] text-red-700/80 dark:text-red-300/80 leading-relaxed">{rewrite.original}</p>
              </div>
              <div className="px-4 py-3 bg-green-50 rounded-lg border border-green-100 dark:bg-green-950 dark:border-green-900">
                <p className="text-[11px] font-semibold text-green-500 uppercase tracking-wider mb-1">Suggested Rewrite</p>
                <p className="text-[13px] text-green-700/80 dark:text-green-300/80 leading-relaxed">{rewrite.rewrite}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onGenerateRewrites && !rewrites?.length && (
          <button
            onClick={onGenerateRewrites}
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Generate Compliant Rewrites
          </button>
        )}
        <button
          onClick={onNewCheck}
          className="flex-1 h-12 text-[14px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 dark:text-gray-300 dark:hover:text-white dark:border-gray-600"
        >
          Back to New Check
        </button>
      </div>

      {/* Subtle disclaimer — shown at the bottom of every result */}
      <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed text-center mt-6">
        Practitioners are solely responsible for ensuring their social media activities and advertising complies with the National Law and AHPRA guidelines.
      </p>
=======
import React, { useState, useCallback } from 'react';
import {
  CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp,
  Sparkles, Copy, Check, ArrowLeft, Loader2, Shield, ExternalLink,
  AlertCircle, Info
} from 'lucide-react';

// ─── Types (mirror your existing types) ──────────────────────────────────────
interface ComplianceIssue {
  guidelineReference: string;
  finding: string;
  severity: 'Critical' | 'Warning' | 'critical' | 'warning';
  recommendation: string;
}

interface RewrittenPost {
  optionTitle: string;
  content: string;
  explanation: string;
}

interface AnalysisResult {
  overall_status: 'compliant' | 'non_compliant' | 'warning';
  summary: string;
  overallVerdict?: string;
  issues: ComplianceIssue[];
}

interface ComplianceResultsProps {
  result: AnalysisResult;
  originalContent: string;
  onNewCheck: () => void;
  onGenerateRewrites: (content: string, issues: ComplianceIssue[]) => Promise<RewrittenPost[]>;
}

// ─── Severity helpers ─────────────────────────────────────────────────────────
const isCritical = (s: string) => s?.toLowerCase() === 'critical';

const severityConfig = {
  critical: {
    badge: 'bg-red-100 text-red-700 border border-red-200',
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: 'Critical',
    cardBorder: 'border-l-red-400',
    dot: 'bg-red-400',
  },
  warning: {
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: 'Warning',
    cardBorder: 'border-l-amber-400',
    dot: 'bg-amber-400',
  },
};

const verdictConfig = {
  compliant: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    label: 'Compliant',
    labelColor: 'text-emerald-700',
    tagColor: 'text-emerald-500',
    summaryColor: 'text-emerald-800/75',
    headerColor: 'text-emerald-600',
  },
  non_compliant: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconBg: 'bg-red-100',
    icon: <XCircle className="w-6 h-6 text-red-600" />,
    label: 'Non-Compliant',
    labelColor: 'text-red-700',
    tagColor: 'text-red-500',
    summaryColor: 'text-red-800/75',
    headerColor: 'text-red-600',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
    label: 'Requires Review',
    labelColor: 'text-amber-700',
    tagColor: 'text-amber-500',
    summaryColor: 'text-amber-800/75',
    headerColor: 'text-amber-600',
  },
};

// ─── Issue Card ───────────────────────────────────────────────────────────────
const IssueCard: React.FC<{ issue: ComplianceIssue; defaultOpen: boolean; index: number }> = ({
  issue, defaultOpen, index
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const sev = isCritical(issue.severity) ? 'critical' : 'warning';
  const cfg = severityConfig[sev];

  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-100 border-l-4 ${cfg.cardBorder}
        shadow-sm shadow-black/[0.03] overflow-hidden
        transition-all duration-200
      `}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50/60 transition-colors duration-150 group"
      >
        {/* Severity badge */}
        <span className={`
          inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider
          flex-shrink-0 mt-0.5 ${cfg.badge}
        `}>
          {cfg.icon}
          {cfg.label}
        </span>

        {/* Finding preview */}
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-semibold text-gray-800 leading-snug ${open ? '' : 'line-clamp-2'}`}>
            {issue.finding}
          </p>
          {!open && issue.guidelineReference && (
            <p className="text-[11px] text-gray-400 mt-1 font-mono">
              {issue.guidelineReference}
            </p>
          )}
        </div>

        {/* Chevron */}
        <div className="flex-shrink-0 mt-0.5 text-gray-300 group-hover:text-gray-500 transition-colors">
          {open
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />
          }
        </div>
      </button>

      {/* Expanded body */}
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-50">
          {/* Guideline reference */}
          {issue.guidelineReference && (
            <div className="pt-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                <Info className="w-3 h-3" />
                Guideline Reference
              </span>
              <p className="text-[12px] text-gray-500 font-mono mt-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                {issue.guidelineReference}
              </p>
            </div>
          )}

          {/* Recommended action */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-blue-500">
              <Shield className="w-3 h-3" />
              Recommended Action
            </span>
            <p className="text-[13px] text-gray-600 leading-relaxed mt-1.5">
              {issue.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Rewrite Option Card ──────────────────────────────────────────────────────
const RewriteCard: React.FC<{ rewrite: RewrittenPost; index: number }> = ({ rewrite, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(rewrite.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [rewrite.content]);

  const optionColors = [
    { bg: 'bg-blue-50', border: 'border-blue-200', tag: 'text-blue-700 bg-blue-100', num: 'text-blue-700' },
    { bg: 'bg-violet-50', border: 'border-violet-200', tag: 'text-violet-700 bg-violet-100', num: 'text-violet-700' },
    { bg: 'bg-teal-50', border: 'border-teal-200', tag: 'text-teal-700 bg-teal-100', num: 'text-teal-700' },
  ];
  const color = optionColors[index % 3];

  return (
    <div className={`rounded-xl border ${color.border} ${color.bg} overflow-hidden`}>
      {/* Option header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06]">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${color.tag}`}>
            Option {index + 1}
          </span>
          <span className="text-[13px] font-semibold text-gray-800">{rewrite.optionTitle}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-gray-500 hover:text-gray-800 hover:bg-white/80 transition-all duration-150"
        >
          {copied
            ? <><Check className="w-3.5 h-3.5 text-green-500" /><span className="text-green-600">Copied</span></>
            : <><Copy className="w-3.5 h-3.5" />Copy</>
          }
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="bg-white/80 rounded-lg p-3.5 border border-white text-[13px] text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
          {rewrite.content}
        </div>

        {/* Explanation */}
        {rewrite.explanation && (
          <div className="flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-gray-500 leading-relaxed">{rewrite.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Legal Disclaimer ─────────────────────────────────────────────────────────
const LegalDisclaimer: React.FC<{ prominent?: boolean }> = ({ prominent = false }) => {
  if (prominent) {
    return (
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] font-semibold text-amber-800 mb-1">Legal Disclaimer</p>
          <p className="text-[12px] text-amber-700 leading-relaxed">
            These rewrite suggestions are AI-generated guidance only and do not constitute legal advice.
            SafePost™ cannot guarantee that any rewritten content is fully compliant with the National Law
            or AHPRA guidelines. Registered health practitioners remain solely responsible for ensuring
            their advertising complies with all applicable laws. If in doubt, seek independent legal advice
            before publishing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 pt-2">
      <Shield className="w-3 h-3 text-gray-300 flex-shrink-0 mt-0.5" />
      <p className="text-[11px] text-gray-400 leading-relaxed">
        SafePost™ provides AI-powered guidance only and does not constitute legal advice. Practitioners
        are solely responsible for ensuring their advertising complies with the National Law and AHPRA
        guidelines.{' '}
        <a
          href="https://www.ahpra.gov.au/Resources/Advertising-hub.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-500 inline-flex items-center gap-0.5"
        >
          AHPRA Advertising Hub <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </p>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const ComplianceResults: React.FC<ComplianceResultsProps> = ({
  result,
  originalContent,
  onNewCheck,
  onGenerateRewrites,
}) => {
  const [rewrites, setRewrites] = useState<RewrittenPost[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rewriteError, setRewriteError] = useState<string | null>(null);

  const verdict = verdictConfig[result.overall_status] ?? verdictConfig.warning;
  const hasIssues = result.issues.length > 0;

  // Sort: Critical first, then Warning
  const sortedIssues = [...result.issues].sort((a, b) => {
    const aC = isCritical(a.severity) ? 0 : 1;
    const bC = isCritical(b.severity) ? 0 : 1;
    return aC - bC;
  });

  const criticalCount = sortedIssues.filter(i => isCritical(i.severity)).length;
  const warningCount = sortedIssues.length - criticalCount;

  const handleGenerateRewrites = async () => {
    setIsGenerating(true);
    setRewriteError(null);
    try {
      const results = await onGenerateRewrites(originalContent, result.issues);
      setRewrites(results);
    } catch {
      setRewriteError('Failed to generate rewrites. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* ── Original Post — shown first so user sees what was assessed ─────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm shadow-black/[0.02] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50/80">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Content Assessed
          </span>
        </div>
        <p className="px-4 py-3.5 text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap">
          {originalContent}
        </p>
      </div>

      {/* ── Verdict Card ──────────────────────────────────────────────────── */}
      <div className={`rounded-2xl border ${verdict.bg} ${verdict.border} p-6`}>

        {/* Verdict header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${verdict.iconBg}`}>
            {verdict.icon}
          </div>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-[0.12em] ${verdict.tagColor}`}>
              Verdict
            </p>
            <h3 className={`text-xl font-extrabold tracking-tight ${verdict.labelColor}`}>
              {verdict.label}
            </h3>
          </div>

          {/* Issue count pills */}
          {hasIssues && (
            <div className="ml-auto flex items-center gap-2">
              {criticalCount > 0 && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-[11px] font-bold border border-red-200">
                  <XCircle className="w-3 h-3" />
                  {criticalCount} Critical
                </span>
              )}
              {warningCount > 0 && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-600 rounded-full text-[11px] font-bold border border-amber-200">
                  <AlertTriangle className="w-3 h-3" />
                  {warningCount} Warning
                </span>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <p className={`text-[14px] leading-relaxed ${verdict.summaryColor}`}>
          {result.summary}
        </p>
      </div>

      {/* ── Issue Cards ───────────────────────────────────────────────────── */}
      {hasIssues && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
              Identified Issues
            </h4>
            <span className="text-[11px] font-bold text-gray-300">
              ({sortedIssues.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {sortedIssues.map((issue, i) => (
              <IssueCard
                key={i}
                issue={issue}
                defaultOpen={isCritical(issue.severity) && i === 0}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Rewrite Section ───────────────────────────────────────────────── */}
      {hasIssues && !rewrites && (
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <p className="text-[14px] font-semibold">Want to fix these issues automatically?</p>
          </div>
          <p className="text-[13px] text-gray-400 max-w-sm mx-auto">
            SafePost™ will generate 3 compliant rewrite options based on the issues identified above.
          </p>
          <button
            onClick={handleGenerateRewrites}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-[13px] font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition-all duration-200 active:scale-[0.98]"
          >
            {isGenerating
              ? <><Loader2 className="w-4 h-4 animate-spin" />Generating Rewrites...</>
              : <><Sparkles className="w-4 h-4" />Generate Compliant Rewrites</>
            }
          </button>
          {rewriteError && (
            <p className="text-[12px] text-red-500">{rewriteError}</p>
          )}
        </div>
      )}

      {/* ── Rewrite Results ───────────────────────────────────────────────── */}
      {rewrites && rewrites.length > 0 && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
              Compliant Rewrite Options
            </h4>
          </div>

          {/* Legal disclaimer — prominent above rewrites */}
          <LegalDisclaimer prominent />

          {/* Original post — for comparison */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 bg-gray-100/60">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Your Original Post
              </span>
            </div>
            <p className="px-4 py-3.5 text-[13px] text-gray-500 leading-relaxed whitespace-pre-wrap line-through decoration-gray-300">
              {originalContent}
            </p>
          </div>

          {/* Rewrite cards */}
          <div className="space-y-3">
            {rewrites.map((rewrite, i) => (
              <RewriteCard key={i} rewrite={rewrite} index={i} />
            ))}
          </div>

          {/* Regenerate option */}
          <div className="text-center">
            <button
              onClick={handleGenerateRewrites}
              disabled={isGenerating}
              className="text-[12px] text-gray-400 hover:text-blue-500 transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              {isGenerating ? 'Regenerating...' : 'Generate different options'}
            </button>
          </div>
        </div>
      )}

      {/* ── Action Buttons ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onNewCheck}
          className="flex-1 h-11 text-[13px] font-semibold text-gray-600 hover:text-gray-900 rounded-xl border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          New Check
        </button>
      </div>

      {/* ── Legal Disclaimer — bottom of every result ─────────────────────── */}
      <LegalDisclaimer />

>>>>>>> main
    </div>
  );
};

export default ComplianceResults;
