import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Globe } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useAccount } from '../../context/AccountContext';
import { AuditStep, AuditStepResult } from '../../types/audit';
import LoggedInLayout from '../layout/LoggedInLayout';
import AuditProgressBar from './AuditProgressBar';
import AuditStepInput from './AuditStepInput';
import AuditStepResultComponent from './AuditStepResult';

// ── Default page suggestions shown in the setup screen ───────────────────────

const DEFAULT_PAGE_SETUPS: { name: string; url: string }[] = [
  { name: 'Homepage', url: '' },
  { name: 'Services', url: '' },
  { name: 'About Us', url: '' },
  { name: 'Testimonials', url: '' },
  { name: 'Pricing', url: '' },
  { name: 'Blog', url: '' },
];

// ── Setup screen ─────────────────────────────────────────────────────────────

interface PageSetup {
  name: string;
  url: string;
}

interface SetupScreenProps {
  pageSetups: PageSetup[];
  onChange: (setups: PageSetup[]) => void;
  onStart: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ pageSetups, onChange, onStart }) => {
  const hasAtLeastOneComplete = pageSetups.some(
    (p) => p.name.trim() !== '' && p.url.trim() !== ''
  );

  const handleFieldChange = (idx: number, field: 'name' | 'url', value: string) => {
    const updated = pageSetups.map((p, i) => (i === idx ? { ...p, [field]: value } : p));
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1">
          Before you start
        </p>
        <h2 className="text-[20px] font-semibold text-gray-900 mb-2">Set Up Your Audit</h2>
        <p className="text-[14px] text-gray-500 leading-relaxed">
          Enter the name and URL for each page you'd like to audit. You can leave rows blank to skip them, or change the suggested names to match your site.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Column labels */}
        <div className="grid grid-cols-[1fr_1.4fr] gap-3 px-1">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Page Name</p>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">URL</p>
        </div>

        {pageSetups.map((page, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_1.4fr] gap-3">
            <input
              type="text"
              value={page.name}
              onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
              placeholder={`Page ${idx + 1}`}
              className="px-3 py-2.5 text-[13px] bg-white border border-slate-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="url"
                value={page.url}
                onChange={(e) => handleFieldChange(idx, 'url', e.target.value)}
                placeholder="https://yoursite.com.au/page"
                className="w-full pl-8 pr-3 py-2.5 text-[13px] bg-white border border-slate-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-[12px] text-gray-400 -mt-1">
        Fill in at least one complete row to start. Rows left empty will be skipped.
      </p>

      <button
        onClick={onStart}
        disabled={!hasAtLeastOneComplete}
        className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[14px] font-semibold rounded-xl transition-colors duration-200"
      >
        Start Audit
      </button>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

type Phase = 'loading' | 'setup' | 'auditing';

const AuditFlow: React.FC = () => {
  const navigate = useNavigate();
  const { accountId, auditPurchased, accountLoading, refreshAccount } = useAccount();

  const [phase, setPhase] = useState<Phase>('loading');
  const [pageSetups, setPageSetups] = useState<PageSetup[]>(DEFAULT_PAGE_SETUPS);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [steps, setSteps] = useState<AuditStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showingResult, setShowingResult] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const initSession = useCallback(async () => {
    if (!accountId) return;

    const { data: existing, error } = await supabase
      .from('audit_sessions')
      .select('*')
      .eq('account_id', accountId)
      .eq('status', 'in_progress')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Failed to load audit session:', error);
    }

    if (existing && existing.steps && existing.steps.length > 0) {
      // Resume existing session — skip setup
      const loadedSteps: AuditStep[] = existing.steps;
      setSessionId(existing.id);
      setSteps(loadedSteps);
      const resumeIdx = loadedSteps.findIndex((s) => s.status !== 'complete');
      setCurrentStepIndex(resumeIdx >= 0 ? resumeIdx : loadedSteps.length - 1);
      setPhase('auditing');
      return;
    }

    // No in-progress session — show setup
    setPhase('setup');
  }, [accountId]);

  useEffect(() => {
    if (!accountLoading) {
      if (!auditPurchased) {
        navigate('/audit', { replace: true });
        return;
      }
      initSession();
    }
  }, [accountLoading, auditPurchased, initSession, navigate]);

  const handleSetupStart = useCallback(async () => {
    if (!accountId) return;

    // Build steps only from complete rows
    const completedSetups = pageSetups.filter(
      (p) => p.name.trim() !== '' && p.url.trim() !== ''
    );
    if (completedSetups.length === 0) return;

    const initialSteps: AuditStep[] = completedSetups.map((p) => ({
      name: p.name.trim(),
      url: p.url.trim(),
      status: 'pending',
    }));

    const { data: newSession, error: createError } = await supabase
      .from('audit_sessions')
      .insert({
        account_id: accountId,
        status: 'in_progress',
        steps: initialSteps,
      })
      .select('id')
      .single();

    if (createError || !newSession) {
      console.error('Failed to create audit session:', createError);
      return;
    }

    setSessionId(newSession.id);
    setSteps(initialSteps);
    setCurrentStepIndex(0);
    setPhase('auditing');
  }, [accountId, pageSetups]);

  const saveSteps = useCallback(async (
    updatedSteps: AuditStep[],
    status: 'in_progress' | 'complete'
  ) => {
    if (!sessionId) return;
    const { error } = await supabase
      .from('audit_sessions')
      .update({ steps: updatedSteps, status, updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (error) {
      console.error('Failed to save audit steps:', error);
      setSaveError('Progress could not be saved. Please check your connection.');
    }
  }, [sessionId]);

  const handleStepComplete = useCallback(async (result: AuditStepResult) => {
    const updatedSteps = steps.map((step, idx) =>
      idx === currentStepIndex
        ? { ...step, url: result.url, status: 'complete' as const, result }
        : step
    );

    setSteps(updatedSteps);
    setSaveError(null);

    const isLast = currentStepIndex === steps.length - 1;
    await saveSteps(updatedSteps, isLast ? 'complete' : 'in_progress');

    if (isLast) {
      // Reset audit_purchased so the user must re-purchase for a new audit
      const { error: resetErr } = await supabase
        .from('accounts')
        .update({ audit_purchased: false })
        .eq('id', accountId);
      if (resetErr) {
        console.error('Could not reset audit_purchased:', resetErr.message);
      }
      await refreshAccount();
      navigate('/audit/report');
      return;
    }

    setShowingResult(true);
  }, [steps, currentStepIndex, saveSteps, accountId, refreshAccount, navigate]);

  const handleSkip = useCallback(async () => {
    const skippedResult: AuditStepResult = {
      url: steps[currentStepIndex]?.url || '',
      complianceStatus: 'skipped',
      issues: [],
      summary: 'This page was not analysed.',
    };

    const updatedSteps = steps.map((step, idx) =>
      idx === currentStepIndex
        ? { ...step, status: 'complete' as const, result: skippedResult }
        : step
    );

    setSteps(updatedSteps);
    setSaveError(null);

    const isLast = currentStepIndex === steps.length - 1;
    await saveSteps(updatedSteps, isLast ? 'complete' : 'in_progress');

    if (isLast) {
      const { error: resetErr } = await supabase
        .from('accounts')
        .update({ audit_purchased: false })
        .eq('id', accountId);
      if (resetErr) {
        console.error('Could not reset audit_purchased:', resetErr.message);
      }
      await refreshAccount();
      navigate('/audit/report');
      return;
    }

    // Auto-advance without showing a result screen for skipped steps
    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);
    setShowingResult(false);
  }, [steps, currentStepIndex, saveSteps, accountId, refreshAccount, navigate]);

  const handleNext = useCallback(() => {
    const isLast = currentStepIndex === steps.length - 1;
    if (isLast) {
      navigate('/audit/report');
      return;
    }
    setCurrentStepIndex(currentStepIndex + 1);
    setShowingResult(false);
  }, [currentStepIndex, steps.length, navigate]);

  const progressSteps = steps.map((step, idx) => ({
    name: step.name,
    status: step.status === 'complete'
      ? 'complete'
      : idx === currentStepIndex
      ? 'active'
      : 'pending',
  })) as { name: string; status: 'pending' | 'complete' | 'active' }[];

  if (phase === 'loading' || accountLoading) {
    return (
      <LoggedInLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </LoggedInLayout>
    );
  }

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-[24px] font-bold text-gray-900 mb-1">Website Compliance Audit</h1>
          <p className="text-[14px] text-gray-500">
            {phase === 'setup'
              ? 'Tell us which pages to audit, then we'll check each one against AHPRA and TGA rules.'
              : 'Enter the URL for each page of your website to analyse it for AHPRA and TGA compliance.'}
          </p>
        </div>

        {/* Progress bar — only shown during auditing */}
        {phase === 'auditing' && steps.length > 0 && (
          <div className="mb-8">
            <AuditProgressBar currentStep={currentStepIndex} steps={progressSteps} />
          </div>
        )}

        {saveError && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-[13px] text-amber-700">{saveError}</p>
          </div>
        )}

        {/* Main content card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {phase === 'setup' && (
            <SetupScreen
              pageSetups={pageSetups}
              onChange={setPageSetups}
              onStart={handleSetupStart}
            />
          )}

          {phase === 'auditing' && steps.length > 0 && (
            showingResult && steps[currentStepIndex]?.result ? (
              <AuditStepResultComponent
                result={steps[currentStepIndex].result!}
                onNext={handleNext}
                isLastStep={currentStepIndex === steps.length - 1}
              />
            ) : (
              <AuditStepInput
                stepName={steps[currentStepIndex]?.name ?? ''}
                stepIndex={currentStepIndex}
                initialUrl={steps[currentStepIndex]?.url ?? ''}
                onStepComplete={handleStepComplete}
                onSkip={handleSkip}
              />
            )
          )}
        </div>
      </div>
    </LoggedInLayout>
  );
};

export default AuditFlow;
