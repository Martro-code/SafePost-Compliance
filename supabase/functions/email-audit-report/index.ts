import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { encode as encodeBase64 } from 'https://deno.land/std@0.177.0/encoding/base64.ts';

const allowedOrigins = [
  'https://www.safepost.com.au',
  'https://safepost.com.au',
  'http://localhost:3000',
  'http://localhost:5173',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuditIssue {
  severity: string;
  description: string;
  recommendation: string;
}

interface AuditResult {
  complianceStatus: string;
  summary: string;
  url?: string;
  issues: AuditIssue[];
}

interface AuditStep {
  name: string;
  status: string;
  result?: AuditResult;
}

interface AuditSession {
  steps: AuditStep[];
  created_at: string;
  updated_at?: string;
}

// ── HTML helpers ──────────────────────────────────────────────────────────────

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── HTML report generation ────────────────────────────────────────────────────
// Mirrors the generateHtml function in AuditReport.tsx.
// Uses the absolute logo URL instead of base64 (suitable for an email attachment
// opened in a browser that can load external resources).

function generateHtml(session: AuditSession, practiceName: string, auditDate: string): string {
  const analysedSteps = session.steps.filter(
    (s) => s.status === 'complete' && s.result && s.result.complianceStatus !== 'skipped'
  );
  const passCount = analysedSteps.filter((s) => s.result?.complianceStatus === 'pass').length;
  const warnCount = analysedSteps.filter((s) => s.result?.complianceStatus === 'warning').length;
  const failCount = analysedSteps.filter((s) => s.result?.complianceStatus === 'fail').length;
  const score = analysedSteps.length > 0
    ? Math.round(((passCount + warnCount * 0.5) / analysedSteps.length) * 100)
    : 0;

  const scoreHexColor = score >= 67 ? '#22c55e' : score >= 34 ? '#f59e0b' : '#ef4444';

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
        const sevBadgeStyle =
          sev === 'high'   ? 'background:#fee2e2;color:#991b1b;' :
          sev === 'medium' ? 'background:#fef3c7;color:#92400e;' :
                             'background:#dbeafe;color:#1e40af;';
        const cardBg =
          sev === 'high'   ? '#fff8f8' :
          sev === 'medium' ? '#fffdf5' :
                             '#f5f8ff';
        return `
      <div class="finding finding-${sev}" style="background: ${cardBg}; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
        <span class="finding-severity-badge" style="${sevBadgeStyle}">${sev.toUpperCase()}</span>
        <div class="finding-description">${escHtml(issue.description)}</div>
        <div class="finding-recommendation">
          <span class="recommendation-label">Recommendation</span>
          ${escHtml(issue.recommendation)}
        </div>
      </div>`;
      }).join('');

      const hrColor =
        result.complianceStatus === 'pass'    ? '#22c55e' :
        result.complianceStatus === 'warning' ? '#f59e0b' : '#ef4444';

      return `
    <div class="page-block">
      <hr style="border: none; border-top: 2px solid ${hrColor}; margin-bottom: 20px; border-radius: 2px;" />
      <div class="page-name">${escHtml(step.name)}</div>
      ${result.url ? `<div class="page-url">${escHtml(result.url)}</div>` : ''}
      <span class="status-badge ${badgeClass}">${badgeLabel}</span>
      <div class="page-summary">${escHtml(result.summary)}</div>
      ${findingsHtml}
    </div>`;
    })
    .join('');

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
    .score-value { font-size: 48px; font-weight: bold; line-height: 1; margin-bottom: 10px; }
    .score-progress-track { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin-bottom: 24px; }
    .score-progress-bar { height: 100%; border-radius: 4px; }
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
    .finding { border-left: 4px solid #e2e8f0; margin-bottom: 16px; border-radius: 0 8px 8px 0; }
    .finding-high { border-left-color: #ef4444; }
    .finding-medium { border-left-color: #f59e0b; }
    .finding-low { border-left-color: #3b82f6; }
    .finding-severity-badge { display: inline-block; font-family: 'Arial', sans-serif; font-size: 10px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; margin-bottom: 10px; }
    .finding-description { font-size: 15px; color: #1e293b; margin-bottom: 12px; }
    .finding-recommendation { font-size: 13px; color: #334155; background: #f0f4f8; border-left: 4px solid #3b82f6; border-radius: 0 6px 6px 0; padding: 12px 14px; }
    .recommendation-label { display: inline-block; font-family: 'Arial', sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 20px; margin-bottom: 6px; }
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
      .finding-severity-badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .finding-recommendation { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .recommendation-label { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <div class="header">
    <img src="https://www.safepost.com.au/safepost-logo.png" alt="SafePost" style="height:34px;" />
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
      <div class="score-value" style="color: ${scoreHexColor}">${score}%</div>
      <div class="score-progress-track">
        <div class="score-progress-bar" style="width: ${score}%; background-color: ${scoreHexColor};"></div>
      </div>
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

    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; margin-bottom: 40px;">
      ${session.steps.filter((s) => s.status === 'complete' && s.result).map((step) => {
        const st = step.result!.complianceStatus;
        const borderColor =
          st === 'pass'    ? '#22c55e' :
          st === 'warning' ? '#f59e0b' :
          st === 'skipped' ? '#cbd5e1' : '#ef4444';
        const labelColor =
          st === 'pass'    ? '#166534' :
          st === 'warning' ? '#854d0e' :
          st === 'skipped' ? '#64748b' : '#991b1b';
        const statusText =
          st === 'pass'    ? 'Compliant' :
          st === 'warning' ? 'Warnings'  :
          st === 'skipped' ? 'Not Analysed' : 'Issues Found';
        return `<div style="border-left: 4px solid ${borderColor}; background: #f8fafc; border-radius: 0 8px 8px 0; padding: 10px 14px;">
          <div style="font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #0f172a; margin-bottom: 3px;">${escHtml(step.name)}</div>
          <div style="font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; color: ${labelColor}; text-transform: uppercase; letter-spacing: 0.5px;">${statusText}</div>
        </div>`;
      }).join('')}
    </div>

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

// ── Request handler ───────────────────────────────────────────────────────────

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email, auditSession, practiceName, auditDate } = body;

    if (!email || !auditSession) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate the full HTML report
    const reportHtml = generateHtml(
      auditSession as AuditSession,
      practiceName || 'Your Practice',
      auditDate || '',
    );

    // Base64-encode the HTML for the attachment
    const reportBase64 = encodeBase64(new TextEncoder().encode(reportHtml));

    const subject = `Your SafePost Website Compliance Audit Report — ${auditDate || ''}`;

    const emailBody = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
  <img src="https://www.safepost.com.au/safepost-logo.png" alt="SafePost" style="height: 32px; margin-bottom: 24px;" />
  <h2 style="color: #0f172a;">Your Website Compliance Audit Report is attached</h2>
  <p style="color: #475569;">Please find your SafePost Website Compliance Audit Report attached to this email.</p>
  <p style="color: #475569;">The report contains your page-by-page compliance findings and recommendations. If you have any questions, contact us at <a href="mailto:support@safepost.com.au">support@safepost.com.au</a>.</p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
  <p style="color: #94a3b8; font-size: 12px;">SafePost Pty Ltd — AI-powered AHPRA and TGA compliance for Australian medical practitioners — <a href="https://www.safepost.com.au">www.safepost.com.au</a></p>
</div>`;

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SafePost <reports@safepost.com.au>',
        to: email,
        subject,
        html: emailBody,
        attachments: [
          {
            filename: 'SafePost-Audit-Report.html',
            content: reportBase64,
            type: 'text/html',
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      const errText = await emailResponse.text();
      console.error('Resend error:', errText);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('email-audit-report error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
