import React, { useState, useCallback } from 'react';
import {
  CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp,
  Sparkles, Copy, Check, ArrowLeft, Loader2, Shield, ExternalLink,
  AlertCircle, Info, FileText, Lock
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
  planName?: string;
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
  planName = '',
}) => {
  const [rewrites, setRewrites] = useState<RewrittenPost[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rewriteError, setRewriteError] = useState<string | null>(null);
  const [pdfExporting, setPdfExporting] = useState(false);
  const [showPdfToast, setShowPdfToast] = useState(false);
  const [showPdfTooltip, setShowPdfTooltip] = useState(false);

  const isUltra = planName.toLowerCase() === 'ultra';

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

  const handleExportPdf = () => {
    if (!isUltra) return;
    setPdfExporting(true);
    setTimeout(() => {
      setPdfExporting(false);
      setShowPdfToast(true);
      setTimeout(() => setShowPdfToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-4">

      {/* ── PDF Toast ──────────────────────────────────────────────────────── */}
      {showPdfToast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-gray-900 text-white text-[13px] font-medium rounded-xl shadow-lg shadow-black/20 animate-fade-in">
          Coming soon — this feature is in development
        </div>
      )}

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
      <div className="flex flex-col items-center pt-2">
        <button
          onClick={onNewCheck}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          New Check
        </button>
        {/* Export PDF — secondary text link */}
        <div className="relative mt-2">
          <button
            onClick={handleExportPdf}
            onMouseEnter={() => !isUltra && setShowPdfTooltip(true)}
            onMouseLeave={() => setShowPdfTooltip(false)}
            disabled={pdfExporting}
            className={`text-[12px] inline-flex items-center gap-1.5 transition-colors duration-200 ${
              pdfExporting
                ? 'text-gray-400'
                : isUltra
                  ? 'text-gray-400 hover:text-gray-600'
                  : 'text-gray-400 hover:text-gray-600 cursor-not-allowed'
            }`}
          >
            {pdfExporting ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating PDF...</>
            ) : (
              <>
                {!isUltra && <Lock className="w-3 h-3" />}
                <FileText className="w-3.5 h-3.5" />
                Export PDF
              </>
            )}
          </button>
          {showPdfTooltip && !isUltra && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-[12px] rounded-lg whitespace-nowrap shadow-lg z-10">
              PDF export is available on SafePost™ Ultra
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
          )}
        </div>
      </div>

      {/* ── Legal Disclaimer — bottom of every result ─────────────────────── */}
      <LegalDisclaimer />

    </div>
  );
};

export default ComplianceResults;
