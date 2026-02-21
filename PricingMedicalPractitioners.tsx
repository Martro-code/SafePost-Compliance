import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Check, ArrowRight, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';

const PricingMedicalPractitioners: React.FC = () => {
  const navigate = useNavigate();

  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Header state
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [pricingDropdownOpen, setPricingDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  const resourceLinks = [
    { label: 'Advertising hub', href: 'https://www.ahpra.gov.au/Resources/Advertising-hub.aspx' },
    { label: 'Code of conduct', href: 'https://www.medicalboard.gov.au/codes-guidelines-policies/code-of-conduct.aspx' },
    { label: 'TGA guidelines', href: 'https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media' },
  ];

  const faqs = [
    {
      question: 'Do I need to be AHPRA-registered to use SafePost\u2122?',
      answer: 'Yes, SafePost\u2122 is designed specifically for AHPRA-registered medical practitioners in Australia. Our compliance checks are based on Australian health practitioner advertising regulations and may not be applicable to practitioners in other jurisdictions.',
    },
    {
      question: 'Can SafePost\u2122 guarantee my content will be compliant?',
      answer: 'SafePost\u2122 is a guidance tool that helps identify potential compliance issues based on AHPRA\u2019s advertising guidelines and social media guidance. While we provide comprehensive analysis and compliant alternatives, AHPRA and the National Boards do not provide pre-approval for advertising. Registered health practitioners remain ultimately responsible for ensuring their content complies with the National Law.',
    },
    {
      question: 'What happens if I exceed my 3 free checks?',
      answer: 'Once you\u2019ve used your 3 compliance checks on the Starter plan, you\u2019ll need to upgrade to SafePost\u2122 Professional for unlimited checks. We\u2019ll send you a notification when you\u2019re exceeded your limit.',
    },
    {
      question: 'Can I analyse content that includes images or before/after photos?',
      answer: 'Yes! SafePost\u2122 Professional includes image and video content analysis, which is particularly important for cosmetic procedure advertising. Our AI analyses visual content for compliance with AHPRA\u2019s strict regulations around before/after photos, testimonials, and cosmetic procedure advertising. The free Starter plan only supports text-based analysis.',
    },
    {
      question: 'How quickly can I get compliance results?',
      answer: 'SafePost\u2122 provides instant compliance analysis \u2014 typically within 5\u201310 seconds. You\u2019ll immediately see flagged issues with specific AHPRA guideline references, and if you\u2019re on the Professional plan, you\u2019ll also receive AI-generated compliant alternatives you can use right away.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/">
            <SafePostLogo />
          </Link>

          {/* Center: Navigation */}
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
                    Medical Practitioners
                  </button>
                  <button onClick={() => navigate('/pricing/medical-practices')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Medical Practices
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
                    About
                  </button>
                  <a href="#" onClick={(e) => e.preventDefault()} className="block px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    News
                  </a>
                  <button onClick={() => navigate('/contact')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Contact us
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
          <div className="hidden md:flex items-center gap-2.5">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
              Sign Up
            </button>
          </div>

          {/* Mobile: Hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-5 pt-2 border-t border-black/[0.06] space-y-1">
            <button onClick={() => navigate('/features')} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Features
            </button>
            <button onClick={() => navigate('/pricing/medical-practitioners')} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Pricing
            </button>
            <a href="#" onClick={(e) => e.preventDefault()} className="block px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Company
            </a>

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
              <button onClick={() => navigate('/login')} className="w-full px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200">
                Login
              </button>
              <button onClick={() => navigate('/signup')} className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2.5 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-10 md:pb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Pricing for Medical Practitioners
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
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-4xl mx-auto px-6 pb-20 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Starter Card */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 md:p-10 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Starter</h3>
                <p className="text-[14px] text-gray-500">Perfect for trying out SafePost&trade;</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-extrabold text-gray-900">Free</span>
              </div>
              <ul className="space-y-3.5 mb-10 flex-grow">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">3 free compliance checks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Identify non-compliant content</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">No credit card required</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-3 text-[15px] font-semibold text-gray-600 hover:text-gray-900 rounded-xl border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98]"
              >
                Start Free
              </button>
            </div>

            {/* Professional Card */}
            <div className="relative bg-white rounded-2xl border-2 border-blue-200 p-8 md:p-10 shadow-lg shadow-blue-600/[0.06] flex flex-col">
              <div className="absolute -top-3 right-6">
                <span className="text-[11px] font-semibold text-white bg-blue-600 px-3 py-1 rounded-full shadow-sm">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Professional</h3>
                <p className="text-[14px] text-gray-500">For practitioners who post regularly</p>
              </div>
              <div className="mb-8">
                <div className="flex items-end gap-2">
                  <span className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-none">{isYearly ? '$16' : '$20'}</span>
                  <span className="text-[15px] text-gray-500 font-medium leading-none pb-0.5">/month</span>
                  {isYearly && (
                    <span className="text-[11px] font-semibold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full leading-none mb-0.5">
                      Save 20%
                    </span>
                  )}
                </div>
              </div>
              <ul className="space-y-3.5 mb-10 flex-grow">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Unlimited compliance checks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Compliant content rewrites (AI-generated alternatives)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Image and video content analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Compliance history tracking</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-3 text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] hover:shadow-blue-600/30"
              >
                Get Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-4xl mx-auto px-6 pb-24 md:pb-32">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <span className="text-[13px] text-gray-500 font-medium">Cancel anytime</span>
            <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-[13px] text-gray-500 font-medium">No long-term contracts</span>
            <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-[13px] text-gray-500 font-medium">Australian-based support</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-4xl mx-auto px-6 pb-24 md:pb-32">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-14 text-center">
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`rounded-xl border bg-white overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? 'border-black/[0.08] shadow-md shadow-black/[0.04]'
                      : 'border-black/[0.06] shadow-sm shadow-black/[0.02] hover:border-black/[0.1] hover:shadow-md hover:shadow-black/[0.04]'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group"
                  >
                    <span className="text-[15px] font-semibold text-gray-900 leading-snug pr-4">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                        isOpen ? 'bg-gray-100' : 'bg-gray-50 group-hover:bg-gray-100'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform duration-300 ease-in-out ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                  <div
                    className="transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: isOpen ? '500px' : '0px',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-[14px] text-gray-500 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Ready to stay compliant?
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Start with 3 free compliance checks and see how SafePost&trade; can protect your practice
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 flex items-center justify-center gap-2.5 text-[15px] active:scale-[0.97] hover:shadow-blue-600/30 hover:translate-y-[-1px] min-w-[180px]"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3 text-[15px] font-semibold text-gray-600 hover:text-gray-900 rounded-xl border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.97] min-w-[180px]"
            >
              Login
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f7f7f4] border-t border-black/[0.06] pt-14 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Footer Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
            {/* Features */}
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/features')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Features</button></li>
                <li><button onClick={() => navigate('/pricing/medical-practitioners')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Pricing</button></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Demo</a></li>
              </ul>
            </div>

            {/* Pricing */}
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Pricing</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/pricing/medical-practitioners')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Medical Practitioners</button></li>
                <li><button onClick={() => navigate('/pricing/medical-practices')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Medical Practices</button></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/about')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">About</button></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">News</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="https://www.ahpra.gov.au/Resources/Advertising-hub.aspx" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Advertising hub</a></li>
                <li><a href="https://www.medicalboard.gov.au/codes-guidelines-policies/code-of-conduct.aspx" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Code of conduct</a></li>
                <li><a href="https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">TGA guidelines</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Data Use</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Security</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/contact')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Contact us</button></li>
              </ul>
            </div>
          </div>

          {/* Disclaimer + Copyright */}
          <div className="mt-14 pt-6 border-t border-black/[0.06]">
            <p className="text-[10px] text-gray-400 leading-relaxed tracking-wide">
              Disclaimer: This application is an AI-powered guidance tool and does not constitute legal or regulatory advice.
              Ahpra and the National Boards do not provide pre-approval for advertising.
              Registered health practitioners are ultimately responsible for ensuring their advertising complies with the Health Practitioner Regulation National Law.
            </p>
            <p className="text-[11px] text-gray-400 mt-4">&copy; SafePost&trade; 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingMedicalPractitioners;
