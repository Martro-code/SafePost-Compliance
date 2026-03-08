import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';
import FAQSection from './components/FAQSection';
import PublicFooter from './components/PublicFooter';
import AnnouncementBanner from './components/AnnouncementBanner';

const FAQ: React.FC = () => {
  const navigate = useNavigate();

  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [pricingDropdownOpen, setPricingDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [mobilePricingOpen, setMobilePricingOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);

  const resourceLinks = [
    { label: 'Advertising Hub', href: 'https://www.ahpra.gov.au/Resources/Advertising-hub.aspx' },
    { label: 'Code of Conduct', href: 'https://www.medicalboard.gov.au/codes-guidelines-policies/code-of-conduct.aspx' },
    { label: 'TGA Guidelines', href: 'https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media' },
  ];

  const comparisonRows = [
    { feature: 'Knows current AHPRA rules', generic: 'General knowledge only', safepost: '166 specific rules' },
    { feature: 'Cites exact guideline breached', generic: 'No', safepost: 'Yes, every time' },
    { feature: 'Built for Australian practitioners', generic: 'No', safepost: 'Yes' },
    { feature: 'Compliance history & audit trail', generic: 'No', safepost: 'Yes' },
    { feature: 'Requires prompt engineering', generic: 'Yes \u2014 you must explain the rules', safepost: 'No \u2014 paste and check' },
    { feature: 'Understands TGA advertising rules', generic: 'Partially', safepost: 'Yes' },
    { feature: 'Before/after photo analysis', generic: 'No', safepost: 'Yes' },
    { feature: 'Star rating risk assessment', generic: 'No', safepost: 'Yes' },
    { feature: 'Team access & shared history', generic: 'No', safepost: 'Yes' },
  ];

  const faqGroups = [
    {
      label: 'About SafePost',
      items: [
        {
          question: 'Why was SafePost built?',
          answer: 'Australian medical practitioners face real consequences for non-compliant social media content \u2014 from formal AHPRA complaints to TGA enforcement action. SafePost was built to give practitioners an instant, reliable way to check their content before posting, without needing to read hundreds of pages of guidelines.',
        },
        {
          question: 'Who is SafePost for?',
          answer: 'SafePost is for any Australian health practitioner registered with AHPRA \u2014 including doctors, dentists, physiotherapists, psychologists, nurses, and more \u2014 as well as medical practices managing content across multiple practitioners.',
        },
        {
          question: 'Why not just use ChatGPT or Google Gemini?',
          answer: 'General AI tools don\u2019t know what AHPRA will investigate you for. SafePost is built with 166 specific AHPRA and TGA rules hardcoded into every analysis. Unlike ChatGPT, SafePost cites the exact guideline you\u2019ve breached, maintains a full audit trail, and is updated as Australian regulations change. For practitioners whose registration is at stake, a general AI guess isn\u2019t good enough.',
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
          answer: 'SafePost analyses social media posts, online advertising copy, website content, email marketing, and any other text-based content intended for public audiences. You can also attach images for visual content analysis including before/after photos and star ratings.',
        },
        {
          question: 'Can SafePost guarantee my content will be compliant?',
          answer: 'No tool can guarantee compliance \u2014 and you should be cautious of any that claims to. SafePost provides an AI-powered assessment based on current AHPRA and TGA guidelines. It significantly reduces your risk but does not replace professional legal advice for complex or high-stakes situations.',
        },
        {
          question: 'How does SafePost handle before/after photos?',
          answer: 'Before/after photos are assessed under AHPRA\u2019s specific prohibition on such imagery in health practitioner advertising. SafePost flags these under the correct AHPRA framework and provides guidance on compliant alternatives.',
        },
        {
          question: 'How current are the compliance rules?',
          answer: 'SafePost\u2019s rules database is updated when AHPRA or TGA publish significant guideline changes. The current version covers 166 rules across both frameworks.',
        },
      ],
    },
    {
      label: 'Plans & Billing',
      items: [
        {
          question: 'Can I try SafePost before paying?',
          answer: 'Yes \u2014 the Starter plan is free forever with 3 compliance checks included. No credit card required.',
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      <AnnouncementBanner />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <SafePostLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <button onClick={() => navigate('/features')} className="px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Features
            </button>
            <div className="relative">
              <button
                onClick={() => setPricingDropdownOpen(!pricingDropdownOpen)}
                onBlur={() => setTimeout(() => setPricingDropdownOpen(false), 150)}
                className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Pricing
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${pricingDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {pricingDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in">
                  <button onClick={() => navigate('/pricing/medical-practitioners')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Practitioners
                  </button>
                  <button onClick={() => navigate('/pricing/medical-practices')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Practices
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                onBlur={() => setTimeout(() => setCompanyDropdownOpen(false), 150)}
                className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Company
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${companyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {companyDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in">
                  <button onClick={() => navigate('/about')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    About Us
                  </button>
                  <a href="#" onClick={(e) => e.preventDefault()} className="block px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    News
                  </a>
                  <button onClick={() => navigate('/contact')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Contact Us
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                onBlur={() => setTimeout(() => setResourcesDropdownOpen(false), 150)}
                className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Resources
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {resourcesDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in">
                  <button onClick={() => { navigate('/faq'); setResourcesDropdownOpen(false); }} className="block w-full text-left px-4 py-2.5 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    FAQ
                  </button>
                  {resourceLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 flex-shrink-0 ml-2 opacity-40" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200">
              Login
            </button>
            <button onClick={() => navigate('/pricing/medical-practitioners')} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
              Sign up
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-5 pt-2 border-t border-black/[0.06] space-y-1">
            <button onClick={() => { navigate('/features'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Features
            </button>

            {/* Mobile Pricing Dropdown */}
            <div>
              <button
                onClick={() => setMobilePricingOpen(!mobilePricingOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Pricing
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobilePricingOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: mobilePricingOpen ? '300px' : '0px',
                  opacity: mobilePricingOpen ? 1 : 0,
                }}
              >
                <div className="pl-4 space-y-0.5 pt-1">
                  <button onClick={() => { navigate('/pricing/medical-practitioners'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    Practitioners
                  </button>
                  <button onClick={() => { navigate('/pricing/medical-practices'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    Practices
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Company Dropdown */}
            <div>
              <button
                onClick={() => setMobileCompanyOpen(!mobileCompanyOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Company
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileCompanyOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: mobileCompanyOpen ? '300px' : '0px',
                  opacity: mobileCompanyOpen ? 1 : 0,
                }}
              >
                <div className="pl-4 space-y-0.5 pt-1">
                  <button onClick={() => { navigate('/about'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    About Us
                  </button>
                  <button onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    Contact Us
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Resources Dropdown */}
            <div>
              <button
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Resources
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: mobileResourcesOpen ? '300px' : '0px',
                  opacity: mobileResourcesOpen ? 1 : 0,
                }}
              >
                <div className="pl-4 space-y-0.5 pt-1">
                  <button onClick={() => { navigate('/faq'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    FAQ
                  </button>
                  {resourceLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 flex-shrink-0 ml-2 opacity-40" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-3 border-t border-black/[0.06] flex flex-col gap-2">
              <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200">
                Login
              </button>
              <button onClick={() => { navigate('/pricing/medical-practitioners'); setMobileMenuOpen(false); }} className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2.5 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Got questions? We've got answers.
          </h1>
          <p className="text-lg text-gray-500">
            Everything you need to know about SafePost, AHPRA compliance, and how it all works.
          </p>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-4xl mx-auto px-6 pb-24 md:pb-32">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              See how SafePost compares
            </h2>
            <p className="text-lg text-gray-500">
              General AI tools are built for conversation. SafePost is built for compliance.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden shadow-sm shadow-black/[0.02]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <th className="text-left px-6 py-4 text-[13px] font-semibold text-gray-900">Feature</th>
                    <th className="text-left px-6 py-4 text-[13px] font-semibold text-gray-500">ChatGPT / Gemini</th>
                    <th className="text-left px-6 py-4 text-[13px] font-semibold text-blue-600">SafePost</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={i} className={i < comparisonRows.length - 1 ? 'border-b border-black/[0.04]' : ''}>
                      <td className="px-6 py-4 text-[14px] text-gray-900 font-medium">{row.feature}</td>
                      <td className="px-6 py-4 text-[14px] text-red-400">
                        <span className="flex items-center gap-2">
                          <span className="text-red-400">{'\u274C'}</span>
                          <span className="text-red-400/80">{row.generic}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-green-600">
                        <span className="flex items-center gap-2">
                          <span className="text-green-500">{'\u2705'}</span>
                          <span className="text-green-600">{row.safepost}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordions */}
      <FAQSection
        title="Frequently asked questions"
        groups={faqGroups}
      />

      {/* Closing CTA */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Our team is here to help. Reach out and we'll get back to you within one business day.
          </p>
          <div className="flex items-center justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 flex items-center justify-center gap-2.5 text-[15px] active:scale-[0.97] hover:shadow-blue-600/30 min-w-[180px]"
            >
              Contact us
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default FAQ;
