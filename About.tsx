import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ChevronDown, ArrowRight, Menu, X, ExternalLink } from 'lucide-react';
import SafePostLogo from './components/SafePostLogo';
import aboutUsLogo from './assets/about-us-logo.png';

const About: React.FC = () => {
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
          <div className="flex items-center gap-3">
            <Link to="/">
              <SafePostLogo />
            </Link>
          </div>

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
            About SafePost&trade;
          </h1>
          <p className="text-lg text-gray-500">
            Supporting Australian medical practitioners and practices with compliance confidence
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
          <div className="max-w-[800px] mx-auto space-y-12">
            {/* Section 1 */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                {"We\u2019re a doctor-first company built on deep understanding of the compliance challenges medical practitioners face every day"}
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {"We\u2019ve worked in medical indemnity for over a decade, seeing firsthand how easily well-intentioned social media posts and online advertising can trigger AHPRA investigations. We\u2019ve watched dedicated practitioners navigate complex regulations, face unexpected notifications, and spend countless hours second-guessing their marketing efforts."}
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                {"We founded SafePost\u2122 because compliance shouldn\u2019t hold you back from connecting with patients"}
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {"Social media and digital marketing are essential tools for modern medical practices \u2014 but the regulatory landscape is increasingly complex. AHPRA\u2019s advertising guidelines, TGA requirements, testimonial restrictions, before/after photo rules \u2014 it\u2019s a minefield. One unclear post can put your registration at risk."}
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                Our mission is to help Australian medical practitioners and practices communicate confidently, compliantly and authentically
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {"We believe doctors should focus on patient care, not worrying whether their latest Instagram post will trigger an investigation. SafePost\u2122 provides instant, intelligent compliance checking powered by AI that understands the nuances of Australian health practitioner regulations."}
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                {"We\u2019re not lawyers. We\u2019re your compliance partner"}
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {"SafePost\u2122 doesn\u2019t replace professional advice \u2014 it empowers you with the knowledge and tools to navigate advertising regulations confidently. From solo practitioners managing their own social media to multi-practitioner practices running comprehensive marketing campaigns, we\u2019re here to support you at every step."}
              </p>
            </div>

            {/* SafePost Logo Divider */}
            <div className="py-16 flex justify-center">
              <img
                src={aboutUsLogo}
                alt="SafePost logo"
                className="max-w-[400px] md:max-w-[500px] w-full h-auto"
              />
            </div>

            {/* Section 6 - Our Design Story */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                Every detail of SafePost&trade; was built with purpose.
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {"Even our logo tells the story of what we stand for. The three horizontal bars represent the journey every piece of your content takes \u2014 from the regulatory framework at the top, through SafePost\u2019\s\u2122 intelligent compliance layer in the middle, to your approved, ready-to-publish content at the bottom."}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                {"But look closer. The staggered alignment of these bars creates something subtle yet intentional: a phantom \u201CS\u201D in the negative space. This hidden letter represents both Safe and Social \u2014 a visual reminder that compliance and communication aren\u2019t opposing forces. They\u2019re integrated, flowing together naturally."}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                {"It\u2019s a design that says compliance isn\u2019t about restriction \u2014 it\u2019s about structure. The kind of structure that gives you guardrails, not roadblocks. The kind that transforms uncertainty into confidence and lets you communicate freely within the boundaries that protect your registration."}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                {"We built SafePost\u2122 to be the layer of protection between your intention and your publication \u2014 so that every post you share is one you can stand behind with complete confidence."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Ready to experience compliance confidence?
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Join medical practitioners and practices across Australia using SafePost&trade; to communicate with confidence
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 flex items-center justify-center gap-2.5 text-[15px] active:scale-[0.97] hover:shadow-blue-600/30 hover:translate-y-[-1px] min-w-[180px]"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-7 py-3 text-[15px] font-semibold text-gray-600 hover:text-gray-900 rounded-xl border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.97] min-w-[180px]"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </button>
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
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Data Use</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Security</a></li>
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

export default About;
