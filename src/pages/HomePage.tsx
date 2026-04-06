import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ShieldAlert, Star, Compass, Play, Layers, FileText, BadgeCheck, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from '../components/ui/SafePostLogo';
import FAQSection from '../components/ui/FAQSection';
import PublicFooter from '../components/layout/PublicFooter';



const socialIcons = [
  {
    label: "Facebook",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="Facebook">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="X / Twitter">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="LinkedIn">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="Instagram">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [customersDropdownOpen, setCustomersDropdownOpen] = useState(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      <Helmet>
        <title>SafePost — AI-Powered AHPRA &amp; TGA Compliance Checker</title>
        <meta name="description" content="Check your social media posts for AHPRA and TGA compliance in seconds. AI-powered analysis built for Australian medical practitioners and practices." />
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
                onClick={() => setCustomersDropdownOpen(!customersDropdownOpen)}
                onBlur={() => setTimeout(() => setCustomersDropdownOpen(false), 150)}
                className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Pricing
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${customersDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {customersDropdownOpen && (
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
                <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in">
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
                      <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-40" />
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
                      <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-40" />
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
        <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16 md:pb-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-gray-900 mb-6 text-balance">
              Navigate your online presence.{' '}
              <span className="text-[#2563EB]">Check your AHPRA and TGA compliance.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl">
              Instant social media and online advertising compliance checks for Australian medical practitioners and practices.
            </p>
          </div>
          {/* Hero image/banner placeholder — add your image here */}
          <div className="mt-12 md:mt-16" />
        </div>
      </section>

      {/* Why AHPRA Compliance Matters */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-14 text-center">
            Why AHPRA and TGA compliance matters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                <ShieldAlert className="w-7 h-7 text-blue-500/80" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                Protect your registration
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Non-compliant advertising can trigger AHPRA investigations and disciplinary action. Even unintentional breaches can lead to conditions on your registration, fines, or suspension — putting your entire career at risk.
              </p>
            </div>

            {/* Column 2 */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                <Star className="w-7 h-7 text-blue-500/80" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                Safeguard your professional reputation
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                AHPRA breaches become public record. Misleading claims or unprofessional conduct online can damage patient trust, impact referrals, and harm your practice's reputation in the community for years.
              </p>
            </div>

            {/* Column 3 */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                <Compass className="w-7 h-7 text-blue-500/80" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                Navigate complex guidelines with confidence
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                AHPRA and TGA advertising rules are intricate and constantly evolving. Manually checking every post against Section 133, prescription medicine prohibitions, and testimonial restrictions wastes valuable time — and mistakes are easy to make.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — 3 Steps */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
          <div className="text-center mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              How it works
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mt-4">
              Three simple steps to compliance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm text-center">
              <div className="text-5xl font-extrabold text-blue-600/20 mb-5">1</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                Add your content or URLs
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Paste your social media post, ad copy or website page URL directly into SafePost — no setup required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm text-center">
              <div className="text-5xl font-extrabold text-blue-600/20 mb-5">2</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                Get instant compliance analysis
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                SafePost analyses your content against 174 AHPRA and TGA rules and flags specific issues with direct references to the relevant guidelines.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm text-center">
              <div className="text-5xl font-extrabold text-blue-600/20 mb-5">3</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                Act on your results
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Receive severity-rated findings, suggested alternatives for posts and ads, and a full downloadable report for website audits — so you can publish with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities That May Trigger Ahpra Investigation */}
      <FAQSection
        title="Activities that may trigger investigation"
        subtitle="Online advertising and social media activities most likely to attract AHPRA and TGA scrutiny"
        groups={[
          {
            label: 'Advertising breaches — AHPRA and TGA',
            items: [
              {
                question: 'Patient testimonials and reviews',
                answer:
                  'Sharing or endorsing patient testimonials about clinical outcomes is prohibited under Section 133 of the Health Practitioner Regulation National Law Act 2009. This includes reposting Google reviews, featuring patient success stories, and posts that reference treatment results \u2014 even when the patient has given consent.',
              },
              {
                question: 'Before and after images',
                answer:
                  'Publishing before and after photos for cosmetic, surgical, or aesthetic procedures is explicitly prohibited under AHPRA\u2019s advertising guidelines. This applies to all platforms including Instagram, Facebook, and your practice website \u2014 regardless of whether images are anonymised or accompanied by disclaimers.',
              },
              {
                question: 'Unsubstantiated claims and superlatives',
                answer:
                  'Describing yourself or your practice as \u2018the best\u2019, \u2018leading\u2019, \u2018top-rated\u2019, or \u2018most experienced\u2019 without objective evidence constitutes misleading advertising. Claims about treatment outcomes, success rates, or comparative superiority that cannot be independently verified are a common trigger for AHPRA complaints.',
              },
              {
                question: 'Product and treatment endorsements',
                answer:
                  'Endorsing specific pharmaceutical products, medical devices, or cosmetic treatments on social media \u2014 including paid partnerships, gifted product posts, and affiliate arrangements \u2014 can breach both AHPRA advertising guidelines and TGA advertising requirements. Practitioners are held to a higher standard than general influencers.',
              },
            ],
          },
          {
            label: 'Social media conduct breaches',
            items: [
              {
                question: 'Social media conduct and professionalism',
                answer:
                  'Your professional obligations apply online as much as they do in the clinic. Posts made in a personal capacity \u2014 including complaints about colleagues, patients, or your workplace \u2014 can result in a formal AHPRA notification. Even accounts with no explicit link to your profession can be traced through the public register.',
              },
              {
                question: 'Patient confidentiality on social media',
                answer:
                  'Inadvertently disclosing patient information through social media is one of the most common compliance risks practitioners overlook. A photo, a comment, or even a combination of seemingly harmless details can be enough to identify a patient \u2014 triggering both an AHPRA notification and a privacy complaint.',
              },
              {
                question: 'Public health misinformation',
                answer:
                  'As a registered practitioner, your views carry authority. Posting, sharing, or endorsing content that contradicts established public health guidance or the best available scientific evidence can breach your Code of Conduct obligations \u2014 even when posted on a personal account.',
              },
            ],
          },
        ]}
      />

      <main className="flex-grow flex flex-col items-center">
        {/* How It Works — Video Demo */}
        <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
          <div className="max-w-6xl mx-auto px-6 pt-4 md:pt-6 pb-24 md:pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-stretch">
              {/* Left Column — Text Content */}
              <div className="space-y-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  See it in action
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                  See SafePost in action
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed">
                  Watch how SafePost identifies AHPRA and TGA compliance issues and generates suggested alternatives in seconds.
                </p>
                <p className="text-[15px] text-gray-400 leading-relaxed">
                  SafePost analyses your social media posts, advertising content and practice website against AHPRA and TGA advertising guidelines, highlights specific breaches with guideline references, and provides ready-to-use suggested alternatives.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 flex items-center justify-center gap-2.5 text-[15px] active:scale-[0.97] hover:shadow-blue-600/30"
                  >
                    Contact us
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/pricing/medical-practitioners')}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 flex items-center justify-center gap-2.5 text-[15px] active:scale-[0.97] hover:shadow-blue-600/30"
                  >
                    Get started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column — Video Player Placeholder */}
              <div className="w-full self-stretch">
                {/* Replace with actual video embed later */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-black/[0.06] shadow-lg shadow-black/[0.04] bg-gray-100">
                  {/* Placeholder — swap this div for a YouTube/Vimeo iframe */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/90 border border-black/[0.06] shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200">
                      <Play className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[11px] font-medium text-gray-400 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      Demo video coming soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Credibility Indicators */}
        <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
          <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-20 pb-24 md:pb-32">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                Built on official AHPRA and TGA guidelines
              </h2>
              <p className="text-lg text-gray-500">
                Comprehensive coverage you can trust
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1 — Comprehensive Coverage */}
              <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  <Layers className="w-7 h-7 text-blue-500/80" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  Comprehensive coverage
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  Analyses your posts, ads and website pages against Section 133 of the Health Practitioner Regulation National Law Act 2009, testimonial restrictions, before/after photo regulations, cosmetic procedure advertising rules, and professional conduct standards.
                </p>
              </div>

              {/* Column 2 — Official Guidelines */}
              <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  <FileText className="w-7 h-7 text-blue-500/80" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  Official guidelines
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  Based directly on AHPRA's Social Media Guidance and Advertising Guidelines and TGA's Therapeutic Goods Advertising Code. All compliance checks reference current regulations.
                </p>
              </div>

              {/* Column 3 — Trusted by Professionals */}
              <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  <BadgeCheck className="w-7 h-7 text-blue-500/80" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  Trusted by medical professionals
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  Designed specifically for Australian medical practitioners and practices navigating complex social media and advertising compliance requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full bg-white">
          <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              Try SafePost free today
            </h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
              Protect your practice with instant AHPRA and TGA social media, advertising and website compliance checks
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/pricing/medical-practitioners')}
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
      </main>

      <PublicFooter />
    </div>
  );
};

export default HomePage;
