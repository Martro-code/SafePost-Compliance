import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import FAQSection from '../components/ui/FAQSection';
import PublicFooter from '../components/layout/PublicFooter';
import PublicHeader from '../components/layout/PublicHeader';
import { trackUpgradeInitiated } from '../services/analytics';

const PricingMedicalPractitioners: React.FC = () => {
  const navigate = useNavigate();

  const [isYearly, setIsYearly] = useState(false);

  // Header state

  const faqs = [
    {
      question: 'Can I try SafePost before paying?',
      answer: 'Yes \u2014 the Starter plan is free forever with 5 compliance checks. No credit card required.',
    },
    {
      question: 'What happens if I exceed my monthly check limit?',
      answer: 'When you reach your monthly check limit, you\u2019ll be prompted to upgrade to a higher plan. Your limit resets on the 1st of each month. We\u2019ll notify you when you\u2019re approaching your limit so you\u2019re never caught off guard.',
    },
    {
      question: 'Can I analyse content that includes images or before/after photos?',
      answer: 'Yes \u2014 SafePost Professional, Pro+, and Ultra all include image and video content analysis, which is particularly important for cosmetic procedure advertising. SafePost analyses visual content for compliance with AHPRA and TGA regulations around before/after photos, testimonials, and cosmetic procedure advertising. The free Starter plan supports text-based analysis only.',
    },
    {
      question: 'What happens if I cancel my subscription?',
      answer: 'You can cancel anytime from your account settings. You\u2019ll keep access until the end of your billing period.',
    },
    {
      question: 'Is my content stored or shared?',
      answer: 'Your checks are stored securely in your account only. Your content is never shared with third parties or used to train AI models.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      <Helmet>
        <title>Pricing for Practitioners — SafePost</title>
        <meta name="description" content="Simple, transparent pricing for individual Australian medical practitioners. Start checking your posts for AHPRA and TGA compliance today." />
      </Helmet>

      <PublicHeader />


      {/* Hero Section */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-10 md:pb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            AHPRA &amp; TGA compliance pricing for practitioners
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Choose the plan that's right for you
          </p>
        </div>
      </section>

      {/* Monthly/Yearly Toggle */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-12 md:pb-16">
          <div className="flex items-center justify-center gap-3">
            <span className={`text-[14px] font-medium transition-colors duration-200 ${!isYearly ? 'text-gray-900' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none"
              style={{ backgroundColor: isYearly ? '#3b82f6' : '#d1d5db' }}
            >
              <div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300"
                style={{ transform: isYearly ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
            <span className={`text-[14px] font-medium transition-colors duration-200 ${isYearly ? 'text-gray-900' : 'text-gray-400'}`}>
              Yearly
            </span>
          </div>
          <div className="flex items-center justify-center mt-4">
            <button onClick={() => navigate('/pricing/medical-practices')} className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors duration-200">
              &larr; Pricing for practices
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="plans" className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-4xl mx-auto px-6 pb-14 md:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Starter Card */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 md:p-10 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Starter</h3>
                <p className="text-[14px] text-gray-500">Perfect for trying out SafePost</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-extrabold text-gray-900">Free</span>
              </div>
              <ul className="space-y-3.5 mb-10 flex-grow">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">1 user included</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">5 compliance checks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Identify potentially non-compliant content</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">AI-powered suggested content rewrites</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Text-based analysis only (no image upload)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">No credit card required</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/signup?plan=starter')}
                className="w-full py-3 text-[15px] font-semibold text-gray-600 hover:text-gray-900 rounded-xl border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98]"
              >
                Get Started
              </button>
            </div>

            {/* Professional Card */}
            <div className="relative bg-white rounded-2xl border-2 border-blue-200 p-8 md:p-10 shadow-lg shadow-blue-600/[0.06] flex flex-col">
              <div className="absolute -top-3 right-6">
                <span className="text-[11px] font-semibold text-white bg-blue-600 px-3 py-1 rounded-full shadow-sm">
                  Most popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Professional</h3>
                <p className="text-[14px] text-gray-500">For practitioners who post regularly</p>
              </div>
              <div className="mb-8">
                <div className="flex items-end gap-2">
                  <span className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-none">{isYearly ? '$200' : '$20'}</span>
                  <span className="text-[15px] text-gray-500 font-medium leading-none pb-0.5">{isYearly ? '/year' : '/month (incl. GST)'}</span>
                </div>
                {isYearly && (
                  <p className="text-[12px] text-gray-400 mt-1.5 flex items-center gap-1.5">
                    $16/month
                    <span className="text-[11px] font-semibold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full leading-none">
                      2 months free
                    </span>
                  </p>
                )}
              </div>
              <ul className="space-y-3.5 mb-10 flex-grow">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">1 user included</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">20 compliance checks per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">AI-powered suggested content rewrites</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Image and video content analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Compliance history (last 20 checks)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Email support</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  trackUpgradeInitiated('professional', isYearly ? 'annual' : 'monthly');
                  navigate(`/signup?plan=professional&billing=${isYearly ? 'annual' : 'monthly'}`);
                }}
                className="w-full py-3 text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
              >
                Get Professional
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Website Compliance Audit */}
      <section className="w-full bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 pt-14 pb-14">
          <div className="text-center mb-10">
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-blue-600 bg-blue-100 rounded-full px-3 py-1 mb-5">
              One-time purchase
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              Is your website compliant?
            </h2>
            <p className="text-[16px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
              A one-time, AI-powered review of your practice website — available to everyone. No subscription required.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard */}
            <div className="bg-[#f7f7f4] rounded-2xl border border-slate-200 p-7 flex flex-col">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Standard</p>
              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-[38px] font-bold text-gray-900 leading-none">$149</span>
                <span className="text-[13px] text-gray-400">AUD (incl. GST)</span>
              </div>
              <ul className="space-y-2.5 mb-7 flex-grow">
                {[
                  'Page-by-page assessment — 6 pages',
                  'Checked against AHPRA and TGA rules',
                  'Severity-rated findings — High, Medium, Low',
                  'Recommended actions for each issue',
                  'Downloadable compliance report',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[13px] text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/audit')}
                className="w-full py-3 text-[14px] font-semibold text-gray-700 hover:text-gray-900 rounded-xl border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98]"
              >
                Get Standard Audit
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-2">
                Available to subscribers and standalone
              </p>
            </div>
            {/* Extended */}
            <div className="relative bg-white rounded-2xl border-2 border-blue-200 p-7 flex flex-col shadow-lg shadow-blue-600/[0.06]">
              <div className="absolute -top-3 right-5">
                <span className="text-[11px] font-semibold text-white bg-blue-600 px-3 py-1 rounded-full shadow-sm">
                  Best value
                </span>
              </div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Extended</p>
              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-[38px] font-bold text-gray-900 leading-none">$249</span>
                <span className="text-[13px] text-gray-400">AUD (incl. GST)</span>
              </div>
              <ul className="space-y-2.5 mb-7 flex-grow">
                {[
                  'Everything in Standard, plus:',
                  'Page-by-page assessment — up to 12 pages',
                  'Ideal for larger practice websites',
                ].map((f, idx) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className={`text-[13px] ${idx === 0 ? 'font-semibold text-gray-700' : 'text-gray-600'}`}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/audit')}
                className="w-full py-3 text-[14px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
              >
                Get Extended Audit
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-2">
                Available to subscribers and standalone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        innerClassName="max-w-4xl mx-auto px-6 pt-12 pb-16 md:pb-20"
        title="Frequently asked questions"
        items={faqs}
      />

      {/* Call to Action */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Ready to stay compliant?
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Start with 5 free compliance checks and see how SafePost can protect your practice
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 flex items-center justify-center gap-2.5 text-[15px] active:scale-[0.97] hover:shadow-blue-600/30 min-w-[180px]"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-7 py-3 text-[15px] font-semibold text-gray-600 hover:text-gray-900 rounded-xl border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.97] min-w-[180px]"
            >
              Login
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default PricingMedicalPractitioners;
