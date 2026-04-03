import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowRight, Paperclip, Loader2, AlertTriangle, CheckCircle2, XCircle, Clock, Rocket, ChevronRight, Lock, Upload, Download, X, FileUp, ShieldOff } from 'lucide-react';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import OnboardingModal from '../components/ui/OnboardingModal';
import { useAuth } from '../hooks/useAuth';
import { useComplianceChecker } from '../hooks/useComplianceChecker';
import { useAccount } from '../context/AccountContext';
import { supabase } from '../services/supabaseClient';
import { ComplianceResults } from '../components/compliance/ComplianceResults';
import { generateCompliantRewrites } from '../services/complianceService';
import { getDisplayPlanName, getNextPlanTier, getPlanTierLabel } from '../utils/planUtils';
import { extractTextFromFile } from '../utils/fileExtraction';
import { trackComplianceCheckRun } from '../services/analytics';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsAreaRef = useRef<HTMLDivElement>(null);
  const { firstName, signOut } = useAuth();
  const { accountId, plan: accountPlan, billingPeriod: accountBillingPeriod, checksUsed, checksLimit, refreshAccount } = useAccount();

  // Use account-level plan, fall back to URL param for initial render
  const rawPlan = accountPlan || searchParams.get('plan') || '';
  const planName = rawPlan || 'starter';
  const billingPeriod = accountBillingPeriod || searchParams.get('billing') || '';

  const checker = useComplianceChecker({
    planName,
    accountId,
    checksUsed,
    checksLimit,
    onCheckComplete: refreshAccount,
  });

  const hasPaidPlan = planName && !['free', 'starter'].includes(planName.toLowerCase());

  const formatBillingPeriod = (period: string) => {
    return period.charAt(0).toUpperCase() + period.slice(1).toLowerCase();
  };

  const isUltra = planName.toLowerCase() === 'ultra';
  const nextTier = getNextPlanTier(planName);

  // Form state
  const [content, setContent] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [view, setView] = useState<'input' | 'loading' | 'results'>('input');

  // Document upload state (hybrid file upload)
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isExtractingText, setIsExtractingText] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Bulk upload state
  const [inputMode, setInputMode] = useState<'single' | 'bulk'>('single');
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [showBulkToast, setShowBulkToast] = useState(false);
  const [showBulkTooltip, setShowBulkTooltip] = useState(false);

  // If navigating from History with a specific check, load it immediately
  const historyState = location.state as { fromHistory?: boolean; checkId?: string; checkResult?: any; contentText?: string; createdAt?: string; cancelled?: boolean; cancelDate?: string } | null;

  // Track whether the current result is a historical check (from sidebar or History page)
  const [isHistorical, setIsHistorical] = useState(false);
  const [historicalCheckedAt, setHistoricalCheckedAt] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (historyState?.fromHistory && historyState.checkResult) {
      checker.loadCheck({
        id: historyState.checkId ?? '',
        result_json: historyState.checkResult,
        overall_status: historyState.checkResult.overall_status,
        content_text: historyState.contentText ?? '',
      } as any);
      setContent(historyState.contentText ?? '');
      setView('results');
      setIsHistorical(true);
      setHistoricalCheckedAt(historyState.createdAt);
      // Clear the location state so refreshing / re-navigating doesn't replay
      window.history.replaceState({}, '');
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // Restore results view if a previous result exists in session (non-History navigation)
  useEffect(() => {
    if (!historyState?.fromHistory && checker.result && view === 'input') {
      setView('results');
    }
  }, [checker.result]);

  // Reset to clean state when navigating away from the Dashboard
  useEffect(() => {
    return () => {
      setContent('');
      setAttachedFile(null);
      setDocumentFile(null);
      setExtractionError(null);
      setPdfError(false);
      setView('input');
      checker.resetChecker();
    };
  }, []);

  // Onboarding modal state — driven by Supabase user metadata
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check Supabase user metadata flag
        if (user.user_metadata?.onboarding_completed === true) return;

        // Secondary check: if user has existing compliance checks, treat as onboarded
        const { count, error } = await supabase
          .from('compliance_checks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (!error && count && count > 0) {
          // Backfill the metadata flag so we skip the DB query next time
          await supabase.auth.updateUser({ data: { onboarding_completed: true } });
          return;
        }

        // No flag and no existing checks — show the modal
        setShowOnboarding(true);
      } catch (err) {
        console.error('Failed to check onboarding status:', err);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    try {
      await supabase.auth.updateUser({ data: { onboarding_completed: true } });
    } catch (err) {
      console.error('Failed to save onboarding status:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'conduct_risk':
        return <ShieldOff className="w-4 h-4 text-gray-800 dark:text-purple-500 flex-shrink-0" />;
      case 'non_compliant':
      case 'non-compliant':
        return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
      case 'compliant':
        return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
      case 'warning':
      case 'requires_review':
        return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const handleCheckCompliance = async () => {
    if (!content.trim() && !pdfBase64) return;
    console.log('[handleCheckCompliance] submitting content to runCheck:', {
      length: content.length,
      preview: content.slice(0, 300),
      fromDocumentUpload: !!documentFile,
      isPdf: !!pdfBase64,
    });
    setView('loading');
    setIsHistorical(false);
    setHistoricalCheckedAt(undefined);
    trackComplianceCheckRun('general', 'social_media_post');
    await checker.runCheck(content, 'social_media_post', 'general', {
      pdfBase64: pdfBase64 ?? undefined,
      onExtractedText: setContent,
    });
    setView('results');
  };

  const handleNewCheck = () => {
    setContent('');
    setAttachedFile(null);
    setDocumentFile(null);
    setExtractionError(null);
    setPdfBase64(null);
    setView('input');
    setIsHistorical(false);
    setHistoricalCheckedAt(undefined);
    checker.resetChecker();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
      setDocumentFile(null); // mutual exclusivity
    }
  };

  // Document upload: extract text from .txt/.docx → populate textarea; for .pdf → store base64
  const handleDocumentUpload = async (file: File) => {
    setDocumentFile(file);
    setAttachedFile(null); // mutual exclusivity
    setPdfBase64(null);
    setIsExtractingText(true);
    setExtractionError(null);
    try {
      const result = await extractTextFromFile(file);

      if (result.type === 'pdf') {
        // PDF: store base64 for server-side analysis; Claude will extract the text
        setPdfBase64(result.base64);
        setContent('');
        return;
      }

      // .txt / .docx: populate textarea for review before submitting
      const text = result.content;
      console.log('[handleDocumentUpload] extracted text result:', {
        fileName: file.name,
        length: text.length,
        preview: text.slice(0, 300),
        isEmpty: !text.trim(),
        charCodes: text.slice(0, 50).split('').map(c => c.charCodeAt(0)),
      });

      if (!text.trim() || text.trim().length < 10) {
        setExtractionError(
          "We couldn't extract text from your file. Please check the file is not empty or try copying the content into the text area directly.",
        );
        setDocumentFile(null);
        return;
      }

      setContent(text);
    } catch (err) {
      console.error('Failed to extract text from file:', err);
      setExtractionError('Failed to extract text from the uploaded file. Please try a different file.');
    } finally {
      setIsExtractingText(false);
    }
  };

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleDocumentUpload(e.target.files[0]);
    }
  };

  return (
    <LoggedInLayout>
      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          firstName={firstName}
          planName={planName}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Bulk upload Toast */}
      {showBulkToast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-gray-900 text-white text-[13px] font-medium rounded-xl shadow-lg shadow-black/20">
          Coming soon
        </div>
      )}

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* Cancellation Banner */}
        {historyState?.cancelled && (
          <div className="mb-6 px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between dark:bg-amber-900/20 dark:border-amber-800">
            <p className="text-[13px] text-amber-700 dark:text-amber-300">
              Your subscription ends on {historyState.cancelDate || 'your next billing date'}. Reactivate anytime.
            </p>
            <button
              onClick={() => {
                navigate('/pricing/medical-practitioners');
              }}
              className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0 ml-4 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Reactivate
            </button>
          </div>
        )}

        {/* Two-column grid: on mobile, sidebar cards appear first via order classes */}
        <div className="relative grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6">

          {/* LEFT COLUMN - Compliance Checker */}
          <div ref={resultsAreaRef} className="space-y-6 order-2 md:order-1">
            {/* Welcome */}
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2 dark:text-white">
                {firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}
              </h2>
              <p className="text-[14px] text-gray-500 dark:text-gray-300">
                Instant AHPRA and TGA compliance check for medical practitioners and practices
              </p>
            </div>

            {/* Active Plan Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[13px] font-semibold text-blue-700 dark:text-blue-300">
                {getDisplayPlanName(planName)}
              </span>
              <span className="text-[12px] text-blue-400 dark:text-blue-500">
                &middot; {billingPeriod ? formatBillingPeriod(billingPeriod) : 'Monthly'}
              </span>
            </div>

            {/* Input / Loading / Results views */}
            {view === 'input' && inputMode === 'single' && (
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6 md:p-8 space-y-4">
                {/* Bulk upload pill — top-right of card */}
                <div className="relative flex justify-end -mt-1 -mb-1">
                  <button
                    onClick={() => {
                      if (isUltra) {
                        setInputMode('bulk');
                      }
                    }}
                    onMouseEnter={() => !isUltra && setShowBulkTooltip(true)}
                    onMouseLeave={() => setShowBulkTooltip(false)}
                    className={`border text-[12px] rounded-full px-3 py-1 flex items-center gap-1.5 transition-all duration-200 ${
                      isUltra
                        ? 'border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:text-gray-300'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed dark:border-gray-600 dark:text-gray-500'
                    }`}
                  >
                    {!isUltra && <Lock className="w-3 h-3" />}
                    <Upload className="w-3 h-3" />
                    Bulk upload
                  </button>
                  {showBulkTooltip && !isUltra && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-[12px] rounded-lg whitespace-nowrap shadow-lg z-10">
                      Bulk upload is available on SafePost Ultra
                      <div className="absolute top-full right-4 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your social media or online advertising content here..."
                  className="w-full min-h-[200px] px-4 py-3 text-[14px] text-gray-900 bg-white rounded-xl border border-gray-200 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />

                {/* Document file indicator */}
                {documentFile && (
                  <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
                    <FileUp className="w-3.5 h-3.5" />
                    <span className="truncate">{documentFile.name}</span>
                    <button
                      onClick={() => { setDocumentFile(null); setContent(''); setPdfBase64(null); setExtractionError(null); }}
                      className="text-gray-400 hover:text-gray-600 ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Attached image indicator */}
                {attachedFile && (
                  <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span className="truncate">{attachedFile.name}</span>
                    <button onClick={() => setAttachedFile(null)} className="text-gray-400 hover:text-gray-600 ml-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Extraction error */}
                {extractionError && (
                  <p className="text-[12px] text-red-500">{extractionError}</p>
                )}

                {/* Upload document — hidden when image is attached */}
                {!attachedFile && !documentFile && (
                  <>
                    <button
                      type="button"
                      onClick={() => documentInputRef.current?.click()}
                      disabled={isExtractingText}
                      className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-700 transition-colors dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
                    >
                      {isExtractingText ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />Extracting text...</>
                      ) : (
                        <><FileUp className="w-4 h-4" />Upload document (.txt, .docx, .pdf)</>
                      )}
                    </button>
                    <input
                      ref={documentInputRef}
                      type="file"
                      accept=".txt,.docx,.pdf"
                      onChange={handleDocumentFileChange}
                      className="hidden"
                    />
                  </>
                )}

                {/* Attach image — paid plans only, hidden when document is attached */}
                {hasPaidPlan && !documentFile && !attachedFile && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-700 transition-colors dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <Paperclip className="w-4 h-4" />
                      Attach image (optional)
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </>
                )}

                {/* Submit */}
                {checker.usage.isAtLimit ? (
                  <div className="space-y-3">
                    <div className="w-full h-12 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
                      <p className="text-[13px] font-medium text-red-600">Monthly check limit reached</p>
                    </div>
                    <button
                      onClick={() => navigate('/change-plan?mode=upgrade')}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5"
                    >
                      Upgrade plan
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckCompliance}
                    disabled={!content.trim() && !pdfBase64}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] hover:shadow-blue-600/30 flex items-center justify-center gap-2.5"
                  >
                    Check compliance
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Bulk upload — Ultra file drop zone */}
            {view === 'input' && inputMode === 'bulk' && isUltra && (
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6 md:p-8 space-y-4">
                <div className="flex justify-end -mt-1 -mb-1">
                  <button
                    onClick={() => setInputMode('single')}
                    className="border border-gray-200 text-[12px] text-gray-500 rounded-full px-3 py-1 flex items-center gap-1.5 hover:text-gray-700 hover:border-gray-300 transition-all duration-200 dark:border-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Single check
                  </button>
                </div>
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer"
                  onClick={() => document.getElementById('bulk-file-input')?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files[0];
                    if (file && (file.name.endsWith('.txt') || file.name.endsWith('.docx'))) {
                      setBulkFile(file);
                    }
                  }}
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <div className="text-center">
                    <p className="text-[14px] font-semibold text-gray-700 dark:text-gray-300">
                      {bulkFile ? bulkFile.name : 'Drop your file here, or click to browse'}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-1">
                      Accepts .txt and .docx files
                    </p>
                  </div>
                  <input
                    id="bulk-file-input"
                    type="file"
                    accept=".txt,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setBulkFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  Upload a text or Word document containing multiple posts — one per line. Each will be checked individually.
                </p>
                <button
                  onClick={(e) => { e.preventDefault(); }}
                  className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download template
                </button>
                {bulkFile && (
                  <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
                    <Upload className="w-3.5 h-3.5" />
                    <span className="truncate">{bulkFile.name}</span>
                    <button onClick={() => setBulkFile(null)} className="text-gray-400 hover:text-gray-600 ml-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => {
                    setShowBulkToast(true);
                    setTimeout(() => setShowBulkToast(false), 3000);
                  }}
                  disabled={!bulkFile}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5"
                >
                  Start bulk check
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {view === 'loading' && (
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 p-12 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-[14px] text-gray-500 dark:text-gray-300 font-medium">Analysing your content for AHPRA and TGA compliance...</p>
              </div>
            )}

            {view === 'results' && checker.result && (
              <ComplianceResults
                result={checker.result}
                originalContent={checker.lastContent || content || sessionStorage.getItem('safepost_last_content') || ''}
                onNewCheck={handleNewCheck}
                onGenerateRewrites={generateCompliantRewrites}
                planName={planName}
                onSaveRewrites={checker.saveRewriteOptions}
                isHistorical={isHistorical}
                checkedAt={historicalCheckedAt}
              />
            )}

            {view === 'results' && checker.error && (
              <div className={`rounded-2xl border p-6 ${checker.authError ? 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800' : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className={`w-5 h-5 ${checker.authError ? 'text-amber-500' : 'text-red-500'}`} />
                  <h3 className={`text-[14px] font-semibold ${checker.authError ? 'text-amber-700 dark:text-amber-300' : 'text-red-700 dark:text-red-300'}`}>
                    {checker.authError ? 'Session expired' : 'Analysis failed'}
                  </h3>
                </div>
                <p className={`text-[13px] ${checker.authError ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>{checker.error}</p>
                {checker.authError ? (
                  <a
                    href="/login"
                    className="mt-4 inline-block text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                  >
                    Log in
                  </a>
                ) : (
                  <button
                    onClick={handleNewCheck}
                    className="mt-4 text-[13px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Try again
                  </button>
                )}
              </div>
            )}

          </div>
          {/* END LEFT COLUMN */}

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6 order-1 md:order-2 md:sticky md:top-20 md:self-start md:max-h-[calc(100vh-6rem)] md:overflow-y-hidden">
            {/* Usage Stats */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500 mb-4">Your Usage</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-[14px] text-gray-700 dark:text-gray-300">
                    {checker.usage.checksUsedThisMonth} {checker.usage.checksUsedThisMonth === 1 ? 'check' : 'checks'} used
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className={`w-4 h-4 ${checker.usage.isAtLimit ? 'text-red-400' : 'text-blue-500'}`} />
                  <span className={`text-[14px] dark:text-gray-300 ${checker.usage.isAtLimit ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                    {checker.usage.planLimit === Infinity
                      ? 'Unlimited remaining'
                      : checker.usage.isAtLimit
                      ? 'Limit reached'
                      : `${checker.usage.checksRemaining} remaining`
                    }
                  </span>
                </div>
              </div>
              <div className="border-t border-black/[0.06] dark:border-gray-700 mt-4 pt-4">
                <p className="text-[12px] text-gray-400 dark:text-gray-500">Resets: {checker.usage.resetDate}</p>
              </div>
            </div>

            {/* Upgrade / Upsell CTA — shown when a higher plan tier exists */}
            {nextTier && (
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 dark:bg-blue-950 dark:border-blue-900">
                <div className="flex items-center gap-2.5 mb-3">
                  <Rocket className="w-5 h-5 text-blue-600" />
                  <h3 className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider dark:text-blue-400">
                    Upgrade to {getPlanTierLabel(nextTier)}
                  </h3>
                </div>
                <ul className="space-y-2.5 mb-5">
                  <li className="flex items-center gap-2.5 text-[13px] text-gray-700 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    More monthly compliance checks
                  </li>
                  <li className="flex items-center gap-2.5 text-[13px] text-gray-700 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    AI-powered suggested rewrites
                  </li>
                  <li className="flex items-center gap-2.5 text-[13px] text-gray-700 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    Full compliance history tracking
                  </li>
                  <li className="flex items-center gap-2.5 text-[13px] text-gray-700 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    Image attachment analysis
                  </li>
                  <li className="flex items-center gap-2.5 text-[13px] text-gray-700 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    Priority support
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/change-plan?mode=upgrade')}
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
                >
                  Upgrade to {getPlanTierLabel(nextTier)}
                </button>
              </div>
            )}

            {/* Recent Checks */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500 mb-4">Recent Checks</h3>
              <div className="space-y-1">
                {checker.isLoadingHistory ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 text-gray-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="text-[13px]">Loading...</span>
                  </div>
                ) : checker.history.length === 0 ? (
                  <p className="text-[13px] text-gray-400 px-3 py-2">No checks yet — run your first check above.</p>
                ) : (
                  checker.history.slice(0, 3).map((check) => (
                    <button
                      key={check.id}
                      onClick={() => {
                        checker.loadCheck(check);
                        setContent(check.content_text || '');
                        setView('results');
                        setIsHistorical(true);
                        setHistoricalCheckedAt(check.created_at);
                        // Scroll to the results area so the user sees the loaded check
                        setTimeout(() => {
                          resultsAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 50);
                      }}
                      className="w-full flex items-start gap-3 px-0 py-2.5 rounded-lg hover:bg-black/[0.03] transition-colors text-left group"
                    >
                      <span className="mt-1 flex-shrink-0">
                      {getStatusIcon(check.overall_status)}
                    </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-gray-700 truncate dark:text-gray-300">
                          {check.content_text?.slice(0, 50)}...
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">
                          {new Date(check.created_at).toLocaleDateString('en-AU', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                    </button>
                  ))
                )}
              </div>
              <div className="border-t border-black/[0.06] dark:border-gray-700 mt-3 pt-3">
                <button onClick={() => navigate('/history')} className="flex items-center gap-1 text-[13px] text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  View all
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </LoggedInLayout>
  );
};

export default Dashboard;
