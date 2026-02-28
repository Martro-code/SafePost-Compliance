import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown, Check, Loader2 } from 'lucide-react';
import LoggedInLayout from '../components/LoggedInLayout';

const faqs = [
  {
    question: "What does SafePost™ check my content against?",
    answer: "SafePost™ checks your content against 134 verified rules drawn from five primary AHPRA regulatory documents, two VCAT enforcement tribunal judgements, and guidance from the AMA and TGA. This includes the Health Practitioner Regulation National Law, the Good Medical Practice Code of Conduct, AHPRA advertising guidelines, and guidelines for cosmetic procedures and cosmetic surgery advertising."
  },
  {
    question: "Does a 'Compliant' result mean I am guaranteed to be compliant?",
    answer: "No. A compliant result from SafePost™ means no issues were identified based on our current knowledge base — it does not constitute legal advice or guarantee compliance with all applicable laws and regulations. AHPRA and the National Boards do not provide pre-approval for advertising. Registered health practitioners remain solely responsible for ensuring their content complies with the National Law and AHPRA guidelines. If in doubt, seek independent legal advice before publishing."
  },
  {
    question: "How many compliance checks do I get per month?",
    answer: "Your monthly check limit depends on your plan. Starter includes 3 checks per month, Professional includes 30, Pro+ includes 100, and Ultra includes unlimited checks. Your usage resets on the 1st of each month. You can view your current usage in the sidebar on your Dashboard."
  },
  {
    question: "Can I use SafePost™ to check image or video content?",
    answer: "Image attachment for analysis is available on paid plans — Professional, Pro+, and Ultra. You can attach an image to your compliance check using the Attach Image button in the compliance checker. Video content analysis is not currently supported."
  },
  {
    question: "How do I upgrade or change my plan?",
    answer: "You can change your plan at any time by going to My Account → Profile → Change Plan, or by clicking the Upgrade Your Plan button in the Dashboard sidebar. Changes take effect immediately and your billing will be adjusted accordingly."
  },
];

const Help: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission — replace with real email/form handler later
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
        {/* Back to Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Help & Support</h1>
          <p className="text-[14px] text-gray-500">Get help with SafePost™ or send us a message.</p>
        </div>

        {/* Section 1 — FAQ accordions */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden divide-y divide-gray-100">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50/60 transition-colors"
              >
                <span className="text-[14px] font-semibold text-gray-900">{faq.question}</span>
                {openFaq === i
                  ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                }
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5">
                  <p className="text-[13px] text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Section 2 — Contact form */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6 md:p-8 mt-8">
          <h2 className="text-[16px] font-bold text-gray-900 mb-1">Send us a message</h2>
          <p className="text-[13px] text-gray-500 mb-6">
            Can't find what you're looking for? We'll get back to you within 1 business day.
          </p>

          <div className="space-y-4">
            {/* Subject dropdown */}
            <div>
              <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5 block">
                Subject
              </label>
              <select className="w-full px-4 py-2.5 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                <option value="">Select a topic...</option>
                <option value="compliance">Compliance check question</option>
                <option value="billing">Billing or subscription</option>
                <option value="account">Account or login issue</option>
                <option value="feature">Feature request</option>
                <option value="bug">Report a bug</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message textarea */}
            <div>
              <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5 block">
                Message
              </label>
              <textarea
                placeholder="Describe your question or issue..."
                rows={5}
                className="w-full px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isSubmitted}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-[14px] font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isSubmitted
                ? <><Check className="w-4 h-4" />Message sent — we'll be in touch soon</>
                : isSubmitting
                ? <><Loader2 className="w-4 h-4 animate-spin" />Sending...</>
                : <>Send Message</>
              }
            </button>
          </div>
        </div>

        {/* Section 3 — Direct contact fallback */}
        <p className="text-center text-[13px] text-gray-400 mt-4">
          Or email us directly at{' '}
          <a href="mailto:info@safepost.com.au" className="text-blue-500 hover:text-blue-700">
            info@safepost.com.au
          </a>
        </p>
      </div>
    </LoggedInLayout>
  );
};

export default Help;
