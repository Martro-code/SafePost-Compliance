import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

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
            <button onClick={() => navigate('/features')} className="block w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Features
            </button>
            <a href="#" onClick={(e) => e.preventDefault()} className="block px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Pricing
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="block px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Company
            </a>

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
        <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-500">
            How we collect, use and protect your personal information
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
          <div className="max-w-[800px] mx-auto space-y-12">

            {/* Introduction */}
            <div>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`SafePost\u2122 (\u201Cwe\u201D, \u201Cour\u201D, \u201Cus\u201D) is committed to protecting the privacy of our users and handling personal information responsibly and transparently. This Privacy Policy explains how we collect, use, store, and disclose your personal information when you use the SafePost\u2122 platform, including our website and compliance checking tools.`}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                We handle personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                This Privacy Policy is current from February 2026 and may be updated from time to time.
              </p>
            </div>

            {/* Who We Are */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Who We Are</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`SafePost\u2122 is an AI-powered compliance checking platform designed specifically for Australian medical practitioners and healthcare practices. Our platform helps users assess whether their social media posts and online advertising content comply with AHPRA advertising guidelines, the National Law, and TGA requirements.`}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                {`In this Privacy Policy, \u201CSafePost\u201D refers to the entity operating the SafePost\u2122 platform. If you have any questions about this Privacy Policy or our privacy practices, please contact us at privacy@safepost.com.au.`}
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Information We Collect</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We may collect the following types of personal information:
              </p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Account and Identity Information</h3>
              <ul className="list-disc pl-5 space-y-1.5 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">Full name (first name and surname)</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Email address</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Mobile number</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Password (stored in encrypted form \u2014 we never store passwords in plain text)`}</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Practice Information</h3>
              <ul className="list-disc pl-5 space-y-1.5 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">Practice name</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Practice street address, suburb, state and postcode</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Profession type and registration details where voluntarily provided</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Compliance Check Content</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-2">
                {`When you use the SafePost\u2122 compliance checker, we collect and process:`}
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">The social media or advertising content you submit for compliance checking</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Any images you upload as part of a compliance check</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">The compliance verdict, identified issues and recommended actions generated by our AI system</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Your compliance check history, stored to power the History feature in your dashboard</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Billing and Payment Information</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-2">
                We collect billing-related information to process your subscription payments. Payment processing is handled by Stripe. We do not store your full credit card details on our systems. We retain:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">Your billing email address</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Partial card details (last four digits and card type) for display purposes</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Your selected subscription plan and billing cycle</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Technical and Usage Information</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li className="text-[14px] text-gray-500 leading-relaxed">IP address and device information</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Browser type and version</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Pages visited and time spent on the platform</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Cookies and similar tracking technologies (see Section 8)</li>
              </ul>
            </div>

            {/* How We Collect Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">How We Collect Information</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We collect your personal information in the following ways:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">Directly from you when you create an account, complete your profile, or update your settings</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">When you submit content through our compliance checker</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">When you contact us for support or enquiries</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Automatically through cookies and usage analytics when you use our platform</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">From Stripe, our payment processor, in relation to billing and subscription management</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`You are not required to provide your personal information. However, if you choose not to, we may not be able to provide you with access to the SafePost\u2122 platform or its features.`}
              </p>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">How We Use Your Information</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We use your personal information for the following purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">{`To create and manage your SafePost\u2122 account`}</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">To provide and operate the compliance checking service</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">To store and display your compliance check history in your dashboard</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">To process your subscription payments and manage your billing</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">To send you service-related communications including receipts, account notifications and product updates</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">{`To improve and develop the SafePost\u2122 platform and our AI compliance models`}</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">To respond to your enquiries and provide customer support</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">To comply with our legal and regulatory obligations</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">To conduct research and statistical analysis in de-identified form</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We will only use your personal information for the purposes for which it was collected, purposes you would reasonably expect, any purpose you consent to, or as required or permitted by law.
              </p>
            </div>

            {/* AI Processing and Compliance Content */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">AI Processing and Compliance Content</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                {`SafePost\u2122 uses artificial intelligence to analyse content submitted through the compliance checker. When you submit content for a compliance check:`}
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">Your content is processed by our AI model and assessed against AHPRA guidelines, the National Law, and TGA requirements stored in our compliance database</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">The results of your compliance check are stored in our database and linked to your account to power the History feature</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Content submitted through the compliance checker may be used in de-identified form to improve the accuracy of our compliance models</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                <strong className="text-gray-700">
                  {`Important disclaimer: SafePost\u2122 is an AI-powered guidance tool and does not constitute legal or regulatory advice. AHPRA and the National Boards do not provide pre-approval for advertising. Registered health practitioners are ultimately responsible for ensuring their advertising complies with the Health Practitioner Regulation National Law.`}
                </strong>
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                You retain ownership of the content you submit. We do not claim any intellectual property rights over your content.
              </p>
            </div>

            {/* Sharing and Disclosure of Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Sharing and Disclosure of Information</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We may disclose your personal information to the following types of third parties:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Stripe \u2014 our payment processor, for the purpose of processing subscription payments and managing billing`}</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Supabase \u2014 our database and authentication provider, for secure storage of your account information and compliance check history`}</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">{`AI model providers \u2014 for the purpose of processing content submitted through the compliance checker`}</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Technology and infrastructure service providers who assist us in operating the SafePost\u2122 platform`}</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Professional advisers including legal practitioners, accountants and auditors, on a confidential basis</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Government agencies, regulators or law enforcement bodies where required or authorised by law</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We do not sell your personal information to third parties. We do not share your personal information with advertising networks or data brokers.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                All third-party service providers we engage are required to handle your personal information in accordance with the Privacy Act and Australian Privacy Principles, or equivalent standards.
              </p>
            </div>

            {/* Overseas Disclosure */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Overseas Disclosure</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                Some of our third-party service providers are located overseas, including in the United States of America. For example, Supabase stores data in cloud infrastructure that may be located internationally, and our AI processing providers may operate outside Australia.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`Where we disclose personal information to overseas recipients, we take reasonable steps to ensure those recipients handle your personal information in a manner consistent with the Australian Privacy Principles. By using SafePost\u2122, you consent to the transfer of your personal information to our overseas service providers for the purposes described in this Privacy Policy.`}
              </p>
            </div>

            {/* Cookies and Tracking Technologies */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Cookies and Tracking Technologies</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                Our platform uses cookies and similar technologies to improve your experience and help us understand how our platform is used. Cookies are small text files stored on your device.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We use the following types of cookies:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Essential cookies \u2014 necessary for the platform to function, including authentication session management`}</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Analytics cookies \u2014 to understand how users interact with our platform so we can improve it`}</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Preference cookies \u2014 to remember your settings and preferences`}</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`You can manage your cookie preferences through your browser settings. Disabling certain cookies may affect the functionality of the SafePost\u2122 platform.`}
              </p>
            </div>

            {/* Security */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Security</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We take the security of your personal information seriously. We implement reasonable technical and organisational measures to protect your information from unauthorised access, disclosure, alteration or destruction. These measures include:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">SSL/TLS encryption for all data transmitted between your browser and our platform</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Encrypted password storage \u2014 passwords are never stored in plain text`}</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Row-level security on our database, ensuring users can only access their own data</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Secure authentication through Supabase Auth</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Regular security reviews and updates</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                While we take all reasonable steps to protect your information, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security.
              </p>
            </div>

            {/* Retention of Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Retention of Information</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We retain your personal information for as long as your account is active or as needed to provide you with our services. If you close your account, we will delete or de-identify your personal information within a reasonable period, unless we are required to retain it by law or for legitimate business purposes such as resolving disputes or complying with legal obligations.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Compliance check history is retained for the duration of your subscription to power the History feature. You may request deletion of your compliance check history at any time by contacting us.
              </p>
            </div>

            {/* Marketing Communications */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Marketing Communications</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                {`We may send you marketing communications about SafePost\u2122 products, features and updates by email. You may opt out of marketing communications at any time by:`}
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">Clicking the unsubscribe link in any marketing email we send you</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Updating your communication preferences in your account Settings</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Contacting us directly at privacy@safepost.com.au</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We will always send you essential service communications such as account notifications, receipts and security alerts regardless of your marketing preferences.
              </p>
            </div>

            {/* Accessing, Updating and Correcting Your Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Accessing, Updating and Correcting Your Information</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                {`You have the right to access, update and correct the personal information we hold about you. You can manage most of your personal information directly through your SafePost\u2122 account, including:`}
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">Updating your personal details through the Profile section of your dashboard</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Updating your practice information through the Profile section</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Updating your billing email and payment method through the Billing section</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                If you wish to access information we hold about you that is not available through your account, or if you believe any information we hold is incorrect or incomplete, please contact us at:
              </p>
              <div className="text-[14px] text-gray-500 leading-relaxed">
                <p className="font-medium text-gray-700">Privacy Officer</p>
                <p>{`SafePost\u2122`}</p>
                <p>Email: privacy@safepost.com.au</p>
              </div>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                We will respond to access and correction requests within a reasonable timeframe. We may need to verify your identity before providing access to your personal information.
              </p>
            </div>

            {/* Complaints */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Complaints</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                If you have a complaint about how we have handled your personal information, or believe we have breached the Australian Privacy Principles, please contact us in the first instance at:
              </p>
              <div className="text-[14px] text-gray-500 leading-relaxed mb-4">
                <p className="font-medium text-gray-700">Privacy Officer</p>
                <p>{`SafePost\u2122`}</p>
                <p>Email: privacy@safepost.com.au</p>
              </div>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We will acknowledge receipt of your complaint promptly and endeavour to resolve it within 30 days. If we are unable to resolve your complaint within this timeframe, we will advise you of the reason for the delay in writing.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                If you are not satisfied with our response, you may refer your complaint to the Office of the Australian Information Commissioner (OAIC):
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li className="text-[14px] text-gray-500 leading-relaxed">Website: www.oaic.gov.au</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Telephone: 1300 363 992</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">In writing: GPO Box 5218, Sydney NSW 2001</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Email: enquiries@oaic.gov.au</li>
              </ul>
            </div>

            {/* Changes to This Privacy Policy */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Changes to This Privacy Policy</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We reserve the right to update this Privacy Policy from time to time to reflect changes to our practices, technology or legal requirements. When we make material changes, we will notify you by posting an updated version on our website and, where appropriate, by sending you an email notification.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`Your continued use of SafePost\u2122 after the effective date of the updated Privacy Policy constitutes your acceptance of the changes.`}
              </p>
            </div>

            {/* Contact Us */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">Contact Us</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                If you have any questions, concerns or requests regarding this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="text-[14px] text-gray-500 leading-relaxed">
                <p className="font-medium text-gray-700">Privacy Officer</p>
                <p>{`SafePost\u2122`}</p>
                <p>Email: privacy@safepost.com.au</p>
                <p>Website: www.safepost.com.au</p>
              </div>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-6 font-medium text-gray-700">
                February 2026
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f7f7f4] border-t border-black/[0.06] pt-14 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/features')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Features</button></li>
                <li><button onClick={() => navigate('/pricing/medical-practitioners')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Pricing</button></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Pricing</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/pricing/medical-practitioners')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Medical Practitioners</button></li>
                <li><button onClick={() => navigate('/pricing/medical-practices')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Medical Practices</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/about')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">About us</button></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">News</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="https://www.ahpra.gov.au/Resources/Advertising-hub.aspx" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Advertising hub</a></li>
                <li><a href="https://www.medicalboard.gov.au/codes-guidelines-policies/code-of-conduct.aspx" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Code of conduct</a></li>
                <li><a href="https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">TGA guidelines</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/terms-of-use')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Terms of Use</button></li>
                <li><button onClick={() => navigate('/privacy-policy')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Privacy Policy</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/contact')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Contact us</button></li>
              </ul>
            </div>
          </div>

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

export default PrivacyPolicy;
