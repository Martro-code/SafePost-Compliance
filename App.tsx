import React, { useState, useRef } from 'react';
import { Search, ShieldCheck, AlertCircle, CheckCircle2, Loader2, Info, ArrowRight, AlertTriangle, Image as ImageIcon, X, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';
import { analyzePost, generateCompliantRewrites } from './services/geminiService';
import { AnalysisResult, ComplianceStatus, RewrittenPost } from './types';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<RewrittenPost[] | null>(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

  const getStatusConfig = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.COMPLIANT:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-600',
          badge: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
          glow: '0 0 40px rgba(16, 185, 129, 0.08)',
        };
      case ComplianceStatus.NON_COMPLIANT:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-600',
          badge: 'bg-red-100 text-red-700 ring-1 ring-red-200',
          glow: '0 0 40px rgba(239, 68, 68, 0.06)',
        };
      case ComplianceStatus.WARNING:
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
          glow: '0 0 40px rgba(245, 158, 11, 0.06)',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-500',
          badge: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
          glow: 'none',
        };
    }
  };

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.COMPLIANT: return <CheckCircle2 className="w-10 h-10 text-emerald-500" />;
      case ComplianceStatus.NON_COMPLIANT: return <AlertCircle className="w-10 h-10 text-red-500" />;
      case ComplianceStatus.WARNING: return <AlertTriangle className="w-10 h-10 text-amber-500" />;
      default: return <Info className="w-10 h-10 text-gray-400" />;
    }
  };

  const statusConfig = result ? getStatusConfig(result.status) : null;

  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06]" style={{ background: 'rgba(247, 247, 244, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Ahpra Guidelines', href: 'https://www.ahpra.gov.au/Resources/Advertising-hub/Advertising-guidelines-and-other-guidance/Advertising-guidelines.aspx' },
              { label: 'Social Media Guide', href: 'https://www.ahpra.gov.au/Resources/Social-media-guidance.aspx' },
              { label: 'Code of Conduct', href: 'https://www.medicalboard.gov.au/Codes-Guidelines-Policies/Code-of-conduct.aspx' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/[0.04] transition-all duration-200"
              >
                {link.label}
                <ExternalLink className="w-3 h-3 opacity-40" />
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center">
        {/* Hero / Search Section */}
        <section className={`w-full flex flex-col items-center transition-all duration-700 ease-out ${result ? 'pt-12 pb-8' : 'pt-28 md:pt-36 pb-16'}`}>
          <div className="max-w-2xl w-full px-6 text-center">
            {!result && (
              <div className="mb-12 space-y-5 fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/15 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-xs font-medium text-blue-700 tracking-wide">AI-Powered Compliance Analysis</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
                  <span className="gradient-text">Verify your content</span>
                  <br />
                  <span className="gradient-text-blue">before you post.</span>
                </h2>
                <p className="text-base text-gray-500 max-w-lg mx-auto leading-relaxed">
                  Instant Ahpra compliance checks for medical practitioners. Paste your draft social media or advertising post to identify potential regulatory breaches.
                </p>
              </div>
            )}

            {/* Input Card */}
            <div className="w-full rounded-2xl bg-white border border-black/[0.06] input-glow overflow-hidden">
              <div className="relative">
                <div className="absolute top-4 left-4 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste your social media post content here..."
                  className="w-full min-h-[140px] pl-12 pr-5 py-4 text-[15px] bg-transparent outline-none resize-none leading-relaxed"
                />
              </div>

              {selectedImage && (
                <div className="px-4 pb-4">
                  <div className="relative inline-block group">
                    <img src={selectedImage} alt="Preview" className="h-28 w-auto rounded-xl border border-black/10 object-cover" />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 border border-black/10 shadow-sm hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}

              <div className="px-4 py-3 border-t border-black/[0.04] flex items-center justify-between">
                <div className="flex items-center">
                   <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                   />
                   <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-black/[0.03]"
                   >
                     <ImageIcon className="w-4 h-4" />
                     {selectedImage ? 'Change Image' : 'Attach Image'}
                   </button>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">
                  {input.length > 0 ? `${input.length} chars` : ''}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={loading || (!input.trim() && !selectedImage) || !!result}
                className="btn-primary px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center gap-2.5 text-[15px] active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none hover:shadow-blue-500/30 hover:translate-y-[-1px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span className="pulse-subtle">Analysing Guidelines...</span>
                  </>
                ) : (
                  <>
                    Check Compliance
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-left fade-in">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 leading-relaxed">{error}</p>
              </div>
            )}
          </div>
        </section>

        {/* Results Section */}
        {result && statusConfig && (
          <section id="results-section" className="w-full pb-24 slide-up">
            <div className="max-w-3xl mx-auto px-6">
              {/* Section Label */}
              <div className="flex items-center gap-2.5 mb-8">
                <div className="h-px flex-grow bg-gradient-to-r from-black/[0.08] to-transparent" />
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em]">Analysis Report</span>
                <div className="h-px flex-grow bg-gradient-to-l from-black/[0.08] to-transparent" />
              </div>

              {/* Verdict Card */}
              <div
                className={`p-8 rounded-2xl border ${statusConfig.border} ${statusConfig.bg} mb-8`}
                style={{ boxShadow: statusConfig.glow }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex items-start gap-4 flex-grow">
                    <div className="mt-0.5 flex-shrink-0">
                      {getStatusIcon(result.status)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${statusConfig.badge}`}>
                          {result.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 leading-snug">{result.summary}</p>
                    </div>
                  </div>
                  <div className="glass-card p-4 rounded-xl max-w-xs flex-shrink-0">
                    <p className="text-[13px] text-gray-600 italic leading-relaxed">{result.overallVerdict}</p>
                  </div>
                </div>
              </div>

              {/* Issues */}
              {result.issues.length > 0 && (
                <div className="space-y-4">
                  <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wider px-1 mb-6">
                    Identified Compliance Risks
                    <span className="ml-2 text-gray-400">({result.issues.length})</span>
                  </h5>
                  {result.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="glass-card rounded-xl p-6 hover:border-black/[0.1] transition-all duration-300"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          issue.severity === 'Critical'
                            ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
                            : 'bg-amber-50 text-amber-600 ring-1 ring-amber-200'
                        }`}>
                          {issue.severity}
                        </span>
                        <span className="text-[11px] font-mono text-gray-400">{issue.guidelineReference}</span>
                      </div>
                      <h6 className="text-[15px] font-semibold text-gray-900 mb-4 leading-snug">{issue.finding}</h6>
                      <div className="pt-4 border-t border-black/[0.04]">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.15em] mb-1.5">Recommended Action</p>
                        <p className="text-[13px] text-gray-500 leading-relaxed">{issue.recommendation}</p>
                      </div>
                    </div>
                  ))}

                  {/* Generate Suggestions CTA */}
                  {!suggestions && (
                    <div className="mt-10 flex flex-col items-center fade-in">
                       <p className="text-gray-400 mb-4 text-sm">Want to fix these issues automatically?</p>
                       <button
                         onClick={handleGenerateSuggestions}
                         disabled={suggestionsLoading}
                         className="group px-6 py-3 bg-white border border-black/[0.08] hover:border-purple-400/40 hover:bg-purple-50 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2.5 text-[14px] text-gray-700 hover:text-gray-900 active:scale-[0.97]"
                       >
                         {suggestionsLoading ? (
                           <>
                             <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                             <span className="pulse-subtle">Drafting Compliant Versions...</span>
                           </>
                         ) : (
                           <>
                             <Sparkles className="w-4 h-4 text-purple-500 group-hover:text-purple-600 transition-colors" />
                             Generate Compliant Rewrites
                           </>
                         )}
                       </button>
                    </div>
                  )}
                </div>
              )}

              {/* Suggestions */}
              {suggestions && (
                <div id="suggestions-section" className="mt-12 pt-10 slide-up">
                  <div className="flex items-center gap-2.5 mb-8">
                    <div className="h-px flex-grow bg-gradient-to-r from-black/[0.08] to-transparent" />
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      Compliant Drafts
                    </span>
                    <div className="h-px flex-grow bg-gradient-to-l from-black/[0.08] to-transparent" />
                  </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {suggestions.map((item, idx) => (
                       <div
                         key={idx}
                         className="flex flex-col glass-card rounded-xl overflow-hidden hover:border-purple-300/30 transition-all duration-300 group"
                         style={{ animationDelay: `${idx * 100}ms` }}
                       >
                         <div className="h-[2px] bg-gradient-to-r from-purple-400/60 via-blue-400/60 to-indigo-400/60" />
                         <div className="p-5 flex flex-col flex-grow">
                           <h4 className="font-semibold text-gray-900 text-sm mb-2">{item.optionTitle}</h4>
                           <p className="text-[11px] text-purple-700 bg-purple-50 border border-purple-100 p-2 rounded-lg mb-4 leading-relaxed italic">
                             {item.explanation}
                           </p>

                           <div className="flex-grow bg-gray-50 rounded-lg p-3.5 text-[13px] text-gray-700 whitespace-pre-wrap mb-4 leading-relaxed border border-black/[0.04]">
                             {item.content}
                           </div>

                           <button
                              onClick={() => copyToClipboard(item.content, idx)}
                              className="w-full py-2.5 flex items-center justify-center gap-2 text-[13px] font-medium text-gray-500 bg-white border border-black/[0.06] rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                           >
                             {copiedIndex === idx ? (
                               <>
                                 <Check className="w-3.5 h-3.5 text-emerald-500" />
                                 <span className="text-emerald-600">Copied!</span>
                               </>
                             ) : (
                               <>
                                 <Copy className="w-3.5 h-3.5" />
                                 Copy Text
                               </>
                             )}
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {/* Compliant - No Issues */}
              {result.status === ComplianceStatus.COMPLIANT && result.issues.length === 0 && (
                <div className="glass-card rounded-2xl p-12 text-center fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">No Compliance Issues Detected</h4>
                  <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                    Based on our analysis against the Ahpra guidelines, this post appears to be compliant.
                    Always ensure you maintain professional registration details and follow standard disclosure requirements.
                  </p>
                </div>
              )}

              {/* Reset Button */}
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleReset}
                  className="btn-primary px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center gap-2.5 text-[15px] active:scale-[0.97] hover:shadow-blue-500/30 hover:translate-y-[-1px]"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  New Analysis
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <ShieldCheck className="w-3 h-3 text-blue-500/60" />
            </div>
            <span className="text-[13px] text-gray-400 font-medium tracking-tight">SafePost Compliance</span>
          </div>
          <p className="text-[11px] text-gray-400 max-w-xl mx-auto leading-relaxed">
            This application is an AI-powered guidance tool and does not constitute legal or regulatory advice.
            Ahpra and the National Boards do not provide pre-approval for advertising.
            Registered health practitioners are ultimately responsible for ensuring their advertising complies with the Health Practitioner Regulation National Law.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
