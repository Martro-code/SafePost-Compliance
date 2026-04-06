import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const AuditWaitlistSection: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    'Guided page-by-page assessment across up to 6 website sections',
    'Checked against AHPRA advertising guidelines and TGA rules',
    'Severity-rated findings — High, Medium, and Low',
    'Recommended actions for each issue identified',
    'Downloadable audit report for your records',
  ];

  return (
    <section className="w-full bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left column */}
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              Is your website already compliant?
            </h2>
            <p className="text-[16px] text-gray-500 mb-10 leading-relaxed">
              Our <strong className="text-gray-700">Website Compliance Audit</strong> is a one-off, AI-powered review of your practice website — checked page by page against AHPRA advertising guidelines and TGA regulations. Get a full report with severity-rated findings and actionable recommendations.
            </p>
            <ul className="space-y-3.5">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600 leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column */}
          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col gap-6 self-start">
              <div>
                <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-3">One-time payment</p>
                <p className="text-5xl font-bold text-slate-900 mb-1">$149 <span className="text-lg font-normal text-slate-400">AUD</span></p>
                <p className="text-sm text-slate-400 mb-1">(incl. GST)</p>
                <p className="text-sm text-slate-500">per practice website</p>
              </div>
              <hr className="border-slate-200" />
              <button
                onClick={() => navigate('/audit')}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
              >
                Purchase Audit
              </button>
              <p className="text-xs text-slate-400 text-center">
                One-time payment. Instant access. No subscription required.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AuditWaitlistSection;
