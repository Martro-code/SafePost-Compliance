import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Download, RefreshCw, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useAccount } from '../../context/AccountContext';
import { AuditSession, AuditStep } from '../../types/audit';
import LoggedInLayout from '../layout/LoggedInLayout';

// ── PDF generation ────────────────────────────────────────────────────────────

async function generatePdf(session: AuditSession, practiceName: string) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const PAGE_W = 210;
  const MARGIN = 20;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  let y = MARGIN;

  const ensureSpace = (needed: number) => {
    if (y + needed > 277) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const writeText = (text: string, x: number, fontSize: number, color: [number, number, number], bold = false) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, CONTENT_W - (x - MARGIN));
    ensureSpace(lines.length * (fontSize * 0.4) + 2);
    doc.text(lines, x, y);
    y += lines.length * (fontSize * 0.4) + 2;
  };

  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, PAGE_W, 28, 'F');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('SafePost', MARGIN, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Website Compliance Audit Report', MARGIN, 20);
  y = 38;

  // Practice + date
  writeText(practiceName || 'Your Practice', MARGIN, 14, [17, 24, 39], true);
  const dateStr = new Date(session.created_at).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  writeText(`Audit date: ${dateStr}`, MARGIN, 10, [107, 114, 128]);
  y += 4;

  // Summary section
  const completedSteps = session.steps.filter((s) => s.status === 'complete' && s.result);
  const passCount = completedSteps.filter((s) => s.result?.complianceStatus === 'pass').length;
  const warnCount = completedSteps.filter((s) => s.result?.complianceStatus === 'warning').length;
  const failCount = completedSteps.filter((s) => s.result?.complianceStatus === 'fail').length;
  const totalIssues = completedSteps.reduce((acc, s) => acc + (s.result?.issues.length ?? 0), 0);
  const score = completedSteps.length > 0
    ? Math.round(((passCount + warnCount * 0.5) / completedSteps.length) * 100)
    : 0;

  ensureSpace(30);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(MARGIN, y, CONTENT_W, 28, 3, 3, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(`Overall Score: ${score}%`, MARGIN + 6, y + 8);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text(`Pages analysed: ${completedSteps.length}   Compliant: ${passCount}   Warnings: ${warnCount}   Issues: ${failCount}   Total findings: ${totalIssues}`, MARGIN + 6, y + 17);
  y += 34;

  // Per-page breakdown
  writeText('Page-by-Page Findings', MARGIN, 13, [17, 24, 39], true);
  y += 2;

  for (const step of completedSteps) {
    if (!step.result) continue;
    ensureSpace(20);

    const statusColor: [number, number, number] =
      step.result.complianceStatus === 'pass' ? [22, 163, 74] :
      step.result.complianceStatus === 'warning' ? [217, 119, 6] : [220, 38, 38];

    writeText(step.name, MARGIN, 11, [17, 24, 39], true);
    const statusLabel = step.result.complianceStatus === 'pass' ? 'Compliant' :
      step.result.complianceStatus === 'warning' ? 'Warnings' : 'Issues Found';
    writeText(`Status: ${statusLabel}`, MARGIN + 4, 9, statusColor);
    writeText(step.result.summary, MARGIN + 4, 9, [75, 85, 99]);

    if (step.result.issues.length > 0) {
      for (const issue of step.result.issues) {
        ensureSpace(14);
        const sevColor: [number, number, number] =
          issue.severity === 'high' ? [220, 38, 38] :
          issue.severity === 'medium' ? [217, 119, 6] : [107, 114, 128];
        writeText(`[${issue.severity.toUpperCase()}] ${issue.description}`, MARGIN + 8, 8, sevColor);
        writeText(`→ ${issue.recommendation}`, MARGIN + 10, 8, [75, 85, 99]);
        y += 1;
      }
    }
    y += 4;
  }

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.setFont('helvetica', 'normal');
    doc.text(`SafePost Website Compliance Audit — ${dateStr} — Page ${i} of ${totalPages}`, MARGIN, 290);
  }

  doc.save(`SafePost-Audit-${dateStr.replace(/\s/g, '-')}.pdf`);
}

// ── Component ─────────────────────────────────────────────────────────────────

const StatusIcon: React.FC<{ status: 'pass' | 'warning' | 'fail'; className?: string }> = ({ status, className }) => {
  if (status === 'pass') return <CheckCircle className={className ?? 'w-4 h-4 text-green-600'} />;
  if (status === 'warning') return <AlertTriangle className={className ?? 'w-4 h-4 text-amber-600'} />;
  return <XCircle className={className ?? 'w-4 h-4 text-red-600'} />;
};

const StepAccordion: React.FC<{ step: AuditStep; index: number }> = ({ step, index }) => {
  const [open, setOpen] = useState(false);
  if (!step.result) return null;

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
            <p className="text-[11px] text-gray-400 mt-0.5">{step.result.issues.length} finding{step.result.issues.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-slate-100 p-4 bg-slate-50 flex flex-col gap-3">
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
        </div>
      )}
    </div>
  );
};

const AuditReport: React.FC = () => {
  const navigate = useNavigate();
  const { accountId, practiceName, accountLoading, auditPurchased } = useAccount();
  const [session, setSession] = useState<AuditSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [newAuditLoading, setNewAuditLoading] = useState(false);

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
    if (!accountLoading) {
      if (!auditPurchased) {
        navigate('/audit', { replace: true });
        return;
      }
      loadSession();
    }
  }, [accountLoading, auditPurchased, loadSession, navigate]);

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

  const handleNewAudit = async () => {
    if (!accountId) return;
    setNewAuditLoading(true);
    try {
      // Mark all in_progress sessions as abandoned so AuditFlow creates a fresh one
      await supabase
        .from('audit_sessions')
        .update({ status: 'abandoned' })
        .eq('account_id', accountId)
        .eq('status', 'in_progress');
      navigate('/audit/start');
    } catch (err) {
      console.error('Failed to start new audit:', err);
    } finally {
      setNewAuditLoading(false);
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
          <p className="text-[14px] text-gray-500 mb-6">Complete all 6 steps of your audit to generate the report.</p>
          <button
            onClick={() => navigate('/audit/start')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-xl transition-colors"
          >
            Continue Audit
          </button>
        </div>
      </LoggedInLayout>
    );
  }

  const completedSteps = session.steps.filter((s) => s.status === 'complete' && s.result);
  const passCount = completedSteps.filter((s) => s.result?.complianceStatus === 'pass').length;
  const warnCount = completedSteps.filter((s) => s.result?.complianceStatus === 'warning').length;
  const failCount = completedSteps.filter((s) => s.result?.complianceStatus === 'fail').length;
  const totalIssues = completedSteps.reduce((acc, s) => acc + (s.result?.issues.length ?? 0), 0);
  const score = completedSteps.length > 0
    ? Math.round(((passCount + warnCount * 0.5) / completedSteps.length) * 100)
    : 0;

  const scoreColor =
    score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
  const scoreBarColor =
    score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';

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
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleNewAudit}
              disabled={newAuditLoading}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-gray-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-60"
            >
              {newAuditLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Run New Audit
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60"
            >
              {pdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              Download PDF Report
            </button>
          </div>
        </div>

        {/* Score summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6 mb-4 flex-wrap">
            <div>
              <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Overall Score</p>
              <p className={`text-[48px] font-bold leading-none ${scoreColor}`}>{score}%</p>
            </div>
            <div className="flex-1 min-w-[160px]">
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreBarColor}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <div className="flex gap-4 text-[13px]">
                <span className="text-green-600 font-medium">{passCount} compliant</span>
                <span className="text-amber-600 font-medium">{warnCount} warnings</span>
                <span className="text-red-600 font-medium">{failCount} issues</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-[22px] font-bold text-gray-900">{completedSteps.length}</p>
              <p className="text-[11px] text-gray-400">Pages analysed</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-[22px] font-bold text-gray-900">{totalIssues}</p>
              <p className="text-[11px] text-gray-400">Total findings</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
              <p className="text-[22px] font-bold text-gray-900">
                {completedSteps.reduce((acc, s) => acc + (s.result?.issues.filter((i) => i.severity === 'high').length ?? 0), 0)}
              </p>
              <p className="text-[11px] text-gray-400">High severity</p>
            </div>
          </div>
        </div>

        {/* Per-page breakdown */}
        <h2 className="text-[16px] font-semibold text-gray-900 mb-3">Page-by-Page Breakdown</h2>
        <div className="flex flex-col gap-3">
          {session.steps.map((step, idx) =>
            step.status === 'complete' ? (
              <StepAccordion key={idx} step={step} index={idx} />
            ) : null
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
