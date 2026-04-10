import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Download, CheckCircle, AlertTriangle, XCircle, MinusCircle, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useAccount } from '../../context/AccountContext';
import { AuditSession, AuditStep } from '../../types/audit';
import LoggedInLayout from '../layout/LoggedInLayout';

// ── HTML report generation ────────────────────────────────────────────────────

async function generateHtml(session: AuditSession, practiceName: string): Promise<string> {
  const analysedSteps = session.steps.filter(
    (s) => s.status === 'complete' && s.result && s.result.complianceStatus !== 'skipped'
  );
  const passCount = analysedSteps.filter((s) => s.result?.complianceStatus === 'pass').length;
  const warnCount = analysedSteps.filter((s) => s.result?.complianceStatus === 'warning').length;
  const failCount = analysedSteps.filter((s) => s.result?.complianceStatus === 'fail').length;
  const score = analysedSteps.length > 0
    ? Math.round(((passCount + warnCount * 0.5) / analysedSteps.length) * 100)
    : 0;

  // Score colour: 0–25 red, 26–50 amber, 51–75 blue, 76–100 green
  const scoreColor =
    score <= 25 ? '#ef4444' :
    score <= 50 ? '#f59e0b' :
    score <= 75 ? '#3b82f6' :
                  '#22c55e';

  // Plain English interpretation
  const scoreInterpretation =
    score === 100 ? 'Your website appears compliant with AHPRA and TGA advertising standards based on the pages reviewed.' :
    score >= 76   ? 'Your website is largely compliant with a few minor issues to address.' :
    score >= 51   ? 'Your website is partially compliant but has areas that need improvement to meet AHPRA and TGA advertising standards.' :
    score >= 26   ? 'Your website has several compliance issues that should be addressed to reduce your risk of an AHPRA or TGA complaint.' :
                    'Your website has significant compliance issues that require urgent attention before they attract regulatory scrutiny.';

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
      <p style="font-size:14px;color:#64748b;margin-top:8px;">This page was skipped and not analysed.</p>
    </div>`;
      }

      const badgeClass =
        result.complianceStatus === 'pass'    ? 'status-compliant' :
        result.complianceStatus === 'warning' ? 'status-warning'   : 'status-issues';
      const badgeLabel =
        result.complianceStatus === 'pass'    ? 'Compliant'      :
        result.complianceStatus === 'warning' ? 'Warnings Found' : 'Issues Found';

      const findingsHtml = result.issues.map((issue) => {
        const sev = issue.severity;
        const sevClass =
          sev === 'high'   ? 'severity-high'   :
          sev === 'medium' ? 'severity-medium'  :
                             'severity-low';
        return `
      <div class="finding finding-${sev}">
        <span class="severity-badge ${sevClass}">${sev.toUpperCase()}</span>
        <div class="finding-description">${escHtml(issue.description)}</div>
        <div class="recommendation-box">
          <div class="recommendation-label">Recommendation</div>
          <div class="recommendation-text">${escHtml(issue.recommendation)}</div>
        </div>
      </div>`;
      }).join('');

      return `
    <div class="page-block">
      <div class="page-name">${escHtml(step.name)}</div>
      ${result.url ? `<div class="page-url">${escHtml(result.url)}</div>` : ''}
      <span class="status-badge ${badgeClass}">${badgeLabel}</span>
      <p style="font-size:14px;color:#374151;margin-bottom:20px;line-height:1.6;">${escHtml(result.summary)}</p>
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
    body { font-family: Georgia, serif; font-size: 14px; line-height: 1.7; color: #1a1a2e; background: #ffffff; }
    .page-content { max-width: 860px; margin: 0 auto; }

    /* PART 1 — Header */
    .header { background: #0f172a; padding: 0; }
    .header-inner { display: flex; align-items: center; justify-content: space-between; padding: 16px 40px; }
    .header-brand { display: flex; align-items: center; gap: 12px; }
    .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .header-label { font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #3b82f6; }
    .header-accent { height: 3px; background: #3b82f6; width: 100%; }

    /* PART 2 — Report title block */
    .report-title-block { padding: 36px 40px 28px; border-bottom: 1px solid #e2e8f0; }
    .report-label { font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; }
    .report-practice-name { font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 6px; line-height: 1.2; }
    .report-date { font-family: Arial, sans-serif; font-size: 13px; color: #64748b; }

    /* PART 3 — Score card */
    .score-card { margin: 28px 40px; border: 1px solid #e2e8f0; border-radius: 12px; border-left-width: 5px; padding: 28px 32px; background: #f8fafc; }
    .score-label { font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
    .score-value { font-size: 64px; font-weight: 800; line-height: 1; margin-bottom: 12px; }
    .score-progress-bar-track { height: 6px; background: #e2e8f0; border-radius: 3px; margin-bottom: 12px; overflow: hidden; }
    .score-progress-bar-fill { height: 100%; border-radius: 3px; }
    .score-interpretation { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; font-style: italic; }
    .score-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .score-stat { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; text-align: center; }
    .score-stat-value { font-family: Arial, sans-serif; font-size: 24px; font-weight: 700; color: #0f172a; }
    .score-stat-label { font-family: Arial, sans-serif; font-size: 11px; color: #64748b; margin-top: 2px; }

    /* PART 4 — What to do next */
    .next-steps { margin: 0 40px 28px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px 32px; }
    .next-steps-heading { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 20px; }
    .step { display: flex; gap: 16px; margin-bottom: 16px; align-items: flex-start; }
    .step:last-child { margin-bottom: 0; }
    .step-number { width: 28px; height: 28px; border-radius: 50%; background: #3b82f6; color: #ffffff; font-family: Arial, sans-serif; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .step-title { font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
    .step-body { font-size: 13px; color: #475569; line-height: 1.5; }

    /* PART 5 — Findings section header */
    .findings-section-header { background: #0f172a; padding: 14px 40px; margin-bottom: 0; }
    .findings-section-title { font-family: Arial, sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #ffffff; font-weight: 600; }

    /* PART 6 — Severity badges */
    .severity-badge { display: inline-block; font-family: Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; margin-bottom: 8px; }
    .severity-high { background: #fee2e2; color: #991b1b; }
    .severity-medium { background: #fef3c7; color: #92400e; }
    .severity-low { background: #dbeafe; color: #1e40af; }

    /* PART 7 — Recommendation boxes */
    .recommendation-box { background: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 0 6px 6px 0; padding: 14px 16px; margin-top: 12px; }
    .recommendation-label { font-family: Arial, sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #3b82f6; margin-bottom: 6px; }
    .recommendation-text { font-size: 13px; color: #1e3a5f; line-height: 1.6; }

    /* PART 8 — Footer */
    .footer { margin: 48px 40px 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .footer-brand { font-family: Arial, sans-serif; font-size: 12px; font-weight: 700; color: #0f172a; }
    .footer-center { font-family: Arial, sans-serif; font-size: 11px; color: #94a3b8; text-align: center; }
    .footer-right { font-family: Arial, sans-serif; font-size: 11px; color: #94a3b8; text-align: right; }

    /* PART 9 — Page blocks and findings */
    .page-block { margin: 0 40px 36px; padding-bottom: 36px; border-bottom: 1px solid #f1f5f9; }
    .page-block:last-of-type { border-bottom: none; }
    .page-name { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .page-url { font-family: Arial, sans-serif; font-size: 12px; color: #94a3b8; margin-bottom: 10px; }
    .status-badge { display: inline-block; font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px; }
    .status-compliant { background: #dcfce7; color: #166534; }
    .status-warning { background: #fef9c3; color: #854d0e; }
    .status-issues { background: #fee2e2; color: #991b1b; }
    .status-skipped { background: #f1f5f9; color: #64748b; }
    .finding { border-left: 4px solid #e2e8f0; padding: 18px 20px; margin-bottom: 16px; background: #f8fafc; border-radius: 0 8px 8px 0; }
    .finding-high { border-left-color: #ef4444; background: #fff8f8; }
    .finding-medium { border-left-color: #f59e0b; background: #fffdf0; }
    .finding-low { border-left-color: #3b82f6; background: #f8faff; }
    .finding-description { font-size: 14px; color: #1e293b; margin-bottom: 12px; line-height: 1.6; }

    /* Disclaimer */
    .disclaimer { margin: 0 40px 0; padding: 24px 28px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-family: Arial, sans-serif; font-size: 12px; color: #64748b; line-height: 1.6; }
    .disclaimer-heading { display: block; margin-bottom: 6px; color: #374151; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }

    /* PART 10 — Print */
    @media print {
      body { font-size: 12px; }
      .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .header-accent { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .score-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; break-inside: avoid; }
      .next-steps { -webkit-print-color-adjust: exact; print-color-adjust: exact; break-inside: avoid; }
      .findings-section-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .finding { break-inside: avoid; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .severity-badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .recommendation-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; break-inside: avoid; }
      .score-progress-bar-fill { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .step-number { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page-block { break-inside: avoid; }
    }
  </style>
</head>
<body>
<div class="page-content">

  <!-- PART 1: Header -->
  <div class="header">
    <div class="header-inner">
      <div class="header-brand">
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACGkAAAFGCAYAAADTzFAoAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAG3ESURBVHgB7d39dRNXtwfgTVb+v6SCTCoIVBBRQUgFUSoIVICpAKgAUwGkApQKcCrIpIKXVMCdzRzFg5FtSZY0X8+z1lyZjzc3saWZc/b5nX3uBQAAAMzMp0+fquale/1fc90vX98vV1z5+jp15+uP5Vr/fn79b3ld/7q+d+9eHQAAAADMzr0AAACAiSphjEVz/RhtAONBeR2CDGxclNe/Ol9f3Lt372MAAAAAMDlCGgAAAEzGp0+fFtEGMX6KNpxxWxeMocrARh2X4Y0L3TcAAAAAxk9IAwAAgNH69OlThjCWzfVjtOGMsYYytrHuvJHXnyG4AQAAAGNA+RKSDiTQAAAAlklEQVQAAIAxE9IAAAAAAAAAAAAAAAAAAAAAAAAAgJm4FwAAAAAAAAAAAAAAAAAAAAAAAMzAJ5g9oBcAAAAASUVORK5CYII="
          alt="SafePost"
          style="height: 36px; width: auto;"
        />
      </div>
      <div class="header-right">
        <div class="header-label">WEBSITE COMPLIANCE AUDIT</div>
      </div>
    </div>
    <div class="header-accent"></div>
  </div>

  <!-- PART 2: Report title -->
  <div class="report-title-block">
    <div class="report-label">Compliance Audit Report</div>
    <div class="report-practice-name">${escHtml(practiceName || 'Your Practice')}</div>
    <div class="report-date">${escHtml(auditDate)}</div>
  </div>

  <!-- PART 3: Score card -->
  <div class="score-card" style="border-left-color: ${scoreColor};">
    <div class="score-label">Overall Compliance Score</div>
    <div class="score-value" style="color: ${scoreColor};">${score}%</div>
    <div class="score-progress-bar-track">
      <div class="score-progress-bar-fill" style="width: ${score}%; background: ${scoreColor};"></div>
    </div>
    <div class="score-interpretation">${scoreInterpretation}</div>
    <div class="score-stats">
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

  <!-- PART 4: What to do next -->
  <div class="next-steps">
    <div class="next-steps-heading">What to do next</div>
    <div class="step">
      <div class="step-number">1</div>
      <div>
        <div class="step-title">Address your High severity findings first</div>
        <div class="step-body">These represent the most serious compliance risks and are most likely to attract AHPRA or TGA attention.</div>
      </div>
    </div>
    <div class="step">
      <div class="step-number">2</div>
      <div>
        <div class="step-title">Review each page&#39;s recommendations</div>
        <div class="step-body">Work through the Page-by-Page Findings below and make the suggested changes to your website content.</div>
      </div>
    </div>
    <div class="step">
      <div class="step-number">3</div>
      <div>
        <div class="step-title">Run a new audit to confirm your changes</div>
        <div class="step-body">Once you have made changes, consider running a new audit to verify your website meets AHPRA and TGA standards.</div>
      </div>
    </div>
  </div>

  <!-- PART 5: Findings section header -->
  <div class="findings-section-header">
    <div class="findings-section-title">Page-by-Page Findings</div>
  </div>

  <!-- Per-page blocks -->
  ${pageBlocks}

  <!-- Disclaimer -->
  <div class="disclaimer">
    <span class="disclaimer-heading">Important Disclaimer</span>
    This report has been generated by SafePost using AI-powered analysis of publicly available website content. It is intended as a general compliance screening tool only and does not constitute legal advice. AHPRA and TGA advertising regulations are complex and subject to change. SafePost accepts no liability for any decisions made based on this report. Practitioners should seek independent legal or compliance advice before making changes to their advertising materials. For the most current AHPRA advertising guidelines, visit www.ahpra.gov.au.
  </div>

  <!-- PART 8: Footer -->
  <div class="footer">
    <div class="footer-brand">SafePost</div>
    <div class="footer-center">AI-powered AHPRA and TGA compliance &middot; www.safepost.com.au</div>
    <div class="footer-right">${escHtml(auditDate)}</div>
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

function getScoreInterpretation(score: number): string {
  if (score === 100) return 'Your website appears compliant with AHPRA and TGA advertising standards based on the pages reviewed.';
  if (score >= 76) return 'Your website is largely compliant with a few minor issues to address.';
  if (score >= 51) return 'Your website is partially compliant but has areas that need improvement to meet AHPRA and TGA advertising standards.';
  if (score >= 26) return 'Your website has several compliance issues that should be addressed to reduce your risk of an AHPRA or TGA complaint.';
  return 'Your website has significant compliance issues that require urgent attention before they attract regulatory scrutiny.';
}

const AuditReport: React.FC = () => {
  const navigate = useNavigate();
  const { accountId, practiceName, accountLoading, plan } = useAccount();
  const [session, setSession] = useState<AuditSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [emailFormOpen, setEmailFormOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailValidationError, setEmailValidationError] = useState('');
  const [standardAuditLoading, setStandardAuditLoading] = useState(false);
  const [extAuditLoading, setExtAuditLoading] = useState(false);
  const [newAuditError, setNewAuditError] = useState<string | null>(null);

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

  const handleDownloadHtml = async () => {
    if (!session) return;
    setDownloadLoading(true);
    try {
      const htmlContent = await generateHtml(session, practiceName);
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

  const handleSendEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress.trim())) {
      setEmailValidationError('Please enter a valid email address');
      return;
    }
    setEmailValidationError('');
    setEmailError('');
    setEmailSending(true);
    const auditDate = new Date(session!.updated_at || session!.created_at).toLocaleDateString('en-AU', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    try {
      const { error } = await supabase.functions.invoke('email-audit-report', {
        body: {
          email: emailAddress.trim(),
          auditSession: session,
          practiceName: practiceName || 'Your Practice',
          auditDate,
        },
      });
      if (error) throw error;
      setEmailSuccess(true);
      setEmailAddress('');
    } catch {
      setEmailError('Failed to send report. Please try again.');
    } finally {
      setEmailSending(false);
    }
  };

  const handleBuyAudit = async (type: 'standard' | 'extended') => {
    setNewAuditError(null);
    if (type === 'standard') setStandardAuditLoading(true); else setExtAuditLoading(true);
    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession?.access_token) {
        setNewAuditError('Something went wrong. Please try again.');
        return;
      }
      const isSubscriber = !!(plan && plan !== '' && plan !== 'starter');
      const productType = type === 'extended'
        ? 'audit_extended'
        : isSubscriber ? 'audit' : 'audit_standalone';
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authSession.access_token}` },
          body: JSON.stringify({ productType }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.url) { setNewAuditError('Something went wrong. Please try again.'); return; }
      window.location.href = data.url;
    } catch {
      setNewAuditError('Something went wrong. Please try again.');
    } finally {
      if (type === 'standard') setStandardAuditLoading(false); else setExtAuditLoading(false);
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
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
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
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[24px] font-bold text-gray-900 mb-1">Audit Report</h1>
          <p className="text-[13px] text-gray-400">
            {new Date(session.updated_at || session.created_at).toLocaleDateString('en-AU', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
            {practiceName && ` — ${practiceName}`}
          </p>
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
          <p className="text-[14px] text-gray-500 mb-4">{getScoreInterpretation(score)}</p>
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

        {/* What to do next */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-[15px] font-semibold text-gray-900 mb-5">What to do next</h2>
          <div className="flex flex-col gap-5">
            {[
              {
                n: 1,
                heading: 'Address your High severity findings first',
                body: 'These represent the most serious compliance risks and are most likely to attract AHPRA or TGA attention.',
              },
              {
                n: 2,
                heading: 'Review each page\'s recommendations',
                body: 'Work through the Page-by-Page Breakdown below and make the suggested changes to your website content.',
              },
              {
                n: 3,
                heading: 'Run a new audit to confirm your changes',
                body: 'Once you have made changes, consider running a new audit to verify your website meets AHPRA and TGA standards.',
              },
            ].map(({ n, heading, body }) => (
              <div key={n} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[12px] font-bold text-blue-600">{n}</span>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-gray-900 mb-0.5">{heading}</p>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-page breakdown */}
        <h2 className="text-[16px] font-semibold text-gray-900 mb-3">Page-by-Page Breakdown</h2>
        <div className="flex flex-col gap-3">
          {session.steps.map((step, idx) =>
            step.status === 'complete' ? <StepAccordion key={idx} step={step} /> : null
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-5 border border-slate-200 rounded-xl bg-slate-50">
          <p className="text-[12px] text-gray-500 leading-relaxed">
            This report has been generated by SafePost using AI-powered analysis of publicly available website content. It is intended as a general compliance screening tool only and does not constitute legal advice. AHPRA and TGA advertising regulations are complex and subject to change. SafePost accepts no liability for any decisions made based on this report. Practitioners should seek independent legal or compliance advice before making changes to their advertising materials.
          </p>
        </div>

        {/* Card A — Save your report */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Save a copy for your records</h2>
          <p className="text-[13px] text-gray-500 mb-4">
            Download or email your full audit report. Open the HTML file in any browser and print to PDF with Ctrl+P.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleDownloadHtml}
              disabled={downloadLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {downloadLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              Download Report (HTML)
            </button>
            <button
              onClick={() => { setEmailFormOpen(true); setEmailSuccess(false); setEmailError(''); setEmailValidationError(''); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-gray-700 text-[13px] font-semibold rounded-xl transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Email this report
            </button>
          </div>
          {emailFormOpen && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              {emailSuccess ? (
                <p className="text-[13px] text-green-700 font-medium">Report sent successfully. Please check your inbox.</p>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => { setEmailAddress(e.target.value); setEmailValidationError(''); }}
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 text-[13px] border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                    />
                    <button
                      onClick={handleSendEmail}
                      disabled={emailSending}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap"
                    >
                      {emailSending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {emailSending ? 'Sending...' : 'Send Report'}
                    </button>
                    <button
                      onClick={() => { setEmailFormOpen(false); setEmailError(''); setEmailValidationError(''); setEmailAddress(''); }}
                      className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  </div>
                  {emailValidationError && <p className="text-[12px] text-red-600 mt-2">{emailValidationError}</p>}
                  {emailError && <p className="text-[12px] text-red-600 mt-2">{emailError}</p>}
                  <p className="text-[11px] text-gray-400 mt-2">
                    The report will be sent to the email address you enter. You can send it to yourself or a colleague.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Card B — Run another audit */}
        <div className="mt-4 bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
          <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Want to check more pages?</h2>
          <p className="text-[13px] text-gray-500 mb-4">
            Each audit is a one-time purchase. Your previous results are saved to your account.
          </p>
          {newAuditError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[13px] text-red-700">{newAuditError}</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Standard */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Standard</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[28px] font-bold text-gray-900 leading-none">$149</span>
                <span className="text-[13px] text-gray-400">AUD (incl. GST)</span>
              </div>
              <p className="text-[13px] text-gray-500 mb-4">Up to 6 pages</p>
              <button
                onClick={() => handleBuyAudit('standard')}
                disabled={standardAuditLoading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[13px] font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mt-auto"
              >
                {standardAuditLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Redirecting…</> : 'Buy Standard Audit'}
              </button>
            </div>
            {/* Extended */}
            <div className="relative bg-slate-50 rounded-xl border-2 border-blue-200 p-5 flex flex-col">
              <div className="absolute -top-3 right-4">
                <span className="text-[11px] font-semibold text-white bg-blue-600 px-3 py-1 rounded-full shadow-sm">
                  Best value
                </span>
              </div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Extended</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[28px] font-bold text-gray-900 leading-none">$249</span>
                <span className="text-[13px] text-gray-400">AUD (incl. GST)</span>
              </div>
              <p className="text-[13px] text-gray-500 mb-4">Up to 12 pages</p>
              <button
                onClick={() => handleBuyAudit('extended')}
                disabled={extAuditLoading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[13px] font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mt-auto"
              >
                {extAuditLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Redirecting…</> : 'Buy Extended Audit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default AuditReport;
