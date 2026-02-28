import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Check, ArrowRight, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';

const PricingMedicalPractices: React.FC = () => {
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

  const resourcesDropdownRef = useRef<HTMLDivElement>(null);
  const resourcesContextMenuRef = useRef(false);

  // Close Resources dropdown when clicking outside (ignore right-click so users can copy URLs)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target as Node)) {
        setResourcesDropdownOpen(false);
      }
      resourcesContextMenuRef.current = false;
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const faqs = [
    {
      question: 'What\u2019s the difference between the plans for practices?',
      answer: 'The key differences are check volume, team size, and history access. Professional suits a solo practitioner posting regularly (30 checks/month). Pro+ suits a small practice with a marketing team (100 checks/month, up to 3 users). Ultra suits multi-practitioner practices running integrated campaigns (unlimited checks, up to 10 users, PDF audit export).',
    },
    {
      question: 'Can multiple staff members use the same SafePost\u2122 account?',
      answer: 'Yes \u2014 the Pro+ plan includes access for up to 3 team members, while the Ultra plan supports up to 10 team members. Each team member gets their own login, and all checks appear in a shared compliance history. Team accounts are ideal for practices where a practice manager and multiple practitioners all need compliance checking access.',
    },
    {
      question: 'Do you offer compliance checks for website content and online advertising?',
      answer: 'Yes \u2014 all paid plans include analysis of any online content including website copy, social media posts, paid advertising, and email marketing. SafePost\u2122 checks content against AHPRA advertising guidelines, the National Law, and TGA therapeutic goods advertising requirements where relevant.',
    },
    {
      question: 'How does SafePost\u2122 handle compliance for cosmetic procedures?',
      answer: 'SafePost\u2122 includes specialised analysis for cosmetic procedure advertising, which has particularly strict AHPRA requirements. We check for prohibited before/after photos, testimonial restrictions, outcome claims, practitioner title usage, cosmetic procedure terminology, and TGA obligations for therapeutic goods advertising.',
    },
    {
      question: 'Can I download a record of our compliance checks?',
      answer: 'Yes \u2014 Ultra plan subscribers can export their complete compliance history as a PDF audit log. This is useful for demonstrating a compliance process to insurers, legal advisers, or in the event of an AHPRA inquiry. All plans include in-app compliance history up to their plan limit.',
    },
    {
      question: 'Are prices in Australian dollars and do they include GST?',
      answer: 'Yes \u2014 all SafePost\u2122 prices are in AUD and include GST.',
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
                    About us
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
            <div className="relative" ref={resourcesDropdownRef} onMouseDown={(e) => { if (e.button === 2) resourcesContextMenuRef.current = true; }} onContextMenu={() => { resourcesContextMenuRef.current = true; }} onMouseLeave={() => { if (!resourcesContextMenuRef.current) { setResourcesDropdownOpen(false); } }}>
              <button
                onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
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
            <button onClick={() => navigate('/pricing/medical-practitioners')} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
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
              <button onClick={() => navigate('/pricing/medical-practitioners')} className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2.5 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
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
            Pricing for Medical Practices
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Choose the right plan for your practice
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
            <button onClick={() => navigate('/pricing/medical-practitioners')} className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors duration-200">
              &larr; Pricing for Medical Practitioners
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-4xl mx-auto px-6 pb-20 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pro+ Card */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 md:p-10 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Pro+</h3>
                <p className="text-[14px] text-gray-500">For practices with small marketing teams</p>
              </div>
              <div className="mb-8">
                <div className="flex items-end gap-2">
                  <span className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-none">{isYearly ? '~$41' : '$49'}</span>
                  <span className="text-[15px] text-gray-500 font-medium leading-none pb-0.5">/month</span>
                  {isYearly && (
                    <span className="text-[11px] font-semibold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full leading-none mb-0.5">
                      2 months free
                    </span>
                  )}
                </div>
                {isYearly && (
                  <p className="text-[12px] text-gray-400 mt-1.5">billed as $490/year</p>
                )}
              </div>
              <ul className="space-y-3.5 mb-10 flex-grow">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Everything in Professional, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">100 compliance checks per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Multi-user access (up to 3 team members)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Compliance history (last 100 checks)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Priority email support</span>
                </li>
              </ul>
              <button
                onClick={() => navigate(`/signup?plan=proplus&billing=${isYearly ? 'yearly' : 'monthly'}`)}
                className="w-full py-3 text-[15px] font-semibold text-gray-600 hover:text-gray-900 rounded-xl border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200 active:scale-[0.98]"
              >
                Get Pro+
              </button>
            </div>

            {/* Ultra Card */}
            <div className="relative bg-white rounded-2xl border-2 border-blue-200 p-8 md:p-10 shadow-lg shadow-blue-600/[0.06] flex flex-col">
              <div className="absolute -top-3 right-6">
                <span className="text-[11px] font-semibold text-white bg-blue-600 px-3 py-1 rounded-full shadow-sm">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Ultra</h3>
                <p className="text-[14px] text-gray-500">Best for multi-practitioner practices</p>
              </div>
              <div className="mb-8">
                <div className="flex items-end gap-2">
                  <span className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-none">{isYearly ? '~$124' : '$149'}</span>
                  <span className="text-[15px] text-gray-500 font-medium leading-none pb-0.5">/month</span>
                  {isYearly && (
                    <span className="text-[11px] font-semibold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full leading-none mb-0.5">
                      2 months free
                    </span>
                  )}
                </div>
                {isYearly && (
                  <p className="text-[12px] text-gray-400 mt-1.5">billed as $1,490/year</p>
                )}
              </div>
              <ul className="space-y-3.5 mb-10 flex-grow">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Everything in Pro+, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Unlimited compliance checks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Multi-user access (up to 10 team members)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Unlimited compliance history</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">PDF compliance audit log export</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Bulk content review (upload multiple posts at once)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Proactive notification of guideline changes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-gray-600">Priority support + onboarding</span>
                </li>
              </ul>
              <button
                onClick={() => navigate(`/signup?plan=ultra&billing=${isYearly ? 'yearly' : 'monthly'}`)}
                className="w-full py-3 text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] hover:shadow-blue-600/30"
              >
                Get Ultra
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-4xl mx-auto px-6 pb-24 md:pb-32">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-14 text-center">
            Frequently asked questions
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
            Get your practice set up with SafePost&trade; and keep your entire team compliant
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 flex items-center justify-center gap-2.5 text-[15px] active:scale-[0.97] hover:shadow-blue-600/30 min-w-[180px]"
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
          {/* Brand Zone */}
          <div className="flex flex-col items-start mb-10 pb-10 border-b border-black/[0.06]">
            <div className="text-[22px] font-extrabold tracking-tight leading-none mb-3">
              <span className="text-gray-900">Safe</span>
              <span className="text-[#2563EB]">Post</span>
              <span className="text-gray-400 text-[15px] font-medium ml-0.5">™</span>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed max-w-[360px]">
              Checks your online advertising and social media content against AHPRA's rules — before you publish, not after.
            </p>
          </div>

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
                <li><button onClick={() => navigate('/about')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">About us</button></li>
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
                <li><button onClick={() => navigate('/terms-of-use')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Terms of Use</button></li>
                <li><button onClick={() => navigate('/privacy-policy')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/cookie-policy')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Cookie Policy</button></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/contact')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Contact us</button></li>
              </ul>
              <div className="flex items-center gap-4 mt-4">
                {/* X / Twitter */}
                <div className="text-gray-400 cursor-not-allowed" title="Coming soon">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="X / Twitter">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                {/* Instagram */}
                <div className="text-gray-400 cursor-not-allowed" title="Coming soon">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="Instagram">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </div>
                {/* LinkedIn */}
                <div className="text-gray-400 cursor-not-allowed" title="Coming soon">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="LinkedIn">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                {/* Facebook */}
                <div className="text-gray-400 cursor-not-allowed" title="Coming soon">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="Facebook">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer + Copyright */}
          <div className="mt-14 pt-6 border-t border-black/[0.06]">
            <p className="text-[10px] text-gray-400 leading-relaxed tracking-wide">
              Disclaimer: This application is an AI-powered guidance tool and does not constitute legal or regulatory advice.
              AHPRA and the National Boards do not provide pre-approval for advertising.
              Registered health practitioners are ultimately responsible for ensuring their social media activities and advertising complies with the Health Practitioner Regulation National Law.
            </p>
            <p className="text-[11px] text-gray-400 mt-4">&copy; SafePost&trade; 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingMedicalPractices;
