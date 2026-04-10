import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PublicFooter from '../components/layout/PublicFooter';
import PublicHeader from '../components/layout/PublicHeader';

import spLogo from '../assets/SP-logo.svg';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      <Helmet>
        <title>About SafePost — AHPRA &amp; TGA Compliance for Healthcare</title>
        <meta name="description" content="SafePost is an Australian AI compliance platform helping medical practitioners and practices avoid AHPRA and TGA advertising breaches." />
      </Helmet>
      <PublicHeader />

      {/* Hero Section */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            About SafePost — your essential infrastructure layer for compliance in medical practice
          </h1>
          {/* SafePost Logo Divider */}
          <div className="py-10 flex justify-center">
            <img
              src={spLogo}
              alt="SafePost logo"
              loading="lazy"
              width={600}
              height={91}
              className="max-w-[500px] md:max-w-[600px] w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-16 md:pb-20">
          <div className="max-w-[800px] mx-auto space-y-12">
            {/* Section 1 */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                {"We\u2019re a doctor-first company built on deep understanding of the compliance challenges health practitioners face every day"}
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {"We\u2019ve worked in medical indemnity for over a decade, seeing firsthand how easily well-intentioned social media posts, online advertising and website content can trigger AHPRA and TGA investigations. We\u2019ve watched dedicated health practitioners navigate complex regulations, face unexpected notifications, and spend countless hours second-guessing their marketing efforts."}
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                {"We founded SafePost because compliance shouldn\u2019t hold you back from connecting with patients"}
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {"Social media, digital marketing and your practice website are essential tools for modern medical practices \u2014 but the regulatory landscape is increasingly complex. AHPRA\u2019s advertising guidelines, TGA requirements, testimonial restrictions, before/after photo rules \u2014 it\u2019s a minefield. One unclear post or non-compliant webpage can put your registration at risk."}
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                Our mission is to help Australian health practitioners and practices communicate confidently, compliantly and authentically
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {"We believe health practitioners should focus on patient care, not worrying whether their latest Instagram post or services page will trigger an investigation. SafePost provides instant, intelligent compliance checking powered by AI that understands the nuances of Australian health practitioner regulations \u2014 across your social media, online advertising and practice website."}
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                {"We\u2019re not lawyers. We\u2019re your compliance platform."}
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {"SafePost doesn\u2019t replace professional advice \u2014 it empowers you with the knowledge and tools to navigate advertising regulations confidently. From solo health practitioners managing their own social media to multi-practitioner practices running comprehensive marketing campaigns and website audits, we\u2019re here to support you at every step."}
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                Our vision is to make compliance the standard — not the exception
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {"Today, SafePost checks your content before it goes live. But our vision reaches further \u2014 a single trusted platform that every Australian health professional and medical practice turns to for compliance confidence across everything they publish, communicate and practise. We\u2019re building toward that future, one check at a time."}
              </p>
            </div>

            {/* Section 6 - Our Design Story */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                {"Every detail of SafePost was built with purpose"}
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {"Even our logo tells the story of what we stand for. The three horizontal bars represent the journey every piece of your content takes \u2014 from the regulatory framework at the top, through SafePost\u2019s intelligent compliance layer in the middle, to your approved, ready-to-publish content at the bottom."}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                {"But look closer. The staggered alignment of these bars creates something subtle yet intentional: a phantom \u201CS\u201D in the negative space. This hidden letter represents both Safe and Social \u2014 a visual reminder that compliance and communication aren\u2019t opposing forces. They\u2019re integrated, flowing together naturally."}
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mt-4">
                {"It\u2019s a design that says compliance isn\u2019t about restriction \u2014 it\u2019s about structure. The kind of structure that gives you guardrails, not roadblocks. The kind that transforms uncertainty into confidence and lets you communicate freely within the boundaries that protect your registration."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Ready to experience compliance confidence?
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Join medical practitioners and practices across Australia using SafePost to communicate with confidence
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
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-7 py-3 text-[15px] font-semibold text-gray-600 hover:text-gray-900 rounded-xl border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.97] min-w-[180px]"
            >
              Contact us
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default About;
