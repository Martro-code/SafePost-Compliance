import React from 'react';
import { Check } from 'lucide-react';

const AuditWaitlistSection: React.FC = () => {
  const features = [
    'Guided page-by-page assessment across up to 6 website sections',
    'Checked against AHPRA advertising guidelines and TGA rules',
    'Severity-rated findings — High, Medium, and Low',
    'Recommended actions for each issue identified',
    'Downloadable audit report for your records',
  ];

  const scrollToPlans = () => {
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left column */}
          <div>
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-blue-600 bg-blue-100 rounded-full px-3 py-1 mb-5">
              Subscriber Add-On
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              Is your website compliant?
            </h2>
            <p className="text-[16px] text-gray-500 mb-10 leading-relaxed">
              Our <strong className="text-gray-700">Website Compliance Audit</strong> is a one-off, AI-powered review of your practice website — checked page by page against AHPRA advertising guidelines and TGA regulations. Available exclusively to SafePost subscribers as a one-time add-on.
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
                <p className="text-sm text-slate-400">(incl. GST)</p>
              </div>
              <hr className="border-slate-200" />
              <button
                onClick={scrollToPlans}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
              >
                Get Started — Subscribe to Access
              </button>
              <p className="text-xs text-slate-400 text-center">
                Available to all active SafePost subscribers. One-time payment of $149 per website.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AuditWaitlistSection;
