import React, { useState, useRef } from 'react';
import { Search, ShieldCheck, AlertCircle, CheckCircle2, Loader2, Info, ArrowRight, AlertTriangle, Image as ImageIcon, X, Sparkles, Copy, Check } from 'lucide-react';
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
    setSuggestions(null); // Reset suggestions
    
    try {
      let imageData = undefined;
      if (selectedImage) {
         // Extract base64 data and mime type
         const matches = selectedImage.match(/^data:(.+);base64,(.+)$/);
         if (matches) {
           imageData = { mimeType: matches[1], base64: matches[2] };
         }
      }

      const analysis = await analyzePost(input, imageData);
      setResult(analysis);
      // Scroll to result on mobile
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
      // Allow submission if not loading, has content, and no current result (matching button logic)
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
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
              SafePost <span className="text-blue-600 font-medium">Compliance</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a 
              href="https://www.ahpra.gov.au/Resources/Advertising-hub/Advertising-guidelines-and-other-guidance/Advertising-guidelines.aspx" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              View Ahpra Guidelines
            </a>
            <a 
              href="https://www.ahpra.gov.au/Resources/Social-media-guidance.aspx" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              View Social Media Guidelines
            </a>
            <a 
              href="https://www.medicalboard.gov.au/Codes-Guidelines-Policies/Code-of-conduct.aspx" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              View Code of Conduct for Doctors
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center">
        {/* Search Layout Section */}
        <section className={`w-full flex flex-col items-center transition-all duration-500 ease-in-out ${result ? 'pt-12 pb-8' : 'pt-32 pb-12'}`}>
          <div className="max-w-3xl w-full px-4 text-center">
            {!result && (
              <div className="mb-10 space-y-4">
                <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                  Verify Your Social Content
                </h2>
                <p className="text-base text-gray-600 max-w-3xl mx-auto">
                  Instant Ahpra compliance check for medical practitioners and practices. Paste your draft social media or advertising post or upload an image to identify potential regulatory breaches.
                </p>
              </div>
            )}

            <div className="w-full bg-white border border-gray-200 rounded-3xl shadow-sm focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-[#21409A] transition-all overflow-hidden">
              <div className="relative">
                <div className="absolute top-4 left-5 text-gray-400">
                  <Search className="w-6 h-6" />
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste your social media post content here..."
                  className="w-full min-h-[160px] pl-14 pr-5 py-4 text-lg outline-none resize-none placeholder:text-gray-400"
                />
              </div>

              {selectedImage && (
                <div className="px-5 pb-4">
                  <div className="relative inline-block">
                    <img src={selectedImage} alt="Preview" className="h-32 w-auto rounded-lg border border-gray-200 object-cover" />
                    <button 
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
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
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
                   >
                     <ImageIcon className="w-5 h-5" />
                     {selectedImage ? 'Change Image' : 'Attach Image'}
                   </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={loading || (!input.trim() && !selectedImage) || !!result}
                style={{ backgroundColor: 'rgb(33, 64, 154)' }}
                className="px-8 py-3 hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 text-white rounded-full font-semibold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2 text-lg active:scale-95 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analysing Guidelines...
                  </>
                ) : (
                  <>
                    Check Compliance
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 text-left">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
            )}
          </div>
        </section>

        {/* Results Section */}
        {result && (
          <section id="results-section" className="w-full bg-gray-50 border-t border-gray-200 pb-24">
            <div className="max-w-4xl mx-auto px-4 py-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-5 h-5 text-blue-600">
                  <Info className="w-full h-full" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 uppercase tracking-wider">Analysis Report</h3>
              </div>

              {/* Summary Card */}
              <div className={`p-8 rounded-3xl border shadow-sm mb-8 ${getStatusColor(result.status)}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    {getStatusIcon(result.status)}
                    <div>
                      <span className="text-sm font-bold uppercase tracking-widest mb-1 block opacity-80">Verdict</span>
                      <h4 className="text-3xl font-black mb-2">{result.status.replace('_', ' ')}</h4>
                      <p className="text-gray-800 text-lg font-medium leading-relaxed">{result.summary}</p>
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-current/10 max-w-sm">
                    <p className="text-sm italic font-medium opacity-90">{result.overallVerdict}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Issues */}
              {result.issues.length > 0 && (
                <div className="space-y-6">
                  <h5 className="text-xl font-bold text-gray-900 px-2">Identified Compliance Risks</h5>
                  {result.issues.map((issue, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${issue.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {issue.severity}
                          </span>
                          <span className="text-xs font-semibold text-gray-400 font-mono italic">Ref: {issue.guidelineReference}</span>
                        </div>
                      </div>
                      <h6 className="text-lg font-bold text-gray-800 mb-2">{issue.finding}</h6>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Recommended Action</p>
                        <p className="text-gray-600 leading-relaxed text-sm">{issue.recommendation}</p>
                      </div>
                    </div>
                  ))}

                  {/* Generate Suggestions Action */}
                  {!suggestions && (
                    <div className="mt-10 flex flex-col items-center">
                       <p className="text-gray-500 mb-4 text-sm font-medium">Want to fix these issues automatically?</p>
                       <button
                         onClick={handleGenerateSuggestions}
                         disabled={suggestionsLoading}
                         className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2 active:scale-95"
                       >
                         {suggestionsLoading ? (
                           <>
                             <Loader2 className="w-5 h-5 animate-spin" />
                             Drafting Compliant Versions...
                           </>
                         ) : (
                           <>
                             <Sparkles className="w-5 h-5" />
                             Generate Compliant Rewrites
                           </>
                         )}
                       </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Suggestions Display Section */}
              {suggestions && (
                <div id="suggestions-section" className="mt-12 pt-10 border-t-2 border-dashed border-gray-200">
                   <div className="flex items-center gap-2 mb-6 px-2">
                     <Sparkles className="w-6 h-6 text-purple-600" />
                     <h3 className="text-xl font-bold text-gray-900">Recommended Compliant Drafts</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {suggestions.map((item, idx) => (
                       <div key={idx} className="flex flex-col bg-white border border-purple-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 relative overflow-hidden ring-1 ring-purple-50">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-blue-500"></div>
                         
                         <h4 className="font-bold text-gray-900 mb-3">{item.optionTitle}</h4>
                         <p className="text-xs text-purple-700 bg-purple-50 p-2 rounded-lg mb-4 border border-purple-100 italic">
                           {item.explanation}
                         </p>
                         
                         <div className="flex-grow bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap mb-4 font-medium leading-relaxed border border-gray-100">
                           {item.content}
                         </div>
                         
                         <button
                            onClick={() => copyToClipboard(item.content, idx)}
                            className="mt-auto w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                         >
                           {copiedIndex === idx ? (
                             <>
                               <Check className="w-4 h-4 text-green-600" />
                               <span className="text-green-600">Copied!</span>
                             </>
                           ) : (
                             <>
                               <Copy className="w-4 h-4" />
                               Copy Text
                             </>
                           )}
                         </button>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {result.status === ComplianceStatus.COMPLIANT && result.issues.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">No Compliance Issues Detected</h4>
                  <p className="text-gray-600 max-w-lg mx-auto">
                    Based on our analysis against the Ahpra guidelines, this post appears to be compliant. 
                    However, always ensure you maintain professional registration details and follow standard disclosure requirements.
                  </p>
                </div>
              )}

              {/* Back to Home Button */}
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleReset}
                  style={{ backgroundColor: 'rgb(33, 64, 154)' }}
                  className="px-8 py-3 hover:brightness-110 text-white rounded-full font-semibold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2 text-lg active:scale-95"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                  Back to Home
                </button>
              </div>
            </div>
          </section>
        )}
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