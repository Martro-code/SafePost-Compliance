import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from '../components/ui/SafePostLogo';
import FAQSection from '../components/ui/FAQSection';
import PublicFooter from '../components/layout/PublicFooter';

const ComplianceHub: React.FC = () => {
  const navigate = useNavigate();

  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [pricingDropdownOpen, setPricingDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
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
        <title>Compliance Hub — AHPRA &amp; TGA Advertising Rules</title>
        <meta name="description" content="Everything Australian medical practitioners need to know about AHPRA and TGA advertising compliance — what counts as advertising, what activities trigger investigations, and what the rules cover." />
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
            <div className="relative">
              <button
                onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                onBlur={() => setTimeout(() => setProductDropdownOpen(false), 150)}
                className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Product
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {productDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in">
                  <button onClick={() => navigate('/features')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Features
                  </button>
                  <button onClick={() => navigate('/compliance-hub')} className="block w-full text-left px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Compliance hub
                  </button>
                </div>
              )}
            </div>
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
            mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-5 pt-2 border-t border-black/[0.06] space-y-1">
            <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Home
            </button>

            {/* Mobile Product Dropdown */}
            <div>
              <button
                onClick={() => setMobileProductOpen(!mobileProductOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Product
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileProductOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: mobileProductOpen ? '300px' : '0px',
                  opacity: mobileProductOpen ? 1 : 0,
                }}
              >
                <div className="pl-4 space-y-0.5 pt-1">
                  <button onClick={() => { navigate('/features'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    Features
                  </button>
                  <button onClick={() => { navigate('/compliance-hub'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">
                    Compliance hub
                  </button>
                </div>
              </div>
            </div>

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
            AHPRA &amp; TGA compliance hub
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-3xl mx-auto">
            What counts as advertising, which platforms are covered, and what activities are most likely to trigger an AHPRA or TGA investigation
          </p>
        </div>
      </section>

      {/* Social Media Is Advertising Section */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-16 md:pb-20">
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

      {/* Activities That May Trigger Investigation */}
      <FAQSection
        title="Activities that may trigger investigation"
        subtitle="Online advertising and social media activities most likely to attract AHPRA and TGA scrutiny"
        groups={[
          {
            label: 'Advertising breaches \u2014 AHPRA and TGA',
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

      {/* Call to Action */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Check your content before you post
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            SafePost checks your social media posts and advertising against 174 AHPRA and TGA rules in seconds
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

export default ComplianceHub;
