import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from '../components/ui/SafePostLogo';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { useAuth } from '../hooks/useAuth';
import PublicFooter from '../components/layout/PublicFooter';

const CookiePolicy: React.FC = () => {
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
              onClick={() => navigate('/software-terms')}
              className={`text-[13px] font-medium text-left transition-colors duration-200 ${
                location.pathname === '/software-terms' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-900'
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
                Cookies Policy
              </h1>
              <p className="text-[14px] text-gray-500">
                Last updated 23 March 2026
              </p>
            </div>

            {/* Introduction */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Introduction</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                This document sets out the Cookies Policy of SafePost Pty Ltd (ABN 17 695 801 604 / ACN 695 801 604) (<strong>SafePost</strong>) (referred to in this cookies policy as &lsquo;we&rsquo;, &lsquo;us&rsquo;, or &lsquo;our&rsquo;).
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                This Cookies Policy applies when you use our website accessible at{' '}
                <a href="https://www.safepost.com.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                  https://www.safepost.com.au
                </a>{' '}
                (&ldquo;Website&rdquo;) and describes the types of cookies we use on our Website, how we use them, and how you can control them.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We may update this Cookies Policy from time to time by posting an updated copy on our website and we encourage you to check our website regularly to ensure that you are aware of our most current Cookies Policy.
              </p>
            </div>

            {/* Types of Cookies We Use */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Types of Cookies We Use</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
                A cookie is a small file that&rsquo;s stored on your computer or device when you visit a website that uses cookies. We may use several different cookies on our Website, for the purposes of website functionality, performance, advertising, and social media or content cookies. Cookies enhance your experience on our Website, as it allows us to recognise you, remember your details and preferences (for example, your log-in details), and provide us with information on when you&rsquo;ve visited and how you&rsquo;ve interacted with our Website.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                The below table sets out the type of cookies we may collect on our Website.
              </p>

              {/* Cookie table */}
              <div className="overflow-x-auto">
                <table className="w-full text-[14px] text-gray-500 border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left text-gray-700 font-semibold px-4 py-3 border border-gray-200 w-[200px]">Cookie Type</th>
                      <th className="text-left text-gray-700 font-semibold px-4 py-3 border border-gray-200">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="align-top">
                      <td className="px-4 py-3 border border-gray-200 font-medium text-gray-700 whitespace-nowrap">Strictly Necessary Cookies</td>
                      <td className="px-4 py-3 border border-gray-200 leading-relaxed">
                        Certain cookies we use are essential for the proper functioning of our Website, without which our Website won&rsquo;t work or certain features won&rsquo;t be accessible to you. For example, we may need to remember data you&rsquo;ve inputted from one page to the next in a single session. This includes Supabase authentication session data stored in your browser&rsquo;s local storage, as well as session state flags. These are strictly essential for login, account access, and checkout processes.
                      </td>
                    </tr>
                    <tr className="align-top bg-gray-50">
                      <td className="px-4 py-3 border border-gray-200 font-medium text-gray-700 whitespace-nowrap">Performance Cookies</td>
                      <td className="px-4 py-3 border border-gray-200 leading-relaxed">
                        Performance cookies collect information about your use of the Website to help enhance the services we provide to you. We collect information about how you interact with the Website, including the pages you visit and the frequency of your visits. This information helps us identify patterns of usage on the site, collect analytics data, identify issues you may have had on the Website, make changes to enhance your browsing experience, and analyse if our marketing is effective and relevant to you. Specifically, we use Google Analytics 4 to distinguish users and sessions. No personally identifiable information is collected, and these analytics only activate after you accept cookies.
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="px-4 py-3 border border-gray-200 font-medium text-gray-700 whitespace-nowrap">Functional Cookies</td>
                      <td className="px-4 py-3 border border-gray-200 leading-relaxed">
                        We use functional cookies to improve your experience on our Website and make things more convenient for you. These cookies personalise your experience on our Website based on your preferences, by remembering your details such as your login details or region.
                        <br /><br />
                        Security cookies are a type of functional cookie, which assist with website and user account security. Load balancing session cookies are used for the duration of the session to distribute user requests across multiple servers to optimise website speed and capacity. We also use user interface customisation persistent cookies to store a user&rsquo;s preferred version of our Website, such as font and language preferences. Specifically, this category includes a &ldquo;stay signed in&rdquo; session cookie so you do not have to repeatedly log in, user preference storage for theme settings, your cookie consent choice, cached account information and session navigation state.
                      </td>
                    </tr>
                    <tr className="align-top bg-gray-50">
                      <td className="px-4 py-3 border border-gray-200 font-medium text-gray-700">Third Party Cookies &mdash; Stripe, Google Maps and GlitchTip</td>
                      <td className="px-4 py-3 border border-gray-200 leading-relaxed">
                        <p className="mb-3">We use a few trusted third-party services to help our website run smoothly and securely.</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Stripe (Payment Processing):</strong> When you update your payment details, Stripe uses temporary cookies strictly to process your payment securely and prevent fraud. These do not identify you personally.</li>
                          <li><strong>Google Maps (Address Autocomplete):</strong> To save you time during account setup, we use Google Maps to suggest and autocomplete your address. Google may set cookies on these specific pages to provide this feature.</li>
                          <li><strong>GlitchTip (Error Monitoring):</strong> We use this service to automatically catch and fix technical errors on our website. GlitchTip does not set any cookies, nor does it track your behaviour or collect personally identifiable information.</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* How Long Will Cookies Remain on My Device? */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">How Long Will Cookies Remain on My Device?</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                The amount of time that a cookie remains on your computer or device depends on the type of cookie &mdash; cookies are either &ldquo;persistent&rdquo; or &ldquo;session&rdquo; cookies. Persistent cookies last until they expire or are deleted, so they may remain on your device for as little as 10 minutes to several years. Session cookies last until you stop browsing, so just for the relevant session.
              </p>
            </div>

            {/* How Do Third Parties Use Cookies on the Website? */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">How Do Third Parties Use Cookies on the Website?</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We may use third party analytics cookies to collect information about your interaction with our Website.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We use Google Analytics and other third-party analytics providers to help process data. To find out more, see{' '}
                <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                  How Google uses data when you use our partners&rsquo; sites or apps
                </a>.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                You can opt out of Google Analytics by declining cookies on our cookie banner or by installing the Google Analytics opt-out browser add-on available at{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                  tools.google.com/dlpage/gaoptout
                </a>.
              </p>
            </div>

            {/* How Do I Control Cookies? */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">How Do I Control Cookies?</h2>
              <ul className="list-disc pl-5 space-y-3 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  Usually, you can control and manage cookies through your browser. You can control whether or not your browser accepts cookies, how to filter and manage cookies, and how to delete cookies at the end of a session.
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  If you remove or block cookies, this may negatively impact your experience of our Website and you may not be able to access all parts of our Website.
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  Many third party advertising services allow you to opt out of their tracking systems, by giving you the opportunity to opt out by way of a pop-up before downloading cookies to your device.
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">
                  For more information about cookies and how to manage them, visit{' '}
                  <a href="http://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                    www.allaboutcookies.org
                  </a>.
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Contact Us</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                For further information about our Cookies Policy or practices, please contact us using the details set out below:
              </p>
              <div className="text-[14px] text-gray-500 leading-relaxed">
                <p>Email: <a href="mailto:info@safepost.com.au" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">info@safepost.com.au</a></p>
                <p className="mt-2">
                  <a href="https://www.safepost.com.au/contact" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                    Contact Us
                  </a>
                </p>
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
              <button onClick={() => setMobilePricingOpen(!mobilePricingOpen)} className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
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
              <button onClick={() => setMobileCompanyOpen(!mobileCompanyOpen)} className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
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

export default CookiePolicy;
