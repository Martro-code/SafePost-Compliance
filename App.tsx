import React, { useState, useRef } from 'react';
import { ShieldCheck, ArrowRight, ChevronDown, ShieldAlert, Users, Clock, Play, CheckCircle, FileText, TrendingUp, CheckCircle2, AlertCircle, AlertTriangle, Info, Menu, X, ExternalLink } from 'lucide-react';
import { analyzePost, generateCompliantRewrites } from './services/geminiService';
import { AnalysisResult, ComplianceStatus, RewrittenPost } from './types';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Suggestion State
  const [suggestions, setSuggestions] = useState<RewrittenPost[] | null>(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [customersDropdownOpen, setCustomersDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const resourceLinks = [
    { label: 'Ahpra advertising guidelines', href: 'https://www.ahpra.gov.au/Resources/Advertising-hub.aspx' },
    { label: 'Code of conduct for doctors', href: 'https://www.ahpra.gov.au/documents/default.aspx?record=WD20%2f30051&dbid=AP&chksum=9BSTs75R4%2fcPJY7vrmzHPg%3d%3d&_gl=1*1db63l6*_ga*MTk3OTQ0NjMyOC4xNzYxNDU3NTU5*_ga_F1G6LRCHZB*czE3NzExOTIyNDkkbzYkZzAkdDE3NzExOTIyNDkkajYwJGwwJGgw' },
    { label: 'TGA advertising guidelines', href: 'https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media' },
    { label: 'AMA guide to social media', href: 'https://www.ama.com.au/sites/default/files/2021-04/2020%20AMA%20Social%20Media%20Guide.pdf' },
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file (JPEG or PNG).");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!input.trim() && !selectedImage) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSuggestions(null);

    try {
      let imageData = undefined;
      if (selectedImage) {
        const matches = selectedImage.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          imageData = { mimeType: matches[1], base64: matches[2] };
        }
      }
      const analysis = await analyzePost(input, imageData);
      setResult(analysis);
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!result || !input) return;

    setSuggestionsLoading(true);
    try {
      const rewrites = await generateCompliantRewrites(input, result.issues);
      setSuggestions(rewrites);
      setTimeout(() => {
        document.getElementById('suggestions-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError("Could not generate suggestions. Please try again.");
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setResult(null);
    setSuggestions(null);
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && (input.trim() || selectedImage) && !result) {
        handleAnalyze();
      }
    }
  };

  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.COMPLIANT: return 'text-green-600 bg-green-50 border-green-200';
      case ComplianceStatus.NON_COMPLIANT: return 'text-red-600 bg-red-50 border-red-200';
      case ComplianceStatus.WARNING: return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.COMPLIANT: return <CheckCircle2 className="w-12 h-12 text-green-600 flex-shrink-0" />;
      case ComplianceStatus.NON_COMPLIANT: return <AlertCircle className="w-12 h-12 text-red-600 flex-shrink-0" />;
      case ComplianceStatus.WARNING: return <AlertTriangle className="w-12 h-12 text-amber-600 flex-shrink-0" />;
      default: return <Info className="w-12 h-12 text-gray-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <ShieldCheck className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
              SafePost<span className="text-blue-600 ml-0.5">.</span>
            </span>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <a href="#" onClick={(e) => e.preventDefault()} className="px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Product
            </a>
            <div className="relative">
              <button
                onClick={() => setCustomersDropdownOpen(!customersDropdownOpen)}
                onBlur={() => setTimeout(() => setCustomersDropdownOpen(false), 150)}
                className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                Customers
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${customersDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {customersDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-black/[0.06] shadow-lg shadow-black/[0.06] py-1.5 fade-in">
                  <a href="#" onClick={(e) => e.preventDefault()} className="block px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Medical Practitioners
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()} className="block px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    Medical Practices
                  </a>
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
                  <a href="#" onClick={(e) => e.preventDefault()} className="block px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    About
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()} className="block px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-colors">
                    News
                  </a>
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

          {/* Right: Auth buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <button onClick={() => {}} className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200">
              Login
            </button>
            <button onClick={() => {}} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
              Sign Up
            </button>
          </div>

          {/* Mobile: Hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-5 pt-2 border-t border-black/[0.06] space-y-1">
            <a href="#" onClick={(e) => e.preventDefault()} className="block px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Product
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="block px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Customers
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="block px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Company
            </a>

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

            {/* Mobile Auth Buttons */}
            <div className="pt-3 border-t border-black/[0.06] flex flex-col gap-2">
              <button onClick={() => {}} className="w-full px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-200">
                Login
              </button>
              <button onClick={() => {}} className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2.5 text-[13px] font-medium text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all duration-200">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16 md:pb-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-gray-900 mb-6">
              Navigate your online presence and stay{' '}
              <span className="gradient-text-blue">AHPRA-compliant.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl">
              Instant social media and online advertising compliance checks for medical practitioners and practices.
            </p>
          </div>
          {/* Hero image/banner placeholder — add your image here */}
          <div className="mt-12 md:mt-16" />
        </div>
      </section>

      {/* Why AHPRA Compliance Matters */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-14 text-center">
            Why AHPRA compliance matters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                <ShieldAlert className="w-7 h-7 text-blue-500/80" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                Protect your registration
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Non-compliant advertising can trigger AHPRA investigations and disciplinary action. Even unintentional breaches can lead to conditions on your registration, fines, or suspension — putting your entire career at risk.
              </p>
            </div>

            {/* Column 2 */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-blue-500/80" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                Safeguard your professional reputation
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                AHPRA breaches become public record. Misleading claims or unprofessional conduct online can damage patient trust, impact referrals, and harm your practice's reputation in the community for years.
              </p>
            </div>

            {/* Column 3 */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-blue-500/80" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                Navigate complex guidelines with confidence
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                AHPRA's advertising rules are intricate and constantly evolving. Manually checking every post against Section 133, testimonial restrictions, and cosmetic procedure guidelines wastes valuable time — and mistakes are easy to make.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — 3 Steps */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
          <div className="text-center mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              How it works
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mt-4">
              Three simple steps to compliance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm text-center">
              <div className="text-5xl font-extrabold text-blue-600/20 mb-5">1</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                Paste your content
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Copy and paste your social media post, ad copy, or marketing content directly into the tool — no sign-up or setup required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm text-center">
              <div className="text-5xl font-extrabold text-blue-600/20 mb-5">2</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                Get instant analysis
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Our AI analyses your content against AHPRA compliance guidelines and flags specific issues with direct references to the relevant rules and sections.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm text-center">
              <div className="text-5xl font-extrabold text-blue-600/20 mb-5">3</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                Receive compliant alternatives
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Get ready-to-use rewritten versions of your content that meet AHPRA regulatory requirements — so you can post with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities That Trigger Ahpra Investigation */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              Activities that trigger Ahpra investigation
            </h2>
            <p className="text-lg text-gray-500">
              Social media activities that are likely to warrant investigation.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                title: 'Political content that calls for inappropriate action',
                description:
                  'A practitioner posts to social media a condemnation of citizens of a country, or a cultural or religious identity. The post includes a call to action, such as signing a petition or attending a protest march, specifically aimed at denigrating or discriminating against a population or group. Depending on the specific circumstances or events being reported, this is potentially discriminatory and could be a breach of the code of conduct and social media guidance.',
              },
              {
                title: 'Political content that is deliberately biased and not factual',
                description:
                  'A practitioner shares intentionally misleading content about citizens of a country, or a cultural or religious identity that is biased, inflammatory and has the potential to incite racial hatred, intolerance. The content is intended to influence and persuade and is not factual. A member of the public makes a complaint that the content is derogatory, slanderous or offensive, and that it is not factual. Depending on the specific circumstances or events being reported, the content may be a breach of the practitioner\u2019s code of conduct and social media guidance, and a review of the matter reveals that the non-factual material is a repost of private political sentiment that is posted to gain traction against a target group.',
              },
              {
                title: 'Political content that raises concern about unsafe care',
                description:
                  'A practitioner claims in a social media post that the level of care they provide to a person may be affected by the person\u2019s nationality, racial background or the cultural beliefs of the person. This post has the potential to incite fear, racial hatred and intolerance. It also raises concerns that the practitioner\u2019s personal bias might lead to them not providing culturally safe care and/or providing inadequate care to patients from this background. The practitioner\u2019s activity is captured by a member of the public and reported to Ahpra.',
              },
              {
                title: 'Praise for terrorist actions or groups',
                description:
                  'A practitioner creates posts glorifying or supporting violent actions and members of a terrorist organisation. The posts use language like \u2018the resistance\u2019 and other phrasing that makes light of, supports, denies or provides misinformation or propaganda around actions of the group. A colleague sees these posts and is concerned for the safety of the practitioner\u2019s multi-cultural patients so makes a notification to Ahpra. The promotion of misinformation, propaganda and content inciting hatred about another\u2019s country, religion or cultural beliefs could likely result in a National Board taking action in response to the notification.',
              },
            ].map((item, index) => {
              const isOpen = openAccordion === index;
              return (
                <div
                  key={index}
                  className={`rounded-xl border bg-white overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? 'border-black/[0.08] shadow-md shadow-black/[0.04]'
                      : 'border-black/[0.06] shadow-sm shadow-black/[0.02] hover:border-black/[0.1] hover:shadow-md hover:shadow-black/[0.04]'
                  }`}
                >
                  <button
                    onClick={() => setOpenAccordion(isOpen ? null : index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group"
                  >
                    <span className="text-[15px] font-semibold text-gray-900 leading-snug pr-4">
                      {item.title}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                        isOpen ? 'bg-gray-100' : 'bg-gray-50 group-hover:bg-gray-100'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform duration-300 ease-in-out ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                  <div
                    className="transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: isOpen ? '500px' : '0px',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-[14px] text-gray-500 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <main className="flex-grow flex flex-col items-center">
        {/* How It Works — Video Demo */}
        <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
          <div className="max-w-6xl mx-auto px-6 pt-4 md:pt-6 pb-24 md:pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Left Column — Text Content */}
              <div className="space-y-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  How it works
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                  See SafePost™ in action
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed">
                  Watch how SafePost™ identifies AHPRA compliance issues and generates compliant alternatives in seconds.
                </p>
                <p className="text-[15px] text-gray-400 leading-relaxed">
                  Our AI-powered tool analyses your social media posts and advertising content against AHPRA's advertising guidelines, highlights specific breaches with guideline references, and provides ready-to-use compliant alternatives.
                </p>
                <div className="pt-2">
                  <button className="bg-blue-600 hover:bg-blue-700 px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 flex items-center gap-2.5 text-[15px] active:scale-[0.97] hover:shadow-blue-600/30 hover:translate-y-[-1px]">
                    Request Early Access
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column — Video Player Placeholder */}
              <div className="w-full">
                {/* Replace with actual video embed later */}
                <div className="relative w-full rounded-2xl overflow-hidden border border-black/[0.06] shadow-lg shadow-black/[0.04] bg-gray-100"
                     style={{ aspectRatio: '16 / 9' }}>
                  {/* Placeholder — swap this div for a YouTube/Vimeo iframe */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/90 border border-black/[0.06] shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200">
                      <Play className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[11px] font-medium text-gray-400 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      Demo video coming soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Credibility Indicators */}
        <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
          <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-20 pb-24 md:pb-32">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                Built on official AHPRA guidelines
              </h2>
              <p className="text-lg text-gray-500">
                Comprehensive coverage you can trust
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1 — Comprehensive Coverage */}
              <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  <CheckCircle className="w-7 h-7 text-blue-500/80" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  Comprehensive coverage
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  Analyses posts against Section 133 of the National Law, testimonial restrictions, before/after photo regulations, cosmetic procedure advertising rules, and professional conduct standards.
                </p>
              </div>

              {/* Column 2 — Official Guidelines */}
              <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  <FileText className="w-7 h-7 text-blue-500/80" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  Official guidelines
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                  Based directly on AHPRA's Social Media Guidance and Advertising Guidelines. All compliance checks reference current regulations.
                </p>
                <div className="flex flex-col gap-2">
                  <p className="text-[13px] text-gray-400">View official AHPRA guidelines for detailed compliance information.</p>
                </div>
              </div>

              {/* Column 3 — Trusted by Professionals */}
              <div className="bg-white rounded-2xl border border-black/[0.06] p-8 transition-all duration-200 hover:border-black/[0.1] hover:shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-blue-500/80" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  Trusted by medical professionals
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  Designed specifically for Australian medical practitioners and practices navigating complex advertising compliance requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full bg-white">
          <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              Try SafePost™ Now
            </h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
              Protect your practice with instant AHPRA social media activities and advertising compliance checks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {}}
                className="bg-blue-600 hover:bg-blue-700 px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 flex items-center justify-center gap-2.5 text-[15px] active:scale-[0.97] hover:shadow-blue-600/30 hover:translate-y-[-1px] min-w-[180px]"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {}}
                className="px-7 py-3 text-[15px] font-semibold text-gray-600 hover:text-gray-900 rounded-xl border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.97] min-w-[180px]"
              >
                Login
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f7f7f4] border-t border-black/[0.06] pt-14 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Footer Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
            {/* Product */}
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Product</h4>
            </div>

            {/* Pricing */}
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Pricing</h4>
              <ul className="space-y-2.5">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Medical Practitioners</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Medical Practices</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">About</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">News</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="https://www.ahpra.gov.au/Resources/Advertising-hub.aspx" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Ahpra Advertising Guidelines</a></li>
                <li><a href="https://www.ahpra.gov.au/documents/default.aspx?record=WD20%2f30051&dbid=AP&chksum=9BSTs75R4%2fcPJY7vrmzHPg%3d%3d&_gl=1*1db63l6*_ga*MTk3OTQ0NjMyOC4xNzYxNDU3NTU5*_ga_F1G6LRCHZB*czE3NzExOTIyNDkkbzYkZzAkdDE3NzExOTIyNDkkajYwJGwwJGgw" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Code of Conduct for Doctors</a></li>
                <li><a href="https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">TGA Advertising Guidelines</a></li>
                <li><a href="https://www.ama.com.au/sites/default/files/2021-04/2020%20AMA%20Social%20Media%20Guide.pdf" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">AMA Guide to Social Media</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Data Use</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Security</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2.5">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">X</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">LinkedIn</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">YouTube</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Facebook</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Instagram</a></li>
              </ul>
            </div>
          </div>

          {/* Disclaimer + Copyright */}
          <div className="mt-14 pt-6 border-t border-black/[0.06]">
            <p className="text-[10px] text-gray-400 max-w-3xl leading-relaxed tracking-wide">
              Disclaimer: This application is an AI-powered guidance tool and does not constitute legal or regulatory advice.
              Ahpra and the National Boards do not provide pre-approval for advertising.
              Registered health practitioners are ultimately responsible for ensuring their advertising complies with the Health Practitioner Regulation National Law.
            </p>
            <p className="text-[11px] text-gray-400 mt-4">&copy; SafePost&trade; 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
