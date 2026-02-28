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
    </div>
  );
};

export default ComplianceResults;
