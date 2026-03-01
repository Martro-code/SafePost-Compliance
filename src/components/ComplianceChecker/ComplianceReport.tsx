import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Copy,
  BookOpen,
  Lightbulb,
  Check,
} from 'lucide-react';
// Local types matching the actual data shape from useComplianceChecker
interface ComplianceIssue {
  guidelineReference: string;
  finding: string;
  severity: 'Critical' | 'Warning' | 'critical' | 'warning' | 'info';
  recommendation: string;
  category?: string;
  subcategory?: string;
  plain_english_summary?: string;
  excerpt?: string;
  explanation?: string;
  source_document?: string;
  section_reference?: string;
  rule_text?: string;
  recommended_action?: string;
}

interface ComplianceResult {
  overall_status?: string;
  status?: string;
  compliance_score?: number;
  summary: string;
  overallVerdict?: string;
  issues: ComplianceIssue[];
  compliant_elements?: string[];
  revised_content_suggestion?: string;
  checked_at?: string;
}

interface ComplianceReportProps {
  result: ComplianceResult;
  savedCheckId?: string | null;
  onReset: () => void;
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    compliant: {
      icon: CheckCircle,
      label: 'Compliant',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      iconColor: 'text-green-500',
    },
    non_compliant: {
      icon: XCircle,
      label: 'Non-Compliant',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      iconColor: 'text-red-500',
    },
    requires_review: {
      icon: AlertTriangle,
      label: 'Requires Review',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      iconColor: 'text-amber-500',
    },
    warning: {
      icon: AlertTriangle,
      label: 'Requires Review',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      iconColor: 'text-amber-500',
    },
  }[status] ?? {
    icon: AlertTriangle,
    label: 'Unknown',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-700',
    iconColor: 'text-gray-500',
  };

  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.bg} ${config.border}`}
    >
      <Icon className={`w-5 h-5 ${config.iconColor}`} />
      <span className={`font-semibold text-sm ${config.text}`}>{config.label}</span>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 36;
  const progress = circumference - (score / 100) * circumference;
  const color =
    score >= 85 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{score}</span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

function IssueSeverityIcon({ severity }: { severity: ComplianceIssue['severity'] }) {
  const sev = severity?.toLowerCase();
  if (sev === 'critical')
    return <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
  if (sev === 'warning')
    return <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
  return <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;
}

function IssueCard({ issue, index }: { issue: ComplianceIssue; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  const severityMap: Record<string, { bg: string; border: string; badge: string }> = {
    critical: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-700',
    },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
  };
  const severityConfig = severityMap[issue.severity?.toLowerCase()] ?? severityMap.warning;

  return (
    <div className={`border rounded-xl overflow-hidden ${severityConfig.border}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full text-left flex items-start gap-3 p-4 ${severityConfig.bg} hover:brightness-95 transition-all`}
      >
        <IssueSeverityIcon severity={issue.severity} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${severityConfig.badge}`}
            >
              {issue.severity}
            </span>
            <span className="text-xs text-gray-500">{issue.category}</span>
            {issue.subcategory && (
              <>
                <span className="text-xs text-gray-400">›</span>
                <span className="text-xs text-gray-500">{issue.subcategory}</span>
              </>
            )}
          </div>
          <p className="text-sm font-medium text-gray-900">{issue.plain_english_summary || issue.finding}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
        )}
      </button>

      {expanded && (
        <div className="bg-white px-4 pb-4 space-y-4 pt-3">
          {issue.excerpt && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Flagged Content
              </p>
              <blockquote className="border-l-4 border-gray-300 pl-3 py-1 bg-gray-50 rounded-r-lg">
                <p className="text-sm text-gray-700 italic">"{issue.excerpt}"</p>
              </blockquote>
            </div>
          )}

          {(issue.explanation || issue.finding) && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Why This Is an Issue
              </p>
              <p className="text-sm text-gray-700">{issue.explanation || issue.finding}</p>
            </div>
          )}

          {(issue.source_document || issue.guidelineReference) && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Applicable Rule
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">
                  {issue.source_document && issue.section_reference
                    ? `${issue.source_document} · ${issue.section_reference}`
                    : issue.guidelineReference}
                </p>
                {issue.rule_text && <p className="text-sm text-gray-800">{issue.rule_text}</p>}
              </div>
            </div>
          )}

          <div className="flex gap-2 bg-blue-50 rounded-lg p-3">
            <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-0.5">Recommended Action</p>
              <p className="text-sm text-blue-800">{issue.recommended_action || issue.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ComplianceReport({ result, savedCheckId, onReset }: ComplianceReportProps) {
  const [copied, setCopied] = useState(false);

  const criticalCount = result.issues.filter((i) => i.severity?.toLowerCase() === 'critical').length;
  const warningCount = result.issues.filter((i) => i.severity?.toLowerCase() === 'warning').length;
  const infoCount = result.issues.filter((i) => i.severity?.toLowerCase() === 'info').length;

  const copyRevision = () => {
    if (result.revised_content_suggestion) {
      navigator.clipboard.writeText(result.revised_content_suggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Score card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <ScoreRing score={result.compliance_score ?? 0} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <StatusBadge status={result.overall_status ?? result.status ?? 'warning'} />
              {savedCheckId && (
                <span className="text-xs text-gray-400">Saved · ID {savedCheckId.slice(0, 8)}</span>
              )}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-700">{criticalCount}</span>
                <span className="text-sm text-gray-500">Critical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-700">{warningCount}</span>
                <span className="text-sm text-gray-500">Warnings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-blue-700">{infoCount}</span>
                <span className="text-sm text-gray-500">Info</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issues */}
      {result.issues.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Issues Found ({result.issues.length})
          </h3>
          <div className="space-y-3">
            {[...result.issues]
              .sort((a, b) => {
                const order: Record<string, number> = { critical: 0, warning: 1, info: 2 };
                return (order[a.severity?.toLowerCase()] ?? 2) - (order[b.severity?.toLowerCase()] ?? 2);
              })
              .map((issue, i) => (
                <React.Fragment key={i}>
                  <IssueCard issue={issue} index={i} />
                </React.Fragment>
              ))}
          </div>
        </div>
      )}

      {/* Compliant elements */}
      {(result.compliant_elements ?? []).length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-sm font-semibold text-green-800">
              Compliant Elements ({(result.compliant_elements ?? []).length})
            </h3>
          </div>
          <ul className="space-y-1.5">
            {(result.compliant_elements ?? []).map((el, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">{el}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Revised suggestion */}
      {result.revised_content_suggestion && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-800">Suggested Revision</h3>
            </div>
            <button
              onClick={copyRevision}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
              {result.revised_content_suggestion}
            </pre>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            ⚠️ This is an AI-generated suggestion. Review with your compliance team before
            publishing.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-gray-400">
          Checked {new Date(result.checked_at ?? Date.now()).toLocaleString('en-AU')}
        </p>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Check New Content
        </button>
      </div>
    </div>
  );
}