import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from '../components/ui/SafePostLogo';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { useAuth } from '../hooks/useAuth';
import PublicFooter from '../components/layout/PublicFooter';

const PrivacyPolicy: React.FC = () => {
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
                Privacy Policy
              </h1>
              <p className="text-[14px] text-gray-500">
                Last updated 23 March 2026
              </p>
            </div>

            {/* Introduction */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Introduction</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                This document sets out the privacy policy of SafePost Pty Ltd (ABN 17 695 801 604 / ACN 695 801 604) (referred to in this privacy policy as &lsquo;we&rsquo;, &lsquo;us&rsquo;, or &lsquo;our&rsquo;).
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We take our privacy obligations seriously and we&rsquo;ve created this privacy policy to explain how we store, maintain, use and disclose personal information.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We are committed to preventing serious invasions of privacy and ensuring the protection of your personal information, so you can contact us using the details below if you have any questions or concerns.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                By providing personal information to us, you consent to our storage, maintenance, use and disclosing of personal information in accordance with this privacy policy.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We may change this privacy policy from time to time by posting an updated copy on our website and we encourage you to check our website regularly to ensure that you are aware of our most current privacy policy.
              </p>
            </div>

            {/* Types of Personal Information We Collect */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Types of Personal Information We Collect</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                The personal information we collect may include the following:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li className="text-[14px] text-gray-500 leading-relaxed">name;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">name of your medical practice or organisation;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">mailing or street address for your medical practice or organisation;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">your company&rsquo;s ACN or your business&rsquo; ABN;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">email address;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">telephone number and other contact details;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">credit card or other payment information through our third party payment platform, Stripe;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">information about your business or personal circumstances;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">information in connection with client surveys, questionnaires and promotions;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">your device identity and type, I.P. address, geo-location information, page view statistics, advertising data and standard web log information;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">information about third parties; and</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">any other information provided by you to us via our website or our online presence, or otherwise required by us or provided by you.</li>
              </ul>
            </div>

            {/* No Sensitive Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">No Sensitive Information</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We only collect personal information that is reasonably necessary for our functions and activities.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We do not intentionally collect sensitive information (including health information) within the meaning of the <em>Privacy Act 1988</em> (Cth).
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                You (users) must not upload or submit any sensitive information, including health information, relating to yourself or any third party when using our platform or website. You are responsible for ensuring that any information you provide complies with applicable privacy laws and does not include sensitive information unless you are authorised to provide it.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                If we become aware that sensitive information has been submitted to us in circumstances where we did not request it, we will take reasonable steps to delete or de-identify that information as soon as practicable, unless we are required or authorised by law to retain it.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                To the extent that you provide personal information about a third party, you warrant that you have obtained any necessary consents and have made any required disclosures to that individual.
              </p>
            </div>

            {/* How We Collect Personal Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">How We Collect Personal Information</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We may collect personal information either directly from you, or from third parties, including where you:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">contact us through our website;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">receive goods or services from us;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">submit any of our online sign up forms;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">communicate with us via email, telephone, SMS, social applications (such as LinkedIn or Facebook) or otherwise;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">interact with our website, social applications, services, content and advertising; and</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">invest in our business or enquire as to a potential purchase in our business.</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We may also collect personal information from you when you use or access our website or our social media pages. This may be done through use of web analytics tools, &lsquo;cookies&rsquo; or other similar tracking technologies that allow us to track and analyse your website usage. Cookies are small files that store information on your computer, mobile phone or other device and enable and allow the creator of the cookie to identify when you visit different websites. If you do not wish information to be stored as a cookie, you can disable cookies in your web browser.
              </p>
            </div>

            {/* Use of Your Personal Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Use of Your Personal Information</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We collect and use personal information for the following purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">to provide goods, services or information to you;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">to verify your business identity and credentials, including validating your Australian Business Number (ABN) or Australian Company Number (ACN) against the official Australian Business Register or other relevant government databases;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">for record keeping and administrative purposes;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">to provide information about you to our contractors, employees, consultants, agents or other third parties for the purpose of providing goods or services to you;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">to improve and optimise our service offering and customer experience;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">to comply with our legal obligations, resolve disputes or enforce our agreements with third parties;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">to send you administrative messages, reminders, notices, updates, security alerts, and other information requested by you; and</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">to consider an application of employment from you.</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We may disclose your personal information to cloud-providers, contractors and other third parties located inside or outside of Australia. If we do so, we will take reasonable steps to ensure that any overseas recipient has similar legal safeguards and deals with such personal information in a manner consistent with how we deal with it.
              </p>
            </div>

            {/* Automated Decision-Making */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Automated Decision-Making</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We use automated systems, including artificial intelligence similar to widely used search and evaluation tools, to assess whether content complies with applicable laws and regulations. These automated processes may involve the use of personal information to evaluate content and its compliance status.
              </p>
            </div>

            {/* Marketing */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Marketing</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We may at times send you marketing communications which will be done in accordance with the <em>Spam Act 2003</em> (Cth).
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                If we do, we may use email, SMS, social media, phone or mail to send you direct marketing communications.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                Where consent is needed, we will ask you for your consent before sending you marketing communications, except where you:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">have explicitly opted-in to receiving email marketing from us in the past; or</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">were given the option to opt-out of email marketing when you initially signed up for one of our platforms and you did not do so.</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                You can, at any time, opt out of receiving marketing materials from us by using the opt-out facility provided (e.g., an unsubscribe link on emails we send you) or by contacting us via the details provided at the end of this privacy policy. We will implement such a request as soon as possible, however, cannot guarantee that such a response will be immediate.
              </p>
            </div>

            {/* Security */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Security</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We take reasonable steps to ensure your personal information is secure and protected from misuse or unauthorised access. To support our compliance with the Australian Privacy Principles and ensure data sovereignty for our users, our backend infrastructure and user data are hosted locally on secure Amazon Web Services (AWS) servers located in Sydney, Australia.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Our information technology systems utilise a range of robust administrative and technical measures, including password protection and restricted access protocols. However, while we employ industry-standard security practices, no electronic storage or internet transmission is completely impenetrable, and we cannot guarantee the absolute security of your personal information.
              </p>
            </div>

            {/* Links */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Links</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Our website may contain links to other websites. Those links are provided for convenience and may not remain current or be maintained. We are not responsible for the privacy practices of those linked websites and we suggest you review the privacy policies of those websites before using them.
              </p>
            </div>

            {/* Requesting Access or Correcting Your Personal Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Requesting Access or Correcting Your Personal Information</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                If you wish to request access to the personal information we hold about you, please contact us using the contact details set out below including your name and contact details. We may need to verify your identity before providing you with your personal information. In some cases, we may be unable to provide you with access to all your personal information and where this occurs, we will explain why. We will deal with all requests for access to personal information within a reasonable timeframe.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                If you think that any personal information we hold about you is inaccurate, please contact us using the contact details set out below and we will take reasonable steps to ensure that it is corrected.
              </p>
            </div>

            {/* Complaints */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Complaints</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                If you wish to complain about how we handle your personal information or believe your privacy has been seriously invaded, please contact us using the details provided below with your name and contact details. We will investigate your complaint promptly and respond within a reasonable timeframe.
              </p>
            </div>

            {/* Contact Us */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Contact Us</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                For further information about our privacy policy or practices, or to access or correct your personal information, or make a complaint, please contact us using the details set out below:
              </p>
              <div className="text-[14px] text-gray-500 leading-relaxed">
                <p className="font-medium text-gray-700">SafePost Privacy Officer</p>
                <p>Email: <a href="mailto:privacy@safepost.com.au" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">privacy@safepost.com.au</a></p>
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

export default PrivacyPolicy;
