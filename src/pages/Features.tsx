import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, ArrowRight, ScanSearch, Flag, Wand2, Scale, MonitorSmartphone, History, Globe, AlertTriangle, ClipboardList, FileText, Shield, BadgeCheck } from 'lucide-react';
import heroImage from '../assets/features-hero.png';
import PublicFooter from '../components/layout/PublicFooter';
import PublicHeader from '../components/layout/PublicHeader';

// Preload the hero image so the browser fetches it before React renders the <img>
const preloadLink = document.createElement('link');
preloadLink.rel = 'preload';
preloadLink.as = 'image';
preloadLink.href = heroImage;
document.head.appendChild(preloadLink);

const Features: React.FC = () => {
  const navigate = useNavigate();

  // Header state

  const platformCategories = [
    { category: 'Social networking', platforms: ['Facebook', 'X', 'WeChat', 'Weibo', 'WhatsApp'] },
    { category: 'Professional networking', platforms: ['LinkedIn', 'Yammer'] },
    { category: 'Discussion forums', platforms: ['Reddit', 'Whirlpool', 'Discord', 'Quora'] },
    { category: 'Media sharing', platforms: ['YouTube', 'Flickr', 'Instagram', 'TikTok', 'Pinterest'] },
    { category: 'Microblogging', platforms: ['Tumblr', 'Blogger', 'X'] },
    { category: 'Audio publishing', platforms: ['Spotify', 'iTunes', 'Podcasts'] },
    { category: 'Text publishing', platforms: ['Blogs', 'SlideShare'] },
    { category: 'Knowledge aggregation', platforms: ['Wikipedia'] },
    { category: 'Booking sites & apps', platforms: ['HealthEngine', 'Whitecoat', 'Podium'] },
  ];
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const goToCard = (index: number) => {
    setCardVisible(false);
    setTimeout(() => {
      setCarouselIndex(index);
      setCardVisible(true);
    }, 150);
  };
  const prevCard = () => goToCard((carouselIndex - 1 + platformCategories.length) % platformCategories.length);
  const nextCard = () => goToCard((carouselIndex + 1) % platformCategories.length);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? nextCard() : prevCard();
    setTouchStartX(null);
  };

  const auditFeatures = [
    {
      icon: <Globe className="w-7 h-7 text-blue-500/80" />,
      heading: 'Page-by-page analysis',
      description: 'Check up to 6 pages from your practice website — homepage, services, about, testimonials, pricing, and more.',
    },
    {
      icon: <AlertTriangle className="w-7 h-7 text-blue-500/80" />,
      heading: 'Severity-rated findings',
      description: 'Every issue rated High, Medium, or Low with a plain-English explanation of the breach and the specific guideline it relates to.',
    },
    {
      icon: <ClipboardList className="w-7 h-7 text-blue-500/80" />,
      heading: 'Actionable recommendations',
      description: 'Each finding includes a specific recommendation so you know exactly what needs to change and why.',
    },
    {
      icon: <FileText className="w-7 h-7 text-blue-500/80" />,
      heading: 'Downloadable audit report',
      description: 'Receive a professionally formatted audit report you can save, share with your team, or use as a compliance record.',
    },
    {
      icon: <Shield className="w-7 h-7 text-blue-500/80" />,
      heading: 'AHPRA and TGA rules',
      description: 'Checked against AHPRA advertising guidelines and TGA therapeutic goods advertising rules — the same primary sources used for post checking.',
    },
    {
      icon: <BadgeCheck className="w-7 h-7 text-blue-500/80" />,
      heading: 'Subscriber add-on',
      description: 'Available to all active SafePost subscribers as a one-time add-on for $149 AUD (incl. GST) per website audit.',
    },
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
      description: 'Three suggested alternatives generated instantly. Available on all plans including Starter.',
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
      <Helmet>
        <title>Features — SafePost Compliance Checker</title>
        <meta name="description" content="Instant compliance checks, detailed verdicts, team management and history. See everything SafePost's AI compliance platform can do for your practice." />
      </Helmet>

      <PublicHeader />


      {/* Page Hero */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Everything you need to stay compliant online
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-3xl mx-auto">
            SafePost covers the two biggest compliance risks for Australian medical practitioners — your social media content and your practice website.
          </p>
        </div>
      </section>

      {/* Social Media Section Hero */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-8 md:pb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Social media and advertising compliance
          </h2>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-3xl mx-auto">
            Check your posts and ads against 174 AHPRA and TGA rules before you publish — in seconds.
          </p>
        </div>
      </section>

      {/* Hero Image */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-2xl mx-auto px-6 mb-10 md:mb-12">
          <img
            src={heroImage}
            alt="SafePost AHPRA and TGA compliance checking interface showing a post analysis result"
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
        <div className="max-w-6xl mx-auto px-6 pb-16 md:pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm h-full flex flex-col min-h-[280px]"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                  {feature.heading}
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: '#e2e8f0' }} />
          <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#94a3b8' }}>
            ALSO INCLUDED
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#e2e8f0' }} />
        </div>
      </div>

      {/* Website Compliance Audit */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-16 md:pb-20">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              Website compliance audit
            </h2>
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-3xl mx-auto">
              Check your practice website page by page and get a clear report on exactly what to fix.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {auditFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm h-full flex flex-col min-h-[280px]"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                  {feature.heading}
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
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
