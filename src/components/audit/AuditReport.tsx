import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Download, CheckCircle, AlertTriangle, XCircle, MinusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useAccount } from '../../context/AccountContext';
import { AuditSession, AuditStep } from '../../types/audit';
import LoggedInLayout from '../layout/LoggedInLayout';

// ── HTML report generation ────────────────────────────────────────────────────

function generateHtml(session: AuditSession, practiceName: string): string {
  const analysedSteps = session.steps.filter(
    (s) => s.status === 'complete' && s.result && s.result.complianceStatus !== 'skipped'
  );
  const passCount   = analysedSteps.filter((s) => s.result?.complianceStatus === 'pass').length;
  const warnCount   = analysedSteps.filter((s) => s.result?.complianceStatus === 'warning').length;
  const failCount   = analysedSteps.filter((s) => s.result?.complianceStatus === 'fail').length;
  const score = analysedSteps.length > 0
    ? Math.round(((passCount + warnCount * 0.5) / analysedSteps.length) * 100)
    : 0;

  const auditDate = new Date(session.updated_at || session.created_at).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // ── Per-page HTML blocks ──────────────────────────────────────────────────

  const pageBlocks = session.steps
    .filter((s) => s.status === 'complete' && s.result)
    .map((step) => {
      const result = step.result!;
      const isSkipped = result.complianceStatus === 'skipped';

      if (isSkipped) {
        return `
    <div class="page-block">
      <div class="page-name">${escHtml(step.name)}</div>
      <span class="status-badge status-skipped">Not Analysed</span>
      <div class="page-summary">This page was skipped and not analysed.</div>
    </div>`;
      }

      const badgeClass =
        result.complianceStatus === 'pass'    ? 'status-compliant' :
        result.complianceStatus === 'warning' ? 'status-warning'   : 'status-issues';
      const badgeLabel =
        result.complianceStatus === 'pass'    ? 'Compliant'       :
        result.complianceStatus === 'warning' ? 'Warnings Found'  : 'Issues Found';

      const findingsHtml = result.issues.map((issue) => {
        const sev = issue.severity;
        return `
      <div class="finding finding-${sev}">
        <div class="finding-severity severity-${sev}">${sev.toUpperCase()}</div>
        <div class="finding-description">${escHtml(issue.description)}</div>
        <div class="finding-recommendation">
          <strong>Recommendation</strong>
          ${escHtml(issue.recommendation)}
        </div>
      </div>`;
      }).join('');

      return `
    <div class="page-block">
      <div class="page-name">${escHtml(step.name)}</div>
      ${result.url ? `<div class="page-url">${escHtml(result.url)}</div>` : ''}
      <span class="status-badge ${badgeClass}">${badgeLabel}</span>
      <div class="page-summary">${escHtml(result.summary)}</div>
      ${findingsHtml}
    </div>`;
    })
    .join('');

  // ── Full HTML document ────────────────────────────────────────────────────

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SafePost Website Compliance Audit Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; font-size: 15px; line-height: 1.7; color: #1a1a2e; background: #ffffff; }
    .header { background: #0f172a; padding: 28px 48px; display: flex; align-items: center; gap: 16px; }
    .header-logo-mark { display: flex; flex-direction: column; gap: 4px; }
    .header-logo-mark span { display: block; background: #3b82f6; border-radius: 3px; }
    .header-logo-mark span:nth-child(1) { width: 28px; height: 6px; }
    .header-logo-mark span:nth-child(2) { width: 18px; height: 6px; }
    .header-logo-mark span:nth-child(3) { width: 10px; height: 6px; }
    .header-brand { font-family: 'Arial', sans-serif; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .header-tag { font-family: 'Arial', sans-serif; font-size: 11px; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; margin-left: auto; }
    .page { max-width: 860px; margin: 0 auto; padding: 48px 48px 80px; }
    .report-title-block { border-bottom: 2px solid #e2e8f0; padding-bottom: 32px; margin-bottom: 36px; }
    .report-label { font-family: 'Arial', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
    .report-title { font-size: 32px; font-weight: bold; color: #0f172a; margin-bottom: 8px; }
    .report-meta { font-family: 'Arial', sans-serif; font-size: 13px; color: #64748b; }
    .score-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px 36px; margin-bottom: 48px; }
    .score-heading { font-family: 'Arial', sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 8px; }
    .score-value { font-size: 48px; font-weight: bold; color: #0f172a; line-height: 1; margin-bottom: 24px; }
    .score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .score-stat { text-align: center; padding: 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; }
    .score-stat-value { font-family: 'Arial', sans-serif; font-size: 22px; font-weight: bold; color: #0f172a; }
    .score-stat-label { font-family: 'Arial', sans-serif; font-size: 11px; color: #64748b; margin-top: 2px; }
    .section-heading { font-size: 22px; font-weight: bold; color: #0f172a; margin-bottom: 28px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
    .page-block { margin-bottom: 48px; padding-bottom: 48px; border-bottom: 1px solid #f1f5f9; }
    .page-block:last-of-type { border-bottom: none; }
    .page-name { font-size: 20px; font-weight: bold; color: #0f172a; margin-bottom: 4px; }
    .page-url { font-family: 'Arial', sans-serif; font-size: 12px; color: #94a3b8; margin-bottom: 12px; }
    .status-badge { display: inline-block; font-family: 'Arial', sans-serif; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px; }
    .status-compliant { background: #dcfce7; color: #166534; }
    .status-warning { background: #fef9c3; color: #854d0e; }
    .status-issues { background: #fee2e2; color: #991b1b; }
    .status-skipped { background: #f1f5f9; color: #64748b; }
    .page-summary { color: #374151; margin-bottom: 20px; font-size: 14px; }
    .finding { border-left: 4px solid #e2e8f0; padding: 16px 20px; margin-bottom: 16px; background: #f8fafc; border-radius: 0 8px 8px 0; }
    .finding-high { border-left-color: #ef4444; }
    .finding-medium { border-left-color: #f59e0b; }
    .finding-low { border-left-color: #3b82f6; }
    .finding-severity { font-family: 'Arial', sans-serif; font-size: 10px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
    .severity-high { color: #ef4444; }
    .severity-medium { color: #f59e0b; }
    .severity-low { color: #3b82f6; }
    .finding-description { font-size: 14px; color: #1e293b; margin-bottom: 10px; }
    .finding-recommendation { font-size: 13px; color: #475569; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 14px; }
    .finding-recommendation strong { display: block; font-family: 'Arial', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 4px; }
    .disclaimer { margin-top: 64px; padding: 24px 28px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-family: 'Arial', sans-serif; font-size: 12px; color: #64748b; line-height: 1.6; }
    .disclaimer strong { display: block; margin-bottom: 6px; color: #374151; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; font-family: 'Arial', sans-serif; font-size: 11px; color: #94a3b8; text-align: center; }
    @media print {
      body { font-size: 13px; }
      .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .score-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .finding { -webkit-print-color-adjust: exact; print-color-adjust: exact; break-inside: avoid; }
      .page-block { break-inside: avoid; }
      .status-badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="header-logo-mark">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="header-brand">SafePost&#8482;</div>
    <div class="header-tag">Website Compliance Audit</div>
  </div>

  <div class="page">

    <div class="report-title-block">
      <div class="report-label">Compliance Audit Report</div>
      <div class="report-title">${escHtml(practiceName || 'Your Practice')}</div>
      <div class="report-meta">Audit completed: ${escHtml(auditDate)}</div>
    </div>

    <div class="score-card">
      <div class="score-heading">Overall Compliance Score</div>
      <div class="score-value">${score}%</div>
      <div class="score-grid">
        <div class="score-stat">
          <div class="score-stat-value">${analysedSteps.length}</div>
          <div class="score-stat-label">Pages Analysed</div>
        </div>
        <div class="score-stat">
          <div class="score-stat-value">${passCount}</div>
          <div class="score-stat-label">Compliant</div>
        </div>
        <div class="score-stat">
          <div class="score-stat-value">${warnCount}</div>
          <div class="score-stat-label">Warnings</div>
        </div>
        <div class="score-stat">
          <div class="score-stat-value">${failCount}</div>
          <div class="score-stat-label">Issues Found</div>
        </div>
      </div>
    </div>

    <div class="section-heading">Page-by-Page Findings</div>

    ${pageBlocks}

    <div class="disclaimer">
      <strong>Important Disclaimer</strong>
      This report has been generated by SafePost using AI-powered analysis of publicly available website content. It is intended as a general compliance screening tool only and does not constitute legal advice. AHPRA and TGA advertising regulations are complex and subject to change. SafePost accepts no liability for any decisions made based on this report. Practitioners should seek independent legal or compliance advice before making changes to their advertising materials. For the most current AHPRA advertising guidelines, visit www.ahpra.gov.au.
    </div>

    <div class="footer">
      Generated by SafePost &#8212; AI-powered AHPRA and TGA compliance for Australian medical practitioners &nbsp;&middot;&nbsp; www.safepost.com.au
    </div>

  </div>

</body>
</html>`;
}

/** Escape text for safe insertion into HTML. */
function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Status icon helper ────────────────────────────────────────────────────────

const StatusIcon: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const cls = className ?? 'w-4 h-4';
  if (status === 'pass') return <CheckCircle className={`${cls} text-green-600`} />;
  if (status === 'warning') return <AlertTriangle className={`${cls} text-amber-600`} />;
  if (status === 'skipped') return <MinusCircle className={`${cls} text-gray-400`} />;
  return <XCircle className={`${cls} text-red-600`} />;
};

// ── Step accordion ────────────────────────────────────────────────────────────

const StepAccordion: React.FC<{ step: AuditStep }> = ({ step }) => {
  const [open, setOpen] = useState(false);
  if (!step.result) return null;

  const isSkipped = step.result.complianceStatus === 'skipped';
  const findingCount = step.result.issues.length;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <StatusIcon status={step.result.complianceStatus} />
          <div>
            <p className="text-[13px] font-semibold text-gray-900">{step.name}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isSkipped ? 'Not analysed' : `${findingCount} finding${findingCount !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-slate-100 p-4 bg-slate-50 flex flex-col gap-3">
          {isSkipped ? (
            <p className="text-[13px] text-gray-400 italic">This page was not analysed.</p>
          ) : (
            <>
              <p className="text-[13px] text-gray-600">{step.result.summary}</p>
              {step.result.url && (
                <p className="text-[11px] text-gray-400 break-all">{step.result.url}</p>
              )}
              {step.result.issues.length > 0 ? (
                step.result.issues.map((issue, idx) => (
                  <div key={idx} className="bg-white rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                        issue.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-800 mb-1.5">{issue.description}</p>
                    <p className="text-[12px] text-blue-700 bg-blue-50 rounded p-2">{issue.recommendation}</p>
                  </div>
                ))
              ) : (
                <p className="text-[12px] text-green-700">No issues found on this page.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ── Page component ────────────────────────────────────────────────────────────

const AuditReport: React.FC = () => {
  const navigate = useNavigate();
  const { accountId, practiceName, accountLoading } = useAccount();
  const [session, setSession] = useState<AuditSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const loadSession = useCallback(async () => {
    if (!accountId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('audit_sessions')
      .select('*')
      .eq('account_id', accountId)
      .eq('status', 'complete')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) console.error('Failed to load audit report:', error);
    setSession(data as AuditSession | null);
    setLoading(false);
  }, [accountId]);

  useEffect(() => {
    if (!accountLoading && accountId) {
      loadSession();
    }
  }, [accountLoading, accountId, loadSession]);

  const handleDownloadHtml = () => {
    if (!session) return;
    setDownloadLoading(true);
    try {
      const htmlContent = generateHtml(session, practiceName);
      const d = new Date(session.updated_at || session.created_at);
      const day = String(d.getDate()).padStart(2, '0');
      const month = d.toLocaleDateString('en-AU', { month: 'long' });
      const year = d.getFullYear();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SafePost-Audit-${day}-${month}-${year}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('HTML report generation failed:', err);
    } finally {
      setDownloadLoading(false);
    }
  };

  if (accountLoading || loading) {
    return (
      <LoggedInLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </LoggedInLayout>
    );
  }

  if (!session) {
    return (
      <LoggedInLayout>
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h2 className="text-[20px] font-semibold text-gray-900 mb-3">No completed audit found</h2>
          <p className="text-[14px] text-gray-500 mb-6">
            Complete your website audit to generate the compliance report.
          </p>
          <button
            onClick={() => navigate('/audit')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-xl transition-colors"
          >
            Go to Audit
          </button>
        </div>
      </LoggedInLayout>
    );
  }

  // Only count non-skipped steps for the score
  const analysedSteps = session.steps.filter((s) => s.status === 'complete' && s.result && s.result.complianceStatus !== 'skipped');
  const passCount = analysedSteps.filter((s) => s.result?.complianceStatus === 'pass').length;
  const warnCount = analysedSteps.filter((s) => s.result?.complianceStatus === 'warning').length;
  const failCount = analysedSteps.filter((s) => s.result?.complianceStatus === 'fail').length;
  const totalIssues = analysedSteps.reduce((acc, s) => acc + (s.result?.issues.length ?? 0), 0);
  const skippedCount = session.steps.filter((s) => s.result?.complianceStatus === 'skipped').length;
  const score = analysedSteps.length > 0
    ? Math.round(((passCount + warnCount * 0.5) / analysedSteps.length) * 100)
    : 0;

  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
  const scoreBarColor = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <LoggedInLayout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-[24px] font-bold text-gray-900 mb-1">Audit Report</h1>
            <p className="text-[13px] text-gray-400">
              {new Date(session.updated_at || session.created_at).toLocaleDateString('en-AU', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
              {practiceName && ` — ${practiceName}`}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handleDownloadHtml}
                disabled={downloadLoading}
                className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60"
              >
                {downloadLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                Download Audit Report (HTML)
              </button>
              <p className="text-[11px] text-gray-400">Opens in any browser · Print to PDF with Ctrl+P</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={() => navigate('/audit')}
                className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Run New Audit — $149
              </button>
              <p className="text-[11px] text-gray-400">Each audit is a one-time purchase</p>
            </div>
          </div>
        </div>

        {/* Score summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6 mb-4 flex-wrap">
            <div>
              <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Overall Score</p>
              <p className={`text-[48px] font-bold leading-none ${scoreColor}`}>{score}%</p>
              {analysedSteps.length < session.steps.length && (
                <p className="text-[11px] text-gray-400 mt-1">Based on {analysedSteps.length} analysed page{analysedSteps.length !== 1 ? 's' : ''}</p>
              )}
            </div>
            <div className="flex-1 min-w-[160px]">
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreBarColor}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <div className="flex gap-4 text-[13px] flex-wrap">
                <span className="text-green-600 font-medium">{passCount} compliant</span>
                <span className="text-amber-600 font-medium">{warnCount} warnings</span>
                <span className="text-red-600 font-medium">{failCount} issues</span>
                {skippedCount > 0 && (
                  <span className="text-gray-400 font-medium">{skippedCount} skipped</span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-[22px] font-bold text-gray-900">{analysedSteps.length}</p>
              <p className="text-[11px] text-gray-400">Pages analysed</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-[22px] font-bold text-gray-900">{totalIssues}</p>
              <p className="text-[11px] text-gray-400">Total findings</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
              <p className="text-[22px] font-bold text-gray-900">
                {analysedSteps.reduce((acc, s) => acc + (s.result?.issues.filter((i) => i.severity === 'high').length ?? 0), 0)}
              </p>
              <p className="text-[11px] text-gray-400">High severity</p>
            </div>
          </div>
        </div>

        {/* Per-page breakdown */}
        <h2 className="text-[16px] font-semibold text-gray-900 mb-3">Page-by-Page Breakdown</h2>
        <div className="flex flex-col gap-3">
          {session.steps.map((step, idx) =>
            step.status === 'complete' ? <StepAccordion key={idx} step={step} /> : null
          )}
        </div>

        {/* Download CTA */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
          <p className="text-[14px] font-semibold text-blue-900 mb-1">Save a copy for your records</p>
          <p className="text-[13px] text-blue-600 mb-4">
            Download the full report as a self-contained HTML file. Open in any browser and print to PDF with Ctrl+P.
          </p>
          <button
            onClick={handleDownloadHtml}
            disabled={downloadLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {downloadLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Download Audit Report (HTML)
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-5 border border-slate-200 rounded-xl bg-slate-50">
          <p className="text-[12px] text-gray-500 leading-relaxed">
            This report has been generated by SafePost using AI-powered analysis of publicly available website content. It is intended as a general compliance screening tool only and does not constitute legal advice. AHPRA and TGA advertising regulations are complex and subject to change. SafePost accepts no liability for any decisions made based on this report. Practitioners should seek independent legal or compliance advice before making changes to their advertising materials.
          </p>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default AuditReport;
