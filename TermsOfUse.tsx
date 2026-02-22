import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';

const TermsOfUse: React.FC = () => {
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
            <button onClick={() => navigate('/signup')} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
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
              <button onClick={() => navigate('/signup')} className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2.5 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
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
            Terms of Use
          </h1>
          <p className="text-lg text-gray-500">
            Effective Date: February 2026
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
                {`These Terms of Use govern your access to and use of the SafePost\u2122 platform, including our website, web application, compliance checking tools, and all related features and services (collectively, the \u201CPlatform\u201D). By creating an account or using the Platform, you agree to be bound by these Terms of Use.`}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                Please read these Terms of Use carefully before using the Platform. If you do not agree to these Terms of Use, you must not access or use the Platform.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                These Terms of Use should be read together with our Privacy Policy, which explains how we collect, use and protect your personal information.
              </p>
            </div>

            {/* 1. About SafePost */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">{`1. About SafePost\u2122`}</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`SafePost\u2122 is an AI-powered compliance checking platform designed to assist Australian medical practitioners and healthcare practices in assessing whether their social media posts and online advertising content comply with AHPRA advertising guidelines, the Health Practitioner Regulation National Law (National Law), and Therapeutic Goods Administration (TGA) requirements.`}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                {`SafePost\u2122 is operated by SafePost Pty Ltd. In these Terms of Use, \u201CSafePost\u201D, \u201Cwe\u201D, \u201Cour\u201D and \u201Cus\u201D refers to the entity operating the Platform.`}
              </p>
            </div>

            {/* 2. Important Disclaimer */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">2. Important Disclaimer</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`SafePost\u2122 is an AI-powered guidance tool only. It does not constitute legal, regulatory or professional advice.`}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4 mb-4">
                You should be aware of the following important limitations:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">{`AHPRA and the National Boards do not provide pre-approval for advertising. The compliance assessments generated by SafePost\u2122 are not a substitute for seeking independent legal or regulatory advice.`}</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Registered health practitioners are ultimately and solely responsible for ensuring their advertising and social media content complies with the Health Practitioner Regulation National Law, AHPRA advertising guidelines, TGA requirements and any other applicable laws and regulations.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">AI-generated compliance assessments may not be complete, accurate or up-to-date. Guidelines and regulations change over time and the Platform may not reflect the most current requirements at all times.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">{`A \u201Ccompliant\u201D result from SafePost\u2122 does not guarantee that your content complies with all applicable laws and regulations, nor does it protect you from regulatory action by AHPRA, the TGA or any other body.`}</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`By using the Platform, you acknowledge and accept these limitations and agree that SafePost\u2122 is a support tool only, not a substitute for professional legal or regulatory advice.`}
              </p>
            </div>

            {/* 3. Eligibility and Account Registration */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">3. Eligibility and Account Registration</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                To use the SafePost platform, you must:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">Be a registered health practitioner, healthcare practice, or authorised representative of a healthcare practice in Australia</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Be at least 18 years of age</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Create an account and agree to these Terms of Use</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                When creating an account, you must provide accurate, complete and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify us immediately if you become aware of any unauthorised access to or use of your account.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                You may not share your account with any other person. Multi-user access is only available on plans that specifically include it, and each user must have their own account credentials.
              </p>
            </div>

            {/* 4. Subscriptions and Payments */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">4. Subscriptions and Payments</h2>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">4.1 Subscription Plans</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
                Access to the SafePost platform requires a paid subscription. We offer several subscription plans with different features and usage limits. Current pricing and plan details are available on our pricing pages. We reserve the right to change subscription pricing with reasonable notice to existing subscribers.
              </p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">4.2 Free Trial</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
                We may offer a free trial period for new subscribers. During the free trial, you will have access to the Platform features included in your chosen plan. At the end of the free trial, your subscription will automatically commence and your nominated payment method will be charged unless you cancel before the trial period ends.
              </p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">4.3 Billing and Payment</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                By subscribing to SafePost, you authorise us to charge your nominated payment method on a recurring basis (monthly or annually, depending on your chosen billing cycle). You agree to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">Provide accurate and complete billing information</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Promptly update your billing information if it changes</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Pay all fees associated with your subscription plan</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
                Payment processing is handled by Stripe. We do not store your full credit card details. All prices are in Australian dollars (AUD) and are inclusive of GST where applicable.
              </p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">4.4 Cancellation and Refunds</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of your current billing period. We do not provide refunds for unused portions of a subscription period except where required by Australian Consumer Law.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                If your payment fails, we reserve the right to suspend or terminate your access to the Platform until payment is received.
              </p>
            </div>

            {/* 5. Acceptable Use */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">5. Acceptable Use</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                You agree to use the Platform only for lawful purposes and in accordance with these Terms of Use. You must not:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li className="text-[14px] text-gray-500 leading-relaxed">Use the Platform in any way that violates any applicable Australian or international law or regulation</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Submit content through the compliance checker that contains patient identifying information, sensitive health information or any information that you are not authorised to process</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Attempt to reverse engineer, decompile, disassemble or otherwise attempt to derive the source code or underlying algorithms of the Platform</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Use the Platform in a way that competes with our business or that could damage, disable or impair the Platform</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Attempt to gain unauthorised access to any part of the Platform or its related systems</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Knowingly transmit any viruses, malware or other harmful code</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Share your account credentials with any other person or allow any other person to access your account</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Use the Platform for any purpose other than assessing the compliance of your own healthcare practice\u2019s advertising and social media content`}</li>
              </ul>
            </div>

            {/* 6. Your Content */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">6. Your Content</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`You retain ownership of all content you submit through the Platform for compliance checking. By submitting content, you grant SafePost\u2122 a limited, non-exclusive licence to process and analyse that content for the purpose of providing the compliance checking service.`}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4 mb-4">
                You represent and warrant that you own or have the necessary rights to submit any content you provide through the Platform, and that your content does not infringe the intellectual property rights or privacy rights of any third party.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                You must not submit content through the Platform that:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li className="text-[14px] text-gray-500 leading-relaxed">Contains patient identifying information or sensitive health information about individuals</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Is defamatory, harassing, threatening or unlawful</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Infringes the intellectual property rights of any third party</li>
              </ul>
            </div>

            {/* 7. Intellectual Property */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">7. Intellectual Property</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`All intellectual property rights in the SafePost platform, including its software, design, AI models, compliance database, guidelines content, branding and all other materials, are owned by or licenced to SafePost\u2122. These Terms of Use do not grant you any rights in relation to our intellectual property other than the limited right to use the Platform in accordance with these Terms of Use.`}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                {`The SafePost\u2122 name, logo and trademark are the property of SafePost. You must not use our name, logo or trademarks without our prior written consent.`}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                The compliance guidelines content stored in our database has been compiled from publicly available regulatory sources including AHPRA, the National Boards and the TGA. We do not claim ownership of the underlying regulatory content sourced from these bodies.
              </p>
            </div>

            {/* 8. Privacy */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">8. Privacy</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms of Use by reference. Our Privacy Policy explains how we collect, use, store and disclose your personal information. By using the Platform, you consent to our collection and use of your personal information in accordance with our Privacy Policy.
              </p>
            </div>

            {/* 9. Third Party Links and Services */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">9. Third Party Links and Services</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                The Platform may contain links to third-party websites or resources, including links to AHPRA, TGA and other regulatory bodies for reference purposes. These links are provided for your convenience only. We do not endorse, control or take responsibility for the content, accuracy or practices of any third-party websites.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                We are not liable for any loss or damage arising from your use of any third-party website or resource linked from the Platform.
              </p>
            </div>

            {/* 10. Limitation of Liability */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">10. Limitation of Liability</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                {`To the maximum extent permitted by law, SafePost\u2122 and its officers, employees, agents and contractors will not be liable for any direct, indirect, incidental, special, consequential or punitive loss or damage arising from or in connection with:`}
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li className="text-[14px] text-gray-500 leading-relaxed">Your use of or reliance on the Platform or any compliance assessment generated by the Platform</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">{`Any regulatory action taken against you by AHPRA, the TGA or any other body, including where you have relied on a compliance assessment from SafePost\u2122`}</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Any inaccuracy, error or omission in the compliance assessments or guidelines content on the Platform</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Any interruption, suspension or termination of the Platform</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Any unauthorised access to or use of your account or data</li>
              </ul>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Where liability cannot be excluded by law, our liability is limited to the lesser of resupplying the relevant service or the amount you paid us in the 3 months preceding the event giving rise to the claim.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                Nothing in these Terms of Use excludes, restricts or modifies any right or remedy you may have under the Australian Consumer Law.
              </p>
            </div>

            {/* 11. Indemnity */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">11. Indemnity</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {`To the maximum extent permitted by law, you agree to indemnify and hold harmless SafePost\u2122 and its officers, employees, agents and contractors from and against any claims, liabilities, damages, losses, costs and expenses (including reasonable legal fees) arising out of or in connection with your use of the Platform, your breach of these Terms of Use, or your violation of any applicable law or the rights of any third party.`}
              </p>
            </div>

            {/* 12. Platform Availability */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">12. Platform Availability</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We endeavour to make the Platform available at all times, but we do not guarantee that the Platform will be uninterrupted, error-free or free from defects. We may suspend or restrict access to the Platform from time to time for maintenance, updates or other operational reasons.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                We reserve the right to modify, update or discontinue the Platform or any part of it at any time with or without notice. We will not be liable to you for any modification, suspension or discontinuation of the Platform.
              </p>
            </div>

            {/* 13. Termination */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">13. Termination</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We may suspend or terminate your access to the Platform at any time if we reasonably believe you have breached these Terms of Use, if your subscription payment fails, or for any other reason at our discretion with reasonable notice.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                Upon termination of your account, your right to access the Platform will cease immediately. Clauses which by their nature should survive termination will continue to apply, including clauses relating to intellectual property, limitation of liability, indemnity and jurisdiction.
              </p>
            </div>

            {/* 14. Changes to These Terms */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">14. Changes to These Terms</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                We may update these Terms of Use from time to time to reflect changes to our services, legal requirements or business practices. When we make material changes, we will notify you by posting an updated version on the Platform and, where appropriate, by sending you an email notification.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                Your continued use of the Platform after the effective date of any updated Terms of Use constitutes your acceptance of the changes. If you do not agree to the updated Terms of Use, you must stop using the Platform and cancel your subscription.
              </p>
            </div>

            {/* 15. Severability */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">15. Severability</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                If any provision of these Terms of Use is found to be void, invalid, illegal or unenforceable, that provision must be read down as narrowly as necessary to allow it to be valid or enforceable. If it is not possible to read down a provision, that provision (or that part of that provision) is severed from these Terms of Use without affecting the validity or enforceability of the remaining provisions.
              </p>
            </div>

            {/* 16. Governing Law and Jurisdiction */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">16. Governing Law and Jurisdiction</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                These Terms of Use are governed by the laws of New South Wales, Australia. You submit to the non-exclusive jurisdiction of the courts of New South Wales in respect of any dispute arising under or in connection with these Terms of Use.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                The Platform is operated in Australia and is intended for use by Australian medical practitioners and healthcare practices. We make no representation that the Platform or its content complies with the laws of any jurisdiction outside Australia.
              </p>
            </div>

            {/* 17. Contact Us */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">17. Contact Us</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                If you have any questions about these Terms of Use, please contact us:
              </p>
              <div className="text-[14px] text-gray-500 leading-relaxed">
                <p className="font-medium text-gray-700">{`SafePost\u2122`}</p>
                <p>Email: info@safepost.com.au</p>
                <p>Website: www.safepost.com.au</p>
              </div>
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
                <li><button onClick={() => navigate('/terms-of-use')} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Terms of Service</button></li>
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

export default TermsOfUse;
