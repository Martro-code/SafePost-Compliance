import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from '../../components/SafePostLogo';
import LoggedInLayout from '../components/LoggedInLayout';
import { useAuth } from '../../useAuth';
import PublicFooter from '../../components/PublicFooter';

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
                onClick={() => navigate('/terms-of-use')}
                className={`text-[13px] font-medium text-left transition-colors duration-200 ${
                  location.pathname === '/terms-of-use' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                Terms of Use
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
                Cookie Policy
              </button>
            </nav>

            {/* Document Content */}
            <div className="max-w-[800px] space-y-8">

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
                Cookie Policy
              </h1>
              <p className="text-[14px] text-gray-500">
                Last updated 23 February 2026
              </p>
            </div>

            {/* Introduction */}
            <div>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`SafePost uses cookies and similar tracking technologies to operate our platform, improve your experience, and understand how our platform is used. This Cookie Policy explains what cookies are, what cookies we use, and how you can manage them. This Cookie Policy should be read together with our Privacy Policy, which provides further information about how we handle your personal information.`}
              </p>
            </div>

            {/* 1. What are cookies? */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">1. What are cookies?</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Cookies are small text files that are stored on your device when you visit a website or use a web application. They are widely used to make websites and applications work efficiently and to provide information to the site operator.
              </p>
            </div>

            {/* 2. What cookies does SafePost use? */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">{`2. What cookies does SafePost use?`}</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We use the following categories of cookies:
              </p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Essential cookies</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
                {`These cookies are necessary for the SafePost platform to function. They enable core features such as authentication, session management, and security. You cannot opt out of essential cookies as the platform cannot function without them. Examples include cookies used by Supabase to manage your login session and keep you authenticated while you use the platform.`}
              </p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Preference cookies</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
                These cookies remember your settings and preferences to improve your experience. For example, we use localStorage to remember whether you have accepted or declined our cookie consent banner, and to store your notification preferences and session data during your visit.
              </p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Analytics cookies</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`We may use analytics tools to understand how users interact with SafePost \u2014 for example, which pages are visited most frequently and how users navigate through the platform. This information is collected in aggregate and de-identified form and is used solely to improve the platform. We do not currently use third-party advertising or tracking cookies.`}
              </p>
            </div>

            {/* 3. Third-party cookies */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">3. Third-party cookies</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We use a small number of third-party services that may set their own cookies:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Supabase \u2014 our authentication and database provider, which uses cookies to manage secure login sessions.`}</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Stripe \u2014 our payment processor, which may set cookies when you interact with payment-related features of the platform.`}</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We do not use cookies from advertising networks, social media platforms, or data brokers.
              </p>
            </div>

            {/* 4. How long do cookies last? */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">4. How long do cookies last?</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Session cookies are temporary and are deleted when you close your browser. Persistent cookies remain on your device for a set period or until you delete them. The cookies we use are primarily session-based or tied to your authentication session.
              </p>
            </div>

            {/* 5. How to manage cookies */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">5. How to manage cookies</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                You can manage or disable cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">View what cookies are stored and delete them individually</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Block cookies from specific websites</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Block all third-party cookies</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Block all cookies</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`Please note that disabling essential cookies will affect the functionality of the SafePost platform \u2014 you may not be able to log in or use the compliance checker if essential cookies are blocked. For guidance on managing cookies in your specific browser, visit your browser\u2019s help documentation.`}
              </p>
            </div>

            {/* 6. Your consent */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">6. Your consent</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`When you first visit SafePost, you will be shown a cookie consent banner. By clicking Accept All, you consent to our use of all cookies described in this policy. By clicking Decline, only essential cookies required for the platform to function will be used. You can update your cookie preferences at any time by clearing your browser cookies and revisiting the platform, which will re-display the consent banner.`}
              </p>
            </div>

            {/* 7. Changes to this Cookie Policy */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">7. Changes to this Cookie Policy</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`We may update this Cookie Policy from time to time to reflect changes to our practices or for legal or operational reasons. When we make material changes, we will update the date at the top of this policy. Your continued use of SafePost after any changes constitutes your acceptance of the updated policy.`}
              </p>
            </div>

            {/* 8. Contact us */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">8. Contact us</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                If you have any questions about this Cookie Policy, please contact us:
              </p>
              <div className="text-[14px] text-gray-500 leading-relaxed">
                <p className="font-medium text-gray-700">{`SafePost`}</p>
                <p>Email: <a href="mailto:privacy@safepost.com.au" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">privacy@safepost.com.au</a></p>
                <p>Website: <a href="https://www.safepost.com.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">www.safepost.com.au</a></p>
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
              Sign Up
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
