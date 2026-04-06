import React, { useState } from 'react';
import { Loader2, Globe } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { AuditStepResult } from '../../types/audit';
import { ComplianceStatus } from '../../types';

interface AuditStepInputProps {
  stepName: string;
  stepIndex: number;
  initialUrl?: string;
  onStepComplete: (result: AuditStepResult) => void;
  onSkip: () => void;
}

function mapAnalysisToAuditResult(url: string, analysis: any): AuditStepResult {
  const status = analysis.status as ComplianceStatus;
  let complianceStatus: 'pass' | 'warning' | 'fail';
  if (status === ComplianceStatus.COMPLIANT) {
    complianceStatus = 'pass';
  } else if (status === ComplianceStatus.WARNING || status === ComplianceStatus.CONDUCT_RISK) {
    complianceStatus = 'warning';
  } else {
    complianceStatus = 'fail';
  }

  const issues = (analysis.issues ?? []).map((issue: any) => ({
    severity: issue.severity === 'Critical' ? 'high' : 'medium',
    description: issue.finding ?? issue.description ?? '',
    recommendation: issue.recommendation ?? '',
  }));

  return {
    url,
    complianceStatus,
    issues,
    summary: analysis.summary ?? analysis.overallVerdict ?? '',
  };
}

const AuditStepInput: React.FC<AuditStepInputProps> = ({
  stepName,
  stepIndex,
  initialUrl = '',
  onStepComplete,
  onSkip,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = loadingFetch || loadingAnalysis;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please enter a URL.');
      return;
    }

    try {
      const parsed = new URL(trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        setError('Please enter a valid http or https URL.');
        return;
      }
    } catch {
      setError('Please enter a valid URL (e.g. https://yourpractice.com.au/services).');
      return;
    }

    const normalizedUrl = trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;

    try {
      setLoadingFetch(true);
      const { data: fetchData, error: fetchError } = await supabase.functions.invoke('fetch-url-content', {
        body: { url: normalizedUrl },
      });
      setLoadingFetch(false);

      if (fetchError || !fetchData?.content) {
        const msg = fetchData?.error || fetchError?.message || 'Failed to fetch the page content.';
        setError(msg);
        return;
      }

      setLoadingAnalysis(true);
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-post', {
        body: {
          content: fetchData.content,
          isAuditCheck: true,
          pageContext: stepName,
        },
      });
      setLoadingAnalysis(false);

      if (analysisError || !analysisData?.analysis) {
        setError(analysisError?.message || 'Failed to analyse the page content.');
        return;
      }

      const result = mapAnalysisToAuditResult(normalizedUrl, analysisData.analysis);
      onStepComplete(result);

    } catch (err: any) {
      setLoadingFetch(false);
      setLoadingAnalysis(false);
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Step header */}
      <div>
        <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1">
          Step {stepIndex + 1}
        </p>
        <h3 className="text-[18px] font-semibold text-gray-900 mb-2">{stepName}</h3>
        <p className="text-[14px] text-gray-500 leading-relaxed">
          Analyse this page for AHPRA and TGA compliance issues.
        </p>
      </div>

      {/* URL input form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor={`step-url-${stepIndex}`} className="block text-[13px] font-medium text-gray-700 mb-1.5">
            Page URL
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              id={`step-url-${stepIndex}`}
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(null); }}
              placeholder="https://yourpractice.com.au/services"
              disabled={isLoading}
              className="w-full pl-9 pr-4 py-2.5 text-[14px] bg-white border border-slate-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            />
          </div>
          {error && (
            <p className="mt-2 text-[12px] text-red-600">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[14px] font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {loadingFetch ? 'Fetching page…' : 'Analysing content…'}
            </>
          ) : (
            'Analyse This Page'
          )}
        </button>
      </form>

      {/* Loading state detail */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-[13px] text-blue-700 font-medium mb-1">
            {loadingFetch ? 'Fetching page content…' : 'Running AHPRA/TGA compliance analysis…'}
          </p>
          <p className="text-[12px] text-blue-500">
            {loadingFetch
              ? 'Retrieving and extracting visible text from the page.'
              : 'Checking against 172 verified AHPRA and TGA rules. This may take 20–30 seconds.'}
          </p>
        </div>
      )}

      {/* Skip */}
      {!isLoading && (
        <div className="text-center">
          <button
            type="button"
            onClick={onSkip}
            className="text-[13px] text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
          >
            Skip this page
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditStepInput;
