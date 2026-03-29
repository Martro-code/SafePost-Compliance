import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from '../components/ui/SafePostLogo';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { useAuth } from '../hooks/useAuth';
import PublicFooter from '../components/layout/PublicFooter';

const WebsiteTerms: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [pricingDropdownOpen, setPricingDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [mobilePricingOpen, setMobilePricingOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);

  const resourceLinks = [
    { label: 'Advertising Hub', href: 'https://www.ahpra.gov.au/Resources/Advertising-hub.aspx' },
    { label: 'Code of Conduct', href: 'https://www.medicalboard.gov.au/codes-guidelines-policies/code-of-conduct.aspx' },
    { label: 'TGA Guidelines', href: 'https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media' },
  ];

  if (loading) return null;

  const contentSection = (
    <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
      <div className="max-w-6xl mx-auto px-6 pt-10 md:pt-14 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-12">

          {/* Sidebar Navigation */}
          <nav className="flex md:flex-col gap-4 md:gap-2 md:pt-1">
            <button
              onClick={() => navigate('/terms-of-use')}
              className={`text-[13px] font-medium text-left transition-colors duration-200 ${
                location.pathname === '/terms-of-use' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              Software Terms of Use
            </button>
            <button
              onClick={() => navigate('/website-terms')}
              className={`text-[13px] font-medium text-left transition-colors duration-200 ${
                location.pathname === '/website-terms' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              Website Terms of Use
            </button>
            <button
              onClick={() => navigate('/privacy-policy')}
              className={`text-[13px] font-medium text-left transition-colors duration-200 ${
                location.pathname === '/privacy-policy' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/cookie-policy')}
              className={`text-[13px] font-medium text-left transition-colors duration-200 ${
                location.pathname === '/cookie-policy' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              Cookies Policy
            </button>
          </nav>

          {/* Document Content */}
          <div className="max-w-[800px] space-y-8">

            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
                Website Terms of Use
              </h1>
              <p className="text-[14px] text-gray-500">
                Last updated 23 March 2026
              </p>
            </div>

            {/* Table of Contents */}
            <div className="border border-black/[0.08] rounded-xl overflow-hidden">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-[13px] font-semibold text-gray-700 hover:bg-black/[0.02] transition-colors duration-150"
              >
                Contents
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${tocOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: tocOpen ? '600px' : '0px', opacity: tocOpen ? 1 : 0 }}
              >
                <ul className="px-5 pb-4 pt-1 space-y-1.5 list-none">
                  {[
                    ['1. Introduction', '#introduction'],
                    ['2. Access and use of the website', '#access-and-use'],
                    ['3. Your obligations', '#your-obligations'],
                    ['4. Information on the website', '#information-on-the-website'],
                    ['5. Intellectual property', '#intellectual-property'],
                    ['6. Links to other websites', '#links-to-other-websites'],
                    ['7. Security', '#security'],
                    ['8. Reporting misuse', '#reporting-misuse'],
                    ['9. Privacy', '#privacy'],
                    ['10. Liability', '#liability'],
                    ['11. General', '#general'],
                  ].map(([label, href]) => (
                    <li key={href} className="text-[13px] text-gray-500">
                      <a href={href} className="hover:text-[#2563EB] transition-colors duration-150">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Introduction */}
            <div>
              <h2 id="introduction" className="text-lg font-bold text-gray-900 leading-snug mb-3">1. Introduction</h2>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  These terms of use (<strong>Terms</strong>) apply when you use this website, Safepost.com.au (<strong>Website</strong>).
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  You agree to be bound by these Terms which form a binding contractual agreement between you and us, SafePost Pty Ltd (ACN 695 801 604 / ABN 17 695 801 604) (<strong>SafePost</strong>, <strong>our</strong>, <strong>we</strong> or <strong>us</strong>).
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  If you don&rsquo;t agree to these Terms, you must refrain from using the Website.
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  We may change these Terms at any time by updating this page of the Website, and your continued use of the Website following such an update will represent an agreement by you to be bound by the Terms as amended.
                </li>
              </ul>
            </div>

            {/* Access and Use */}
            <div>
              <h2 id="access-and-use" className="text-lg font-bold text-gray-900 leading-snug mb-3">2. Access and use of the website</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                You must only use the Website in accordance with these Terms and any applicable laws, and must ensure that your employees, sub-contractors and any other agents who use or access the Website comply with the Terms and any applicable laws.
              </p>
            </div>

            {/* Your Obligations */}
            <div>
              <h2 id="your-obligations" className="text-lg font-bold text-gray-900 leading-snug mb-3">3. Your obligations</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">You must not:</p>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  copy, mirror, reproduce, translate, adapt, vary, modify, sell, decipher or decompile any part or aspect of the Website without our express consent;
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  use the Website for any purpose other than the purposes of browsing, selecting or signing up to use our service;
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  use, or attempt to use, the Website in a manner that is illegal or fraudulent or facilitates illegal or fraudulent activity;
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  use, or attempt to use, the Website in a manner that may interfere with, disrupt or create undue burden on the Website or the servers or networks that host the Website;
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  use the Website with the assistance of any automated scripting tool or software, unless expressly authorised by us in writing or under a separate API agreement;
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  act in a way that may diminish or adversely impact our reputation, including by linking to the Website on any other website; and
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  attempt to breach the security of the Website, or otherwise interfere with the normal functions of the Website, including by:
                  <ul className="list-[lower-roman] pl-5 mt-2 space-y-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">gaining unauthorised access to Website accounts or data;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">scanning, probing or testing the Website for security vulnerabilities;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">overloading, flooding, mailbombing, crashing or submitting a virus to the Website; or</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">instigating or participating in a denial-of-service attack against the Website.</li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* Information on the Website */}
            <div>
              <h2 id="information-on-the-website" className="text-lg font-bold text-gray-900 leading-snug mb-3">4. Information on the website</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                While we will use our best endeavours to ensure the Website is as up-to-date and accurate as possible, you acknowledge and agree that from time to time: (a) the Website may have errors or defects; (b) the Website may not be accessible at times; (c) messages sent through the Website may not be delivered promptly, or delivered at all; (d) any information you transmit to or receive from our public Website is done at your own risk; or (e) any information provided through the Website may not be accurate or true. We reserve the right to change any information or functionality on the Website by updating the Website at any time without notice.
              </p>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 id="intellectual-property" className="text-lg font-bold text-gray-900 leading-snug mb-3">5. Intellectual property</h2>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  We retain ownership of the Website and all materials on the Website (including text, graphics, logos, design, icons, images, sound and video recordings, pricing, downloads and software) (<strong>Website Content</strong>) and reserve all rights in any intellectual property rights owned or licensed by it not expressly granted to you.
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  You may make a temporary electronic copy of all or part of the Website for the sole purpose of viewing it. You must not otherwise reproduce, transmit, adapt, distribute, sell, modify or publish the Website or any Website Content without prior written consent from us or as permitted by law.
                </li>
              </ul>
            </div>

            {/* Links to Other Websites */}
            <div>
              <h2 id="links-to-other-websites" className="text-lg font-bold text-gray-900 leading-snug mb-3">6. Links to other websites</h2>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  The Website may contain links to other websites that are not our responsibility. We have no control over the content of the linked websites and we are not responsible for it.
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  Inclusion of any linked website on the Website does not imply our approval or endorsement of the linked website.
                </li>
              </ul>
            </div>

            {/* Security */}
            <div>
              <h2 id="security" className="text-lg font-bold text-gray-900 leading-snug mb-3">7. Security</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We do not accept responsibility for loss or damage to computer systems, mobile phones or other electronic devices arising in connection with use of the Website. You should take your own precautions to ensure that the process that you employ for accessing the Website does not expose you to risk of viruses, malicious computer code or other forms of interference.
              </p>
            </div>

            {/* Reporting Misuse */}
            <div>
              <h2 id="reporting-misuse" className="text-lg font-bold text-gray-900 leading-snug mb-3">8. Reporting misuse</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                If you become aware of misuse of the Website by any person, any errors in the material on the Website or any difficulty in accessing or using the Website, please contact us immediately using the contact details or form provided on our Website.
              </p>
            </div>

            {/* Privacy */}
            <div>
              <h2 id="privacy" className="text-lg font-bold text-gray-900 leading-snug mb-3">9. Privacy</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                You agree to be bound by our Privacy Policy, which can be found at{' '}
                <a href="https://www.safepost.com.au/privacy-policy" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                  www.safepost.com.au/privacy-policy
                </a>.
              </p>
            </div>

            {/* Liability */}
            <div>
              <h2 id="liability" className="text-lg font-bold text-gray-900 leading-snug mb-3">10. Liability</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We make no warranties or representations about this Website or any of its content and will not be responsible to you or any third party for any direct or consequential loss suffered in connection with the use of this Website. To the maximum extent permitted by law, we exclude any liability that may arise due to your use of our Website and/or the information or materials contained on it. You agree to indemnify us for any loss or liability arising out of your use of this Website.
              </p>
            </div>

            {/* General */}
            <div>
              <h2 id="general" className="text-lg font-bold text-gray-900 leading-snug mb-3">11. General</h2>
              <div className="space-y-4">
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  <span className="font-semibold text-gray-700">Governing law and jurisdiction:</span> This agreement is governed by the law applying in New South Wales. Each party irrevocably submits to the exclusive jurisdiction of the courts of New South Wales and courts of appeal from them. Each party irrevocably waives any objection to the venue of any legal process on the basis that the process has been brought in an inconvenient forum.
                </p>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  <span className="font-semibold text-gray-700">Waiver:</span> No party to this agreement may rely on the words or conduct of any other party as a waiver of any right unless the waiver is in writing and signed by the party granting the waiver.
                </p>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  <span className="font-semibold text-gray-700">Severance:</span> Any term of this agreement which is wholly or partially void or unenforceable is severed to the extent that it is void or unenforceable. The validity and enforceability of the remainder of this agreement is not limited or otherwise affected.
                </p>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  <span className="font-semibold text-gray-700">Joint and several liability:</span> An obligation or a liability assumed by, or a right conferred on, two or more persons binds or benefits them jointly and severally.
                </p>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  <span className="font-semibold text-gray-700">Assignment:</span> A party cannot assign, novate or otherwise transfer any of its rights or obligations under this agreement without the prior written consent of the other party.
                </p>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  <span className="font-semibold text-gray-700">Entire agreement:</span> This agreement embodies the entire agreement between the parties and supersedes any prior negotiation, conduct, arrangement, understanding or agreement, express or implied, in relation to the subject matter of this agreement.
                </p>
                <div>
                  <p className="text-[14px] text-gray-500 leading-relaxed mb-3">
                    <span className="font-semibold text-gray-700">Interpretation:</span>
                  </p>
                  <ul className="list-[lower-alpha] pl-5 space-y-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">words in the singular includes the plural (and vice versa);</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">words indicating a gender includes the corresponding words of any other gender;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">defined terms have corresponding meanings in other grammatical forms;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">&ldquo;person&rdquo; includes an individual, corporation, authority, partnership, trust and any other entity;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">a reference to a party includes executors, administrators, successors and permitted assigns;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">a reference to this agreement includes all schedules, exhibits, attachments and annexures;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">a reference to a document is to that document as varied, novated, ratified or replaced from time to time;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">headings are for convenience only and do not affect interpretation;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">&ldquo;includes&rdquo; is not a word of limitation;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">no provision will be interpreted adversely to a party because that party prepared it; and</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">a reference to $ or &ldquo;dollar&rdquo; is to Australian currency.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );

  if (user) {
    return (
      <LoggedInLayout>
        {contentSection}
      </LoggedInLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      <Helmet>
        <title>Website Terms — SafePost</title>
        <meta name="description" content="Terms and conditions for use of the SafePost website." />
      </Helmet>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <SafePostLogo />
          </Link>

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

          <div className="hidden lg:flex items-center gap-2.5">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200">
              Login
            </button>
            <button onClick={() => navigate('/pricing/medical-practitioners')} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
              Sign Up
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

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
              <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: mobilePricingOpen ? '300px' : '0px', opacity: mobilePricingOpen ? 1 : 0 }}>
                <div className="pl-4 space-y-0.5 pt-1">
                  <button onClick={() => { navigate('/pricing/medical-practitioners'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">Practitioners</button>
                  <button onClick={() => { navigate('/pricing/medical-practices'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">Practices</button>
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
              <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: mobileCompanyOpen ? '300px' : '0px', opacity: mobileCompanyOpen ? 1 : 0 }}>
                <div className="pl-4 space-y-0.5 pt-1">
                  <button onClick={() => { navigate('/about'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">About Us</button>
                  <button onClick={() => { navigate('/news'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">News</button>
                  <button onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-colors">Contact Us</button>
                </div>
              </div>
            </div>

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

            <div className="pt-3 border-t border-black/[0.06] flex flex-col gap-2">
              <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200">
                Login
              </button>
              <button onClick={() => { navigate('/pricing/medical-practitioners'); setMobileMenuOpen(false); }} className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2.5 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {contentSection}

      <PublicFooter />
    </div>
  );
};

export default WebsiteTerms;
