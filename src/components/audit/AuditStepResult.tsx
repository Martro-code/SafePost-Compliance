import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, ChevronRight, MinusCircle } from 'lucide-react';
import { AuditStepResult as AuditStepResultType } from '../../types/audit';

interface AuditStepResultProps {
  result: AuditStepResultType;
  onNext: () => void;
  isLastStep: boolean;
}

const severityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

const AuditStepResult: React.FC<AuditStepResultProps> = ({ result, onNext, isLastStep }) => {
  const sortedIssues = [...result.issues].sort(
    (a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3)
  );

  const isSkipped = result.complianceStatus === 'skipped';

  const statusConfig = {
    pass: {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      label: 'Compliant',
      containerClass: 'bg-green-50 border-green-200',
      labelClass: 'text-green-800',
      summaryClass: 'text-green-700',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      label: 'Warnings Found',
      containerClass: 'bg-amber-50 border-amber-200',
      labelClass: 'text-amber-800',
      summaryClass: 'text-amber-700',
    },
    fail: {
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      label: 'Issues Found',
      containerClass: 'bg-red-50 border-red-200',
      labelClass: 'text-red-800',
      summaryClass: 'text-red-700',
    },
    skipped: {
      icon: <MinusCircle className="w-5 h-5 text-gray-400" />,
      label: 'Not Analysed',
      containerClass: 'bg-slate-50 border-slate-200',
      labelClass: 'text-slate-600',
      summaryClass: 'text-slate-500',
    },
  };

  const config = statusConfig[result.complianceStatus] ?? statusConfig.fail;

  return (
    <div className="flex flex-col gap-6">
      {/* Status header */}
      <div className={`flex items-start gap-4 p-5 rounded-xl border ${config.containerClass}`}>
        <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-semibold mb-1 ${config.labelClass}`}>{config.label}</p>
          <p className={`text-[13px] ${config.summaryClass}`}>{result.summary}</p>
          {result.url && !isSkipped && (
            <p className="text-[11px] text-gray-400 mt-1.5 break-all">{result.url}</p>
          )}
        </div>
      </div>

      {/* Issues list (only for non-skipped) */}
      {!isSkipped && (
        sortedIssues.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-[13px] font-semibold text-gray-700">
              {sortedIssues.length} {sortedIssues.length === 1 ? 'issue' : 'issues'} identified
            </p>
            {sortedIssues.map((issue, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    issue.severity === 'high'
                      ? 'bg-red-100 text-red-700'
                      : issue.severity === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)} severity
                  </span>
                </div>
                <p className="text-[13px] text-gray-800 mb-2">{issue.description}</p>
                <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-blue-800">{issue.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-[13px] text-green-700">No issues found on this page.</p>
          </div>
        )
      )}

      {/* Next button */}
      <button
        onClick={onNext}
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-xl transition-colors duration-200"
      >
        {isLastStep ? 'View Full Report' : 'Next Page →'}
      </button>
    </div>
  );
};

export default AuditStepResult;
