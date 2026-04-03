import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface AuditWaitlistSectionProps {
  plan?: string;
}

const AuditWaitlistSection: React.FC<AuditWaitlistSectionProps> = ({ plan }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const openModal = async () => {
    // Pre-populate email if logged in
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setEmail(session.user.email);
      }
    } catch {
      // ignore — email stays empty
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setError('');
    if (!submitted) setEmail('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setError('');

    const { error: dbError } = await supabase
      .from('audit_waitlist')
      .insert({ email: trimmed, plan: plan ?? null });

    setSubmitting(false);

    if (dbError) {
      setError('Something went wrong. Please try again.');
      return;
    }

    setSubmitted(true);
  };

  const features = [
    'Guided page-by-page assessment of your website content',
    'Checked against 172 verified AHPRA and TGA rules',
    'Severity-rated findings for every page',
    'Recommended actions for each issue identified',
    'Consolidated PDF audit report for your records',
  ];

  return (
    <>
      {/* Waitlist Section */}
      <section className="w-full bg-white border-t border-slate-200 mb-32">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Left column */}
            <div>
              <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-blue-600 bg-blue-100 rounded-full px-3 py-1 mb-5">
                Coming soon
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                Is your website already compliant?
              </h2>
              <p className="text-[16px] text-gray-500 mb-10 leading-relaxed">
                We're launching a one-off <strong className="text-gray-700">Website Compliance Audit</strong> service — a thorough, expert review of your practice website against AHPRA advertising guidelines and TGA regulations.
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
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col gap-6 self-start sticky top-8">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-3">One-time fee</p>
                  <p className="text-5xl font-bold text-slate-900 mb-1">$149</p>
                  <p className="text-sm text-slate-500">per practice website</p>
                </div>
                <hr className="border-slate-200" />
                <button
                  onClick={openModal}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
                >
                  Register your interest
                </button>
                <p className="text-sm text-slate-500 text-center">
                  We'll notify you when the service is available. No payment required.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  By registering, you agree to receive a one-time notification email about this service. We won't add you to any mailing list without your consent.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-green-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-[20px] font-bold text-gray-900 mb-2">You're on the list!</h3>
                <p className="text-[14px] text-gray-500 mb-6">
                  We'll email you at <strong>{email}</strong> when the Website Compliance Audit service is ready.
                </p>
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-[20px] font-bold text-gray-900 mb-1">Register your interest</h3>
                <p className="text-[14px] text-gray-500 mb-6">
                  Enter your email and we'll notify you when the Website Compliance Audit service launches.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-12 px-4 text-[14px] text-gray-900 bg-white rounded-lg border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 mb-4"
                    autoFocus
                  />
                  {error && (
                    <p className="text-[13px] text-red-600 mb-3">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-[14px] font-semibold rounded-lg transition-colors"
                  >
                    {submitting ? 'Submitting…' : 'Notify me when available'}
                  </button>
                </form>

                <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
                  By registering, you agree to receive a one-time notification email about this service. We won't add you to any mailing list without your consent.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AuditWaitlistSection;
