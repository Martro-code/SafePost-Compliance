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
  const passCount   = analysedSteps.filter((s) => s.result?.complianceStatus === 'pass').length;
  const warnCount   = analysedSteps.filter((s) => s.result?.complianceStatus === 'warning').length;
  const failCount   = analysedSteps.filter((s) => s.result?.complianceStatus === 'fail').length;
  const score = analysedSteps.length > 0
    ? Math.round(((passCount + warnCount * 0.5) / analysedSteps.length) * 100)
    : 0;

  const scoreColor = score >= 67 ? '#22c55e' : score >= 34 ? '#f59e0b' : '#ef4444';
  const scoreInterpretation = getScoreInterpretation(score);

  const auditDate = new Date(session.updated_at || session.created_at).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // ── Per-page HTML blocks ──────────────────────────────────────────────────

  const pageBlocksHtml = session.steps
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
        <div class="severity-badge severity-${sev}">${sev.toUpperCase()}</div>
        <div class="finding-description">${escHtml(issue.description)}</div>
        <div class="recommendation-box">
          <div class="recommendation-label">Recommendation</div>
          <div class="recommendation-text">${escHtml(issue.recommendation)}</div>
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

  // ── Full HTML document ────────────────────────────────────────────────────

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SafePost Website Compliance Audit Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; font-size: 15px; line-height: 1.7; color: #1a1a2e; background: #ffffff; }
    .header { background: #ffffff; border-bottom: 3px solid #0f172a; padding: 16px 40px; display: flex; align-items: center; justify-content: space-between; }
    .header-label { font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #64748b; }
    .page { max-width: 860px; margin: 0 auto; padding: 48px 48px 80px; }
    .report-practice-name { font-size: 32px; font-weight: bold; color: #0f172a; margin-bottom: 4px; }
    .report-date { font-family: 'Arial', sans-serif; font-size: 13px; color: #64748b; margin-bottom: 32px; padding-bottom: 32px; border-bottom: 2px solid #e2e8f0; }
    .score-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px 36px; margin-bottom: 48px; }
    .score-label { font-family: 'Arial', sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 8px; }
    .score-value { font-size: 48px; font-weight: bold; line-height: 1; margin-bottom: 4px; }
    .score-interpretation { font-family: 'Arial', sans-serif; font-size: 14px; color: #374151; margin-bottom: 16px; }
    .score-bar-track { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin-bottom: 24px; }
    .score-bar-fill { height: 100%; border-radius: 4px; }
    .score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .score-stat { text-align: center; padding: 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; }
    .score-stat-value { font-family: 'Arial', sans-serif; font-size: 22px; font-weight: bold; color: #0f172a; }
    .score-stat-label { font-family: 'Arial', sans-serif; font-size: 11px; color: #64748b; margin-top: 2px; }
    .findings-header { margin-bottom: 28px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
    .findings-header-title { font-size: 22px; font-weight: bold; color: #0f172a; }
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
    .finding { border-left: 4px solid #e2e8f0; margin-bottom: 16px; border-radius: 0 8px 8px 0; padding: 20px; }
    .finding-high { border-left-color: #ef4444; background: #fff8f8; }
    .finding-medium { border-left-color: #f59e0b; background: #fffdf5; }
    .finding-low { border-left-color: #3b82f6; background: #f5f8ff; }
    .severity-badge { display: inline-block; font-family: 'Arial', sans-serif; font-size: 10px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; margin-bottom: 10px; }
    .severity-high { background: #fee2e2; color: #991b1b; }
    .severity-medium { background: #fef3c7; color: #92400e; }
    .severity-low { background: #dbeafe; color: #1e40af; }
    .finding-description { font-size: 15px; color: #1e293b; margin-bottom: 12px; }
    .recommendation-box { background: #f0f4f8; border-left: 4px solid #3b82f6; border-radius: 0 6px 6px 0; padding: 12px 14px; }
    .recommendation-label { font-family: 'Arial', sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #1e40af; margin-bottom: 4px; }
    .recommendation-text { font-size: 13px; color: #334155; }
    .next-steps { margin-top: 48px; margin-bottom: 48px; }
    .next-steps-title { font-size: 22px; font-weight: bold; color: #0f172a; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
    .step { display: flex; gap: 16px; margin-bottom: 20px; }
    .step-number { flex-shrink: 0; width: 32px; height: 32px; background: #0f172a; color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Arial', sans-serif; font-size: 14px; font-weight: bold; }
    .step-title { font-family: 'Arial', sans-serif; font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 4px; }
    .step-body { font-size: 13px; color: #374151; }
    .disclaimer { margin-top: 64px; padding: 24px 28px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-family: 'Arial', sans-serif; font-size: 12px; color: #64748b; line-height: 1.6; }
    .disclaimer strong { display: block; margin-bottom: 6px; color: #374151; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; font-family: 'Arial', sans-serif; font-size: 11px; color: #94a3b8; }
    .footer-brand { font-weight: bold; color: #64748b; }
    .footer-right { text-align: right; }
    @media print {
      body { font-size: 13px; }
      .score-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .finding { -webkit-print-color-adjust: exact; print-color-adjust: exact; break-inside: avoid; }
      .page-block { break-inside: avoid; }
      .status-badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .severity-badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .recommendation-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <div class="header">
    <svg width="120" height="18" viewBox="0 0 1436 217" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_13004_30)">
        <path d="M23.8444 87.9362H201.317C214.48 87.9362 225.162 98.6182 225.162 111.781C225.162 124.703 214.68 135.185 201.757 135.185H23.4043C10.4819 135.185 0 124.703 0 111.781C0 98.6182 10.682 87.9362 23.8444 87.9362Z" fill="#2563EB"/>
        <path d="M129.024 10.4819H201.317C214.48 10.4819 225.162 21.1639 225.162 34.3263C225.162 47.2487 214.68 57.7306 201.757 57.7306H128.584C115.661 57.7306 105.179 47.2487 105.179 34.3263C105.179 21.1639 115.861 10.4819 129.024 10.4819Z" fill="#0F172A"/>
        <path d="M80.0548 165.23H24.4446C10.9884 165.23 0.0800781 176.139 0.0800781 189.595C0.0800781 203.051 10.9884 213.959 24.4446 213.959H80.0548C93.5109 213.959 104.419 203.051 104.419 189.595C104.419 176.139 93.5109 165.23 80.0548 165.23Z" fill="#0F172A"/>
        <path d="M372.909 68.3726C372.109 60.3311 368.668 54.0499 362.627 49.6091C356.586 45.1683 348.344 42.9279 337.982 42.9279C330.941 42.9279 324.98 43.9281 320.099 45.8884C315.258 47.8488 311.538 50.5693 308.977 54.0099C306.417 57.4506 305.136 61.4113 305.136 65.7721C305.016 69.4528 305.776 72.6134 307.497 75.3739C309.177 78.0944 311.538 80.4548 314.538 82.4152C317.539 84.3755 320.979 86.0558 324.9 87.4961C328.821 88.9364 333.021 90.1366 337.462 91.1368L355.826 95.5376C364.747 97.5379 372.909 100.178 380.39 103.539C387.832 106.86 394.313 110.94 399.754 115.821C405.195 120.702 409.436 126.383 412.476 132.984C415.517 139.586 417.037 147.107 417.117 155.629C417.037 168.151 413.876 178.953 407.595 188.115C401.314 197.276 392.272 204.358 380.43 209.359C368.588 214.359 354.385 216.88 337.742 216.88C321.099 216.88 306.897 214.359 294.694 209.279C282.492 204.238 272.97 196.716 266.169 186.794C259.328 176.833 255.767 164.51 255.447 149.828H297.255C297.735 156.669 299.695 162.39 303.176 166.951C306.657 171.512 311.377 174.952 317.259 177.233C323.14 179.513 329.821 180.673 337.262 180.673C344.704 180.673 350.945 179.593 356.386 177.473C361.827 175.352 366.028 172.392 369.028 168.591C372.029 164.79 373.509 160.43 373.509 155.509C373.509 150.908 372.149 147.067 369.468 143.946C366.788 140.826 362.827 138.145 357.706 135.945C352.545 133.745 346.264 131.744 338.783 129.944L316.538 124.343C299.295 120.142 285.693 113.581 275.731 104.659C265.769 95.7376 260.808 83.7354 260.848 68.6126C260.768 56.2503 264.089 45.4083 270.77 36.1666C277.451 26.9249 286.653 19.6836 298.375 14.5226C310.097 9.32169 323.38 6.72121 338.302 6.72121C353.225 6.72121 366.748 9.32169 378.07 14.5226C389.432 19.7236 398.233 26.9249 404.555 36.1666C410.876 45.4083 414.156 56.1303 414.316 68.2926H372.909V68.3726Z" fill="#0F172A"/>
        <path d="M842.715 213.999V9.60175H923.37C938.893 9.60175 952.095 12.5623 962.977 18.4434C973.899 24.3245 982.221 32.486 987.982 42.8879C993.743 53.2898 996.624 65.292 996.624 78.8545C996.624 92.417 993.703 104.419 987.822 114.781C981.941 125.143 973.499 133.265 962.417 139.026C951.335 144.827 937.933 147.707 922.25 147.707H870.84V113.061H915.249C923.57 113.061 930.451 111.621 935.852 108.74C941.293 105.859 945.334 101.819 948.015 96.6578C950.695 91.4968 952.055 85.5757 952.055 78.8545C952.055 72.1333 950.695 66.1322 948.015 61.0512C945.334 55.9703 941.253 52.0096 935.772 49.169C930.291 46.3285 923.41 44.9283 915.009 44.9283H885.883V213.999H842.675H842.715Z" fill="#2563EB"/>
        <path d="M1072.08 217C1056.55 217 1043.19 213.679 1031.91 207.078C1020.63 200.437 1011.95 191.195 1005.83 179.313C999.704 167.431 996.664 153.628 996.664 137.945C996.664 122.263 999.704 108.26 1005.83 96.3778C1011.95 84.4956 1020.67 75.2539 1031.91 68.6127C1043.19 62.0115 1056.59 58.6909 1072.08 58.6909C1087.56 58.6909 1100.96 62.0115 1112.25 68.6127C1123.53 75.2539 1132.21 84.4956 1138.33 96.3778C1144.45 108.26 1147.49 122.103 1147.49 137.945C1147.49 153.788 1144.41 167.431 1138.33 179.313C1132.21 191.195 1123.53 200.437 1112.25 207.078C1100.96 213.679 1087.56 217 1072.08 217ZM1072.28 184.034C1079.32 184.034 1085.2 182.034 1089.96 177.993C1094.68 173.952 1098.24 168.471 1100.68 161.47C1103.12 154.469 1104.32 146.547 1104.32 137.625C1104.32 128.704 1103.12 120.742 1100.68 113.781C1098.24 106.82 1094.68 101.259 1089.96 97.218C1085.24 93.1772 1079.36 91.1369 1072.28 91.1369C1065.2 91.1369 1059.2 93.1772 1054.35 97.218C1049.51 101.259 1045.91 106.82 1043.47 113.781C1041.03 120.782 1039.83 128.704 1039.83 137.625C1039.83 146.547 1041.03 154.509 1043.47 161.47C1045.91 168.471 1049.51 173.952 1054.35 177.993C1059.2 182.034 1065.16 184.034 1072.28 184.034Z" fill="#2563EB"/>
        <path d="M1296.36 104.379L1257.43 106.78C1256.75 103.459 1255.35 100.459 1253.15 97.7381C1250.95 95.0576 1248.07 92.8972 1244.51 91.2569C1240.95 89.6166 1236.71 88.8164 1231.79 88.8164C1225.19 88.8164 1219.62 90.2167 1215.1 92.9772C1210.58 95.7377 1208.3 99.4184 1208.3 104.019C1208.3 107.7 1209.78 110.78 1212.7 113.301C1215.62 115.821 1220.66 117.862 1227.79 119.382L1255.55 124.983C1270.47 128.024 1281.56 132.985 1288.88 139.746C1296.2 146.507 1299.84 155.429 1299.84 166.511C1299.84 176.553 1296.88 185.354 1291 192.956C1285.12 200.557 1277.08 206.438 1266.83 210.679C1256.63 214.92 1244.87 217 1231.55 217C1211.26 217 1195.1 212.759 1183.1 204.278C1171.1 195.796 1164.05 184.234 1161.97 169.591L1203.78 167.391C1205.06 173.592 1208.1 178.273 1212.94 181.513C1217.78 184.754 1224.03 186.354 1231.63 186.354C1239.23 186.354 1245.07 184.914 1249.63 181.994C1254.19 179.113 1256.51 175.352 1256.55 170.752C1256.47 166.911 1254.87 163.71 1251.67 161.23C1248.47 158.749 1243.55 156.829 1236.91 155.509L1210.34 150.228C1195.38 147.227 1184.26 142.026 1176.98 134.665C1169.7 127.264 1166.05 117.862 1166.05 106.42C1166.05 96.5779 1168.74 88.0963 1174.1 80.975C1179.46 73.8537 1187.02 68.3727 1196.74 64.4919C1206.5 60.6512 1217.9 58.6909 1231.03 58.6909C1250.39 58.6909 1265.63 62.7716 1276.8 70.9731C1287.96 79.1346 1294.44 90.2967 1296.32 104.419L1296.36 104.379Z" fill="#2563EB"/>
        <path d="M1401.1 60.6911V92.617H1308.76V60.6911H1401.1ZM1329.73 23.9644H1372.25V166.871C1372.25 170.791 1372.85 173.832 1374.05 175.992C1375.25 178.153 1376.93 179.673 1379.09 180.513C1381.25 181.393 1383.78 181.793 1386.62 181.793C1388.62 181.793 1390.62 181.593 1392.62 181.233C1394.62 180.873 1396.14 180.593 1397.22 180.393L1403.9 212.039C1401.78 212.719 1398.78 213.479 1394.9 214.399C1391.06 215.28 1386.34 215.84 1380.81 216.04C1370.57 216.44 1361.61 215.08 1353.93 211.959C1346.25 208.838 1340.29 203.958 1336.01 197.396C1331.77 190.795 1329.65 182.514 1329.73 172.432V23.9644Z" fill="#2563EB"/>
      </g>
      <defs>
        <clipPath id="clip0_13004_30">
          <rect width="1435.14" height="217" fill="white"/>
        </clipPath>
      </defs>
    </svg>
    <div class="header-label">WEBSITE COMPLIANCE AUDIT</div>
  </div>

  <div class="page">

    <div class="report-practice-name">${escHtml(practiceName || 'Your Practice')}</div>
    <div class="report-date">Audit completed: ${auditDate}</div>

    <div class="score-card">
      <div class="score-label">Overall Compliance Score</div>
      <div class="score-value" style="color: ${scoreColor}">${score}%</div>
      <div class="score-interpretation">${scoreInterpretation}</div>
      <div class="score-bar-track">
        <div class="score-bar-fill" style="width: ${score}%; background-color: ${scoreColor};"></div>
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

    <div class="findings-header">
      <div class="findings-header-title">Page-by-Page Findings</div>
    </div>

    ${pageBlocksHtml}

    <div class="next-steps">
      <div class="next-steps-title">Recommended Next Steps</div>
      <div class="step">
        <div class="step-number">1</div>
        <div>
          <div class="step-title">Review High-Priority Issues</div>
          <div class="step-body">Address all findings marked HIGH first — these represent the greatest compliance risk under AHPRA and TGA advertising guidelines.</div>
        </div>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <div>
          <div class="step-title">Consult a Compliance Specialist</div>
          <div class="step-body">For complex findings or if you are unsure about the required changes, seek independent legal or compliance advice before making updates.</div>
        </div>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <div>
          <div class="step-title">Re-Audit After Changes</div>
          <div class="step-body">Once you have made the recommended changes, run a new SafePost audit to confirm your website meets current compliance standards.</div>
        </div>
      </div>
    </div>

    <div class="disclaimer">
      <strong>Important Disclaimer</strong>
      This report has been generated by SafePost using AI-powered analysis of publicly available website content. It is intended as a general compliance screening tool only and does not constitute legal advice. AHPRA and TGA advertising regulations are complex and subject to change. SafePost accepts no liability for any decisions made based on this report. Practitioners should seek independent legal or compliance advice before making changes to their advertising materials. For the most current AHPRA advertising guidelines, visit www.ahpra.gov.au.
    </div>

    <div class="footer">
      <div class="footer-brand">SafePost</div>
      <div class="footer-right">AI-powered AHPRA and TGA compliance &middot; www.safepost.com.au</div>
    </div>

  </div>

</body>
</html>\`;

  return htmlContent;
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
