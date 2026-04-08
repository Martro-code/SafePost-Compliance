import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Check, ArrowRight, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from '../components/ui/SafePostLogo';
import FAQSection from '../components/ui/FAQSection';
import AuditWaitlistSection from '../components/ui/AuditWaitlistSection';
import PublicFooter from '../components/layout/PublicFooter';
import { trackUpgradeInitiated } from '../services/analytics';




const PricingMedicalPractitioners: React.FC = () => {
  const navigate = useNavigate();

  const [isYearly, setIsYearly] = useState(false);

  // Header state
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/">
            <SafePostLogo />
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
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
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in z-50">
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
                  <button onClick={() => navigate('/news')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    News
                  </button>
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

          {/* Right: Auth buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200">
              Login
            </button>
            <button onClick={() => navigate('/pricing/medical-practitioners')} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
              Sign up
            </button>
          </div>

          {/* Mobile: Hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-5 pt-2 border-t border-black/[0.06] space-y-1">
            <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Home
            </button>

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
                  <button onClick={() => { navigate('/news'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    News
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
                      onClick={() => setMobileMenuOpen(false)}
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
                Start free
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

      {/* Website Compliance Audit Waitlist */}
      <AuditWaitlistSection plan="medical_practitioner" />

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
