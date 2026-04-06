import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Download, CheckCircle, AlertTriangle, XCircle, MinusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useAccount } from '../../context/AccountContext';
import { AuditSession, AuditStep } from '../../types/audit';
import LoggedInLayout from '../layout/LoggedInLayout';
import safepostLogoUrl from '../../assets/safepost-logo.png';

// ── PDF generation ────────────────────────────────────────────────────────────

const PDF_MARGIN = 20;       // mm left/right
const PDF_PAGE_W = 210;      // A4 width mm
const PDF_CONTENT_W = PDF_PAGE_W - PDF_MARGIN * 2;  // 170mm
const PDF_BOTTOM = 282;      // mm — content stops here, footer lives at 288

/** Convert pt font-size → mm line height with 1.5× spacing */
const lineHeightMm = (fontSize: number) => fontSize * 0.352778 * 1.5;

async function generatePdf(session: AuditSession, practiceName: string) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  let y = PDF_MARGIN;

  /** Ensure there is `needed` mm of vertical space; add page if not. */
  const ensureSpace = (needed: number) => {
    if (y + needed > PDF_BOTTOM) {
      doc.addPage();
      y = PDF_MARGIN;
    }
  };

  /**
   * Write wrapped text and advance y.
   * x       — left edge in mm (must be >= PDF_MARGIN)
   * fontSize — in pt
   * Returns the height consumed.
   */
  const writeText = (
    text: string,
    x: number,
    fontSize: number,
    color: [number, number, number],
    bold = false,
    extraSpacingMm = 1
  ): number => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);

    const availableWidth = PDF_CONTENT_W - (x - PDF_MARGIN);
    const lines: string[] = doc.splitTextToSize(text, availableWidth);
    const lh = lineHeightMm(fontSize);
    const blockH = lines.length * lh + extraSpacingMm;

    ensureSpace(blockH);
    lines.forEach((line: string, i: number) => {
      doc.text(line, x, y + i * lh);
    });
    y += blockH;
    return blockH;
  };

  /**
   * Write a section heading — ensure there is enough room for the heading
   * PLUS at least one body line (orphan guard).
   */
  const writeHeading = (
    text: string,
    x: number,
    fontSize: number,
    color: [number, number, number],
    orphanGuardMm = 12
  ) => {
    ensureSpace(lineHeightMm(fontSize) + orphanGuardMm);
    writeText(text, x, fontSize, color, true, 2);
  };

  // ── Cover header ──────────────────────────────────────────────────────────
  // Dark navy banner (full width, 25mm tall)
  const BANNER_H = 25;
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, PDF_PAGE_W, BANNER_H, 'F');

  // Load logo via canvas → base64 so we can pass it to addImage
  try {
    const logoBase64 = await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const LOGO_W_MM = 40;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const LOGO_H_MM = LOGO_W_MM / aspectRatio;
        // Scale canvas to 2× for crisp rendering
        const scale = 2;
        const canvas = document.createElement('canvas');
        canvas.width  = img.naturalWidth  * scale;
        canvas.height = img.naturalHeight * scale;
        const ctx = canvas.getContext('2d')!;
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = safepostLogoUrl;
    });

    // Measure rendered dimensions to keep aspect ratio
    const tempImg = new Image();
    await new Promise<void>((res) => { tempImg.onload = () => res(); tempImg.src = safepostLogoUrl; });
    const LOGO_W_MM = 40;
    const LOGO_H_MM = LOGO_W_MM / (tempImg.naturalWidth / tempImg.naturalHeight);
    const logoY = (BANNER_H - LOGO_H_MM) / 2; // vertically centred in banner
    doc.addImage(logoBase64, 'PNG', PDF_MARGIN, logoY, LOGO_W_MM, LOGO_H_MM);
  } catch {
    // Fallback: white text wordmark if image load fails
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('SafePost', PDF_MARGIN, 14);
  }

  // "Website Compliance Audit Report" subtitle below the banner
  y = BANNER_H + 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105); // slate-500
  doc.text('Website Compliance Audit Report', PDF_MARGIN, y);
  y += 8;

  // Practice name + date
  writeText(practiceName || 'Your Practice', PDF_MARGIN, 14, [17, 24, 39], true, 2);
  const dateStr = new Date(session.created_at).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  writeText(`Audit completed: ${dateStr}`, PDF_MARGIN, 10, [107, 114, 128], false, 6);

  // ── Summary box ───────────────────────────────────────────────────────────
  const analysedSteps = session.steps.filter((s) => s.status === 'complete' && s.result && s.result.complianceStatus !== 'skipped');
  const passCount  = analysedSteps.filter((s) => s.result?.complianceStatus === 'pass').length;
  const warnCount  = analysedSteps.filter((s) => s.result?.complianceStatus === 'warning').length;
  const failCount  = analysedSteps.filter((s) => s.result?.complianceStatus === 'fail').length;
  const totalIssues = analysedSteps.reduce((acc, s) => acc + (s.result?.issues.length ?? 0), 0);
  const score = analysedSteps.length > 0
    ? Math.round(((passCount + warnCount * 0.5) / analysedSteps.length) * 100)
    : 0;
  const skippedCount = session.steps.filter((s) => s.result?.complianceStatus === 'skipped').length;

  ensureSpace(32);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(PDF_MARGIN, y, PDF_CONTENT_W, 30, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(`Overall Compliance Score: ${score}%`, PDF_MARGIN + 6, y + 9);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  const summaryLine1 = `Pages analysed: ${analysedSteps.length}${skippedCount > 0 ? `   Skipped: ${skippedCount}` : ''}   Total findings: ${totalIssues}`;
  const summaryLine2 = `Compliant: ${passCount}   Warnings: ${warnCount}   Issues found: ${failCount}`;
  doc.text(summaryLine1, PDF_MARGIN + 6, y + 18);
  doc.text(summaryLine2, PDF_MARGIN + 6, y + 25);
  y += 36;

  // ── Page-by-page findings ─────────────────────────────────────────────────
  writeHeading('Page-by-Page Findings', PDF_MARGIN, 13, [17, 24, 39]);

  for (const step of session.steps) {
    if (step.status !== 'complete' || !step.result) continue;

    const isSkipped = step.result.complianceStatus === 'skipped';
    const statusColor: [number, number, number] = isSkipped
      ? [156, 163, 175]
      : step.result.complianceStatus === 'pass' ? [22, 163, 74]
      : step.result.complianceStatus === 'warning' ? [217, 119, 6]
      : [220, 38, 38];

    const statusLabel = isSkipped ? 'Not analysed'
      : step.result.complianceStatus === 'pass' ? 'Compliant'
      : step.result.complianceStatus === 'warning' ? 'Warnings identified'
      : 'Issues found';

    // Heading guard: heading + status line + summary line
    ensureSpace(lineHeightMm(11) + lineHeightMm(9) * 3 + 4);

    writeText(step.name, PDF_MARGIN, 11, [17, 24, 39], true, 1);
    writeText(`Status: ${statusLabel}`, PDF_MARGIN + 4, 9, statusColor, false, 1);

    if (step.result.url && !isSkipped) {
      writeText(step.result.url, PDF_MARGIN + 4, 8, [156, 163, 175], false, 1);
    }

    writeText(step.result.summary, PDF_MARGIN + 4, 9, [75, 85, 99], false, 2);

    if (!isSkipped && step.result.issues.length > 0) {
      for (const issue of step.result.issues) {
        const sevColor: [number, number, number] =
          issue.severity === 'high' ? [220, 38, 38]
          : issue.severity === 'medium' ? [217, 119, 6]
          : [107, 114, 128];

        ensureSpace(lineHeightMm(8) * 4 + 4);
        writeText(
          `[${issue.severity.toUpperCase()}]  ${issue.description}`,
          PDF_MARGIN + 8, 8, sevColor, false, 1
        );
        writeText(
          `Recommendation: ${issue.recommendation}`,
          PDF_MARGIN + 8, 8, [75, 85, 99], false, 2
        );
      }
    }
    y += 4; // inter-page gap
  }

  // ── Page footers ──────────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(PDF_MARGIN, 286, PDF_PAGE_W - PDF_MARGIN, 286);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `SafePost Website Compliance Audit  ·  ${dateStr}  ·  Page ${i} of ${totalPages}`,
      PDF_MARGIN, 291
    );
  }

  doc.save(`SafePost-Audit-${dateStr.replace(/[\s,]+/g, '-')}.pdf`);
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
  const [pdfLoading, setPdfLoading] = useState(false);

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

  const handleDownloadPdf = async () => {
    if (!session) return;
    setPdfLoading(true);
    try {
      await generatePdf(session, practiceName);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setPdfLoading(false);
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
              {new Date(session.created_at).toLocaleDateString('en-AU', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
              {practiceName && ` — ${practiceName}`}
            </p>
          </div>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60"
          >
            {pdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Download PDF Report
          </button>
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
            Download the full branded PDF report to share with your team or compliance advisor.
          </p>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {pdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Download PDF Report
          </button>
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default AuditReport;
