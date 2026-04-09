import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import FAQSection from '../components/ui/FAQSection';
import PublicFooter from '../components/layout/PublicFooter';
import PublicHeader from '../components/layout/PublicHeader';

import LoggedInLayout from '../components/layout/LoggedInLayout';
import { useAuth } from '../hooks/useAuth';

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const featureList = [
    '174 specific AHPRA & TGA rules built in',
    'Exact guideline citations on every check',
    'Built specifically for Australian practitioners',
    'Full compliance history & audit trail',
    'No prompt engineering or expertise required',
    'Before/after photo analysis',
    'Page-by-page website compliance audit',
    'Star rating risk assessment',
    'Team access & shared history on Pro+ and Ultra plans',
  ];

  const faqGroups = [
    {
      label: 'About SafePost',
      items: [
        {
          question: 'Why was SafePost built?',
          answer: 'Australian medical practitioners and practices face real consequences for non-compliant social media content, online advertising and website content \u2014 from formal AHPRA complaints to TGA enforcement action. SafePost was built to give practitioners an instant, reliable way to check their content before publishing, without needing to read hundreds of pages of guidelines.',
        },
        {
          question: 'Who is SafePost for?',
          answer: 'SafePost is for any Australian health practitioner registered with AHPRA \u2014 including doctors, dentists, physiotherapists, psychologists, nurses, and more \u2014 as well as medical practices managing content across multiple practitioners.',
        },
        {
          question: 'Why not just use ChatGPT or other general AI tools?',
          answer: 'General AI tools don\u2019t know what AHPRA will investigate you for. SafePost is built with 174 specific AHPRA and TGA rules hardcoded into every analysis. Unlike ChatGPT, SafePost cites the exact guideline you\u2019ve breached, maintains a full audit trail, and is updated as Australian regulations change. For practitioners whose registration is at stake, a general AI guess isn\u2019t good enough.',
        },
        {
          question: 'Is SafePost affiliated with AHPRA or the TGA?',
          answer: 'No. SafePost is an independent compliance tool. It is not affiliated with, endorsed by, or connected to AHPRA or the TGA in any way.',
        },
      ],
    },
    {
      label: 'Compliance & Content',
      items: [
        {
          question: 'What types of content can I check?',
          answer: 'SafePost analyses social media posts, online advertising copy, website content, email marketing, and any other text-based content intended for public audiences. You can also attach images for visual content analysis including before/after photos and star ratings. Subscribers can also run a full Website Compliance Audit \u2014 a guided page-by-page review of their practice website for $149 AUD (incl. GST).',
        },
        {
          question: 'Can SafePost guarantee my content will be compliant?',
          answer: 'No tool can guarantee compliance \u2014 and you should be cautious of any that claims to. SafePost provides an AI-powered assessment based on current AHPRA and TGA guidelines. It significantly reduces your risk but does not replace professional legal advice for complex or high-stakes situations.',
        },
        {
          question: 'How does SafePost handle before/after photos?',
          answer: 'Before/after photos are assessed under AHPRA\u2019s specific prohibition on such imagery in health practitioner advertising. SafePost flags these under the correct AHPRA framework and provides guidance on suggested alternatives.',
        },
        {
          question: 'How current are the compliance rules?',
          answer: 'SafePost\u2019s rules database is updated when AHPRA or TGA publish significant guideline changes. The current version covers 174 rules across both frameworks.',
        },
      ],
    },
    {
      label: 'Plans & Billing',
      items: [
        {
          question: 'Can I try SafePost before paying?',
          answer: 'Yes \u2014 the Starter plan is free with 5 compliance checks included. No credit card required.',
        },
        {
          question: 'Can I upgrade or downgrade my plan at any time?',
          answer: 'Yes. You can change your plan at any time from your account settings. Upgrades take effect immediately. Downgrades take effect at the start of your next billing period.',
        },
        {
          question: 'What happens if I cancel?',
          answer: 'You can cancel at any time. You\u2019ll retain access to your plan until the end of your current billing period. Your compliance history remains accessible after cancellation.',
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We assess refund requests on a case by case basis. Contact us at support@safepost.com.au within 7 days of a charge if you believe a refund is warranted.',
        },
      ],
    },
    {
      label: 'Privacy & Security',
      items: [
        {
          question: 'Is my content stored or shared?',
          answer: 'Your compliance checks are stored securely in your account history so you can reference them later. Your content is never shared with third parties or used to train AI models.',
        },
        {
          question: 'Is SafePost secure?',
          answer: 'Yes. SafePost uses Supabase for authentication and database management, with row-level security ensuring your data is only accessible to you. All data is encrypted in transit and at rest.',
        },
        {
          question: 'Who can see my compliance checks?',
          answer: 'Only you \u2014 and team members you explicitly invite on Pro+ and Ultra plans. SafePost staff do not access your compliance check content.',
        },
      ],
    },
  ];

  const contentSection = (
    <>
      {/* Hero Section */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Got questions about AHPRA &amp; TGA compliance?
          </h1>
          <p className="text-lg text-gray-500">
            Everything you need to know about SafePost, AHPRA and TGA compliance, and how it all works
          </p>
        </div>
      </section>

      {/* Comparison Section — Two Column Layout */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-16 md:pb-20">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
            WHY SAFEPOST
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-stretch">
            {/* Left Column — Text Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                Built for compliance, not conversation
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                ChatGPT doesn't know what AHPRA will investigate you for. SafePost does.
              </p>
              <p className="text-[15px] text-gray-400 leading-relaxed">
                Every analysis cites the exact guideline breached — not a general opinion, but a specific AHPRA or TGA rule reference.
              </p>
              <p className="text-[15px] text-gray-400 leading-relaxed">
                Every compliance check is logged in your account history, giving you documented evidence of due diligence if AHPRA ever investigates.
              </p>
              <p className="text-[15px] text-gray-400 leading-relaxed">
                174 AHPRA and TGA rules are built into every check. Paste your content and get a compliance assessment in seconds — no prompting, no expertise required.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/pricing/medical-practitioners')}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 flex items-center justify-center gap-2.5 text-[15px] active:scale-[0.97] hover:shadow-blue-600/30"
                >
                  Get started free
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/features')}
                  className="w-full sm:w-auto px-7 py-3 text-[15px] font-semibold text-gray-600 hover:text-gray-900 rounded-xl border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.97]"
                >
                  See all features
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column — Feature List */}
            <div className="w-full">
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm shadow-black/[0.02] p-8 md:p-10 h-full flex flex-col justify-between">
                {featureList.map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" stroke="white" />
                    <span className="text-[15px] text-gray-700 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordions */}
      <FAQSection
        innerClassName="max-w-4xl mx-auto px-6 pt-12 pb-16 md:pb-20"
        title="Frequently asked questions"
        groups={faqGroups}
      />

      {/* Closing CTA */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Our team is here to help. Reach out and we'll get back to you within one business day
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 flex items-center justify-center gap-2.5 text-[15px] active:scale-[0.97] hover:shadow-blue-600/30 min-w-[180px]"
            >
              Contact us
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
    </>
  );

  if (!loading && user) {
    return (
      <LoggedInLayout>
        {contentSection}
      </LoggedInLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      <Helmet>
        <title>FAQ — SafePost Compliance Checker</title>
        <meta name="description" content="Answers to common questions about how SafePost works, what it checks, AHPRA and TGA advertising rules, and your subscription." />
      </Helmet>

      <PublicHeader />


      {contentSection}

      <PublicFooter />
    </div>
  );
};

export default FAQ;
