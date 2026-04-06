import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Menu, X, ExternalLink, ScanSearch, Flag, Wand2, Scale, MonitorSmartphone, History, Check } from 'lucide-react';
import SafePostLogo from '../components/ui/SafePostLogo';
import heroImage from '../assets/features-hero.png';
import PublicFooter from '../components/layout/PublicFooter';

// Preload the hero image so the browser fetches it before React renders the <img>
const preloadLink = document.createElement('link');
preloadLink.rel = 'preload';
preloadLink.as = 'image';
preloadLink.href = heroImage;
document.head.appendChild(preloadLink);



const Features: React.FC = () => {
  const navigate = useNavigate();

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


  const features = [
    {
      icon: <ScanSearch className="w-7 h-7 text-blue-500/80" />,
      heading: 'Instant analysis',
      description: 'Checked against 174 rules across AHPRA and TGA regulatory documents. Not a summarised guide — primary sources only.',
    },
    {
      icon: <Flag className="w-7 h-7 text-blue-500/80" />,
      heading: 'Severity-tiered issue flags',
      description: 'Every issue rated Critical, Warning, or Professional Conduct Risk with a plain-English explanation and the specific guideline reference.',
    },
    {
      icon: <Wand2 className="w-7 h-7 text-blue-500/80" />,
      heading: 'AI-powered rewrites',
      description: 'Three compliant alternatives generated instantly. Available on all plans including Starter.',
    },
    {
      icon: <Scale className="w-7 h-7 text-blue-500/80" />,
      heading: 'Real enforcement precedent',
      description: 'Analysis draws on tribunal cases — giving you context for what AHPRA and TGA actually pursue.',
    },
    {
      icon: <MonitorSmartphone className="w-7 h-7 text-blue-500/80" />,
      heading: 'Multi-platform support',
      description: 'Check Instagram, Facebook, website copy, Google ads, and any other online advertising content.',
    },
    {
      icon: <History className="w-7 h-7 text-blue-500/80" />,
      heading: 'Compliance history',
      description: 'Every check saved automatically. Search and revisit past checks to demonstrate your compliance process.',
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
        <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Powerful compliance checking, simplified
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-3xl mx-auto">
            Everything you need to ensure your content meets AHPRA and TGA guidelines
          </p>
        </div>
      </section>

      {/* Hero Image */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-2xl mx-auto px-6 mb-16 md:mb-20">
          <img
            src={heroImage}
            alt="SafePost Features"
            loading="eager"
            fetchPriority="high"
            width={1507}
            height={470}
            className="w-full h-auto rounded-2xl border border-black/[0.06] shadow-lg shadow-black/[0.04]"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                  {feature.heading}
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Social Media Section */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left Column — Text Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                Social media is advertising
              </h2>
              <p className="text-[15px] text-gray-600 leading-relaxed">
                Any social media activity intended to attract patients, promote services, or drive engagement with your practice is considered advertising under Australian law. This applies to all platforms and includes both public posts and closed channels such as private Facebook groups or dark marketing, unless they meet strict health professional-only access requirements.
              </p>
              <h3 className="text-lg font-bold text-gray-900">What the rules cover</h3>
              <p className="text-[15px] text-gray-600 leading-relaxed">
                Both AHPRA and the TGA regulate what you can say online. AHPRA&rsquo;s National Law prohibits false or misleading claims, patient testimonials, and content that creates unreasonable expectations about treatment results. The TGA&rsquo;s Advertising Code adds additional requirements whenever a post promotes medicines, medical devices, or supplements.
              </p>
            </div>

            {/* Right Column — Platform List */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { category: 'Social networking', platforms: 'Facebook, X, WeChat, Weibo, WhatsApp' },
                { category: 'Professional networking', platforms: 'LinkedIn, Yammer' },
                { category: 'Discussion forums', platforms: 'Reddit, Whirlpool, Discord, Quora' },
                { category: 'Media sharing', platforms: 'YouTube, Flickr, Instagram, TikTok, Pinterest' },
                { category: 'Microblogging', platforms: 'Tumblr, Blogger, X' },
                { category: 'Audio publishing', platforms: 'Spotify, iTunes, Podcasts' },
                { category: 'Text publishing', platforms: 'Blogs, SlideShare' },
                { category: 'Knowledge aggregation', platforms: 'Wikipedia' },
                { category: 'Booking sites & apps', platforms: 'HealthEngine, Whitecoat, Podium' },
              ].map((item, index) => (
                <div key={index} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <span className="font-semibold text-slate-800 text-[14px]">{item.category}</span>
                  <p className="text-[13px] text-slate-500 mt-1">{item.platforms}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Website Compliance Audit */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">

            {/* Left — mock audit result card */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Audit report</p>
                  <p className="text-[15px] font-bold text-slate-800">drsarahchen.com.au</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Score</p>
                  <p className="text-2xl font-extrabold text-slate-800">74<span className="text-[14px] font-semibold text-slate-400">/100</span></p>
                </div>
              </div>

              <div className="flex gap-3 mb-5">
                <div className="flex-1 bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                  <p className="text-xl font-extrabold text-green-700">12</p>
                  <p className="text-[11px] font-semibold text-green-600 uppercase tracking-widest mt-0.5">Pass</p>
                </div>
                <div className="flex-1 bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                  <p className="text-xl font-extrabold text-amber-600">3</p>
                  <p className="text-[11px] font-semibold text-amber-500 uppercase tracking-widest mt-0.5">Warning</p>
                </div>
                <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                  <p className="text-xl font-extrabold text-red-600">2</p>
                  <p className="text-[11px] font-semibold text-red-500 uppercase tracking-widest mt-0.5">Fail</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[13px] font-bold text-slate-800">Homepage — Before &amp; After claim</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-100 rounded-full px-2 py-0.5">High</span>
                  </div>
                  <p className="text-[12px] text-slate-500">Testimonial implies a guaranteed outcome. Likely breaches AHPRA advertising guidelines.</p>
                </div>
                <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[13px] font-bold text-slate-800">Services page — Unqualified superlative</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-100 rounded-full px-2 py-0.5">Medium</span>
                  </div>
                  <p className="text-[12px] text-slate-500">"Leading provider" language requires substantiation under TGA guidelines.</p>
                </div>
                <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[13px] font-bold text-slate-800">About page — Unapproved indication</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-100 rounded-full px-2 py-0.5">Medium</span>
                  </div>
                  <p className="text-[12px] text-slate-500">Treatment described for an indication not listed on the TGA register.</p>
                </div>
              </div>
            </div>

            {/* Right — feature text */}
            <div className="md:pt-2">
              <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-blue-600 bg-blue-100 rounded-full px-3 py-1 mb-5">New</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-5 leading-[1.15]">
                Your website is advertising too
              </h2>
              <p className="text-[16px] md:text-[17px] text-gray-500 leading-relaxed mb-8">
                Every page of your practice website is subject to AHPRA and TGA advertising rules — not just your social posts. The Website Compliance Audit scans your entire site and surfaces issues before a regulator does.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Scans every page of your practice website',
                  'Identifies before & after claims, testimonials, and superlatives',
                  'Checks for unapproved TGA indications',
                  'Flags unsubstantiated comparative language',
                  'Delivers a scored report with per-page findings',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <span className="text-[14px] text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/pricing/medical-practitioners" className="text-[14px] font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2">
                View pricing and add to your subscription →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Join practitioners and practices across Australia using SafePost for compliance confidence
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

      <PublicFooter />
    </div>
  );
};

export default Features;
