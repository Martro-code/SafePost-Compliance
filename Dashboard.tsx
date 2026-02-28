import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Paperclip, Loader2, AlertTriangle, CheckCircle2, XCircle, Clock, Sparkles, Rocket, ChevronRight, Lock, Upload, Download, X } from 'lucide-react';
import LoggedInLayout from './src/components/LoggedInLayout';
import OnboardingModal from './src/components/OnboardingModal';
import { useAuth } from './useAuth';
import { useComplianceChecker } from './src/hooks/useComplianceChecker';
import { ComplianceResults } from './src/components/ComplianceResults';
import { analyzePost, generateCompliantRewrites } from './services/geminiService';
import { getDisplayPlanName } from './src/utils/planUtils';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { firstName, signOut } = useAuth();

  // Read plan info from URL params or sessionStorage
  const rawPlan = searchParams.get('plan') || sessionStorage.getItem('safepost_plan') || '';
  const planName = rawPlan || 'starter';
  const billingPeriod = searchParams.get('billing') || sessionStorage.getItem('safepost_billing') || '';

  const checker = useComplianceChecker(planName);

  const hasPaidPlan = planName && !['free', 'starter'].includes(planName.toLowerCase());

  const formatBillingPeriod = (period: string) => {
    return period.charAt(0).toUpperCase() + period.slice(1).toLowerCase();
  };

  const isUltra = planName.toLowerCase() === 'ultra';

  // Form state
  const [content, setContent] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [view, setView] = useState<'input' | 'loading' | 'results'>('input');

  // Bulk upload state
  const [inputMode, setInputMode] = useState<'single' | 'bulk'>('single');
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [showBulkToast, setShowBulkToast] = useState(false);
  const [showBulkTooltip, setShowBulkTooltip] = useState(false);

  // Restore results view if a previous result exists in session
  useEffect(() => {
    if (checker.result && view === 'input') {
      setView('results');
    }
  }, [checker.result]);

  // Onboarding modal state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return sessionStorage.getItem('safepost_onboarded') == null;
  });

  const handleOnboardingComplete = () => {
    sessionStorage.setItem('safepost_onboarded', 'true');
    setShowOnboarding(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
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
    if (!content.trim()) return;
    setView('loading');
    await checker.runCheck(content);
    setView('results');
  };

  const handleNewCheck = () => {
    setContent('');
    setAttachedFile(null);
    setView('input');
    checker.resetChecker();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
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

      {/* Bulk Upload Toast */}
      {showBulkToast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-gray-900 text-white text-[13px] font-medium rounded-xl shadow-lg shadow-black/20">
          Coming soon
        </div>
      )}

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* Cancellation Banner */}
        {sessionStorage.getItem('safepost_cancelled') === 'true' && (
          <div className="mb-6 px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between dark:bg-amber-900/20 dark:border-amber-800">
            <p className="text-[13px] text-amber-700 dark:text-amber-300">
              Your subscription ends on {sessionStorage.getItem('safepost_cancel_date') || 'your next billing date'}. Reactivate anytime.
            </p>
            <button
              onClick={() => {
                sessionStorage.removeItem('safepost_cancelled');
                sessionStorage.removeItem('safepost_cancel_date');
                navigate('/dashboard');
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
          <div className="space-y-6 order-2 md:order-1">
            {/* Welcome */}
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2 dark:text-white">
                {firstName ? `Welcome Back, ${firstName}!` : 'Welcome Back!'}
              </h2>
              <p className="text-[14px] text-gray-500 dark:text-gray-300">
                Instant AHPRA compliance check for medical practitioners and practices
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
                {/* Bulk Upload pill — top-right of card */}
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
                    Bulk Upload
                  </button>
                  {showBulkTooltip && !isUltra && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-[12px] rounded-lg whitespace-nowrap shadow-lg z-10">
                      Bulk upload is available on SafePost™ Ultra
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

                {/* Attached file indicator */}
                {attachedFile && (
                  <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span className="truncate">{attachedFile.name}</span>
                    <button onClick={() => setAttachedFile(null)} className="text-gray-400 hover:text-gray-600 ml-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Attach image — paid plans only */}
                {hasPaidPlan && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-700 transition-colors dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <Paperclip className="w-4 h-4" />
                      Attach Image (optional)
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
                      Upgrade Plan
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckCompliance}
                    disabled={!content.trim()}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] hover:shadow-blue-600/30 flex items-center justify-center gap-2.5"
                  >
                    Check Compliance
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Bulk Upload — Ultra file drop zone */}
            {view === 'input' && inputMode === 'bulk' && isUltra && (
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6 md:p-8 space-y-4">
                <div className="flex justify-end -mt-1 -mb-1">
                  <button
                    onClick={() => setInputMode('single')}
                    className="border border-gray-200 text-[12px] text-gray-500 rounded-full px-3 py-1 flex items-center gap-1.5 hover:text-gray-700 hover:border-gray-300 transition-all duration-200 dark:border-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Single Check
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
                    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.txt'))) {
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
                      Accepts .csv and .txt files
                    </p>
                  </div>
                  <input
                    id="bulk-file-input"
                    type="file"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setBulkFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  Upload a CSV or text file containing multiple posts — one per line. Each will be checked individually.
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
                  Start Bulk Check
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {view === 'loading' && (
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm dark:bg-gray-800 dark:border-gray-700 p-12 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-[14px] text-gray-500 dark:text-gray-300 font-medium">Analysing your content for AHPRA compliance...</p>
              </div>
            )}

            {view === 'results' && checker.result && (
              <ComplianceResults
                result={checker.result}
                originalContent={checker.lastContent || content || sessionStorage.getItem('safepost_last_content') || ''}
                onNewCheck={handleNewCheck}
                onGenerateRewrites={generateCompliantRewrites}
                planName={planName}
              />
            )}

          </div>
          {/* END LEFT COLUMN */}

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6 order-1 md:order-2 md:sticky md:top-20 md:self-start md:max-h-[calc(100vh-6rem)] md:overflow-y-auto">
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

            {/* Upgrade CTA - hidden for Ultra users */}
            {planName.toLowerCase() !== 'ultra' && (
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 dark:bg-blue-950 dark:border-blue-900">
                <div className="flex items-center gap-2.5 mb-3">
                  <Rocket className="w-5 h-5 text-blue-600" />
                  <h3 className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider dark:text-blue-400">Upgrade Your Plan</h3>
                </div>
                <ul className="space-y-2.5 mb-5">
                  <li className="flex items-center gap-2.5 text-[13px] text-gray-700 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    More monthly compliance checks
                  </li>
                  <li className="flex items-center gap-2.5 text-[13px] text-gray-700 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    AI-powered compliant rewrites
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
                  Upgrade Your Plan
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
                        sessionStorage.setItem('safepost_view_check_id', check.id);
                        navigate('/history');
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
                  View All
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
