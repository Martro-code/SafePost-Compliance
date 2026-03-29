/**
 * ComplianceResultAsset — standalone marketing card for screenshot use.
 * Matches the non_compliant verdict card in ComplianceResults.tsx exactly.
 * Rendered at a fixed width; screenshot and use as a Features page image.
 */
import React from 'react';
import { XCircle } from 'lucide-react';

const ComplianceResultAsset: React.FC = () => {
  return (
    /* Outer centering wrapper — remove before screenshotting if you want
       just the card with no surrounding space. */
    <div className="flex items-center justify-center min-h-screen bg-white p-12">
      {/* Card — matches verdictConfig.non_compliant in ComplianceResults.tsx */}
      <div
        className="w-[680px] rounded-2xl border border-red-200 bg-red-50 px-7 py-6"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
      >
        {/* ── Header row ─────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">

          {/* Left: icon + label + heading */}
          <div className="flex items-center gap-4">
            {/* Circle-X icon box */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>

            {/* Label + heading */}
            <div>
              <p
                className="text-[11px] font-semibold tracking-widest text-red-700 uppercase mb-0.5"
              >
                Assessment
              </p>
              <h2 className="text-[26px] font-bold leading-tight text-red-800">
                Non-compliant
              </h2>
            </div>
          </div>

          {/* Right: severity pill badge */}
          <div className="flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-red-300 bg-red-50 text-red-600 text-[13px] font-semibold">
              <XCircle className="w-3.5 h-3.5" />
              3 Critical
            </span>
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <div className="mt-5 mb-4 border-t border-red-200/70" />

        {/* ── Summary body ────────────────────────────────────────────────── */}
        <p className="text-[15px] leading-relaxed text-red-800/75">
          This post contains a critical TGA breach — compounded tirzepatide is a
          prescription medicine that cannot be advertised to the public. Additionally,
          the post makes specific weight loss claims that create unreasonable
          expectations and constitute misleading advertising under the National Law.
        </p>
      </div>
    </div>
  );
};

export default ComplianceResultAsset;
