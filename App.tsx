import React, { useState, useRef } from 'react';
import { ShieldCheck, ArrowRight, ChevronDown, ShieldAlert, Users, Clock, Play, CheckCircle, FileText, TrendingUp, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
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
            <a href="#" onClick={(e) => e.preventDefault()} className="px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200">
              Resources
            </a>
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
      </main>

      {/* Footer / Disclaimer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-60">
            <ShieldCheck className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900 font-bold tracking-tight">SafePost Compliance Checker</span>
          </div>
          <p className="text-[10px] text-gray-400 max-w-2xl mx-auto leading-relaxed tracking-wide">
            Disclaimer: This application is an AI-powered guidance tool and does not constitute legal or regulatory advice.
            Ahpra and the National Boards do not provide pre-approval for advertising.
            Registered health practitioners are ultimately responsible for ensuring their advertising complies with the Health Practitioner Regulation National Law.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
