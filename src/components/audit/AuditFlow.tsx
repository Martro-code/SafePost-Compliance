import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useAccount } from '../../context/AccountContext';
import { AuditStep, AuditStepResult, AuditSession } from '../../types/audit';
import LoggedInLayout from '../layout/LoggedInLayout';
import AuditProgressBar from './AuditProgressBar';
import AuditStepInput from './AuditStepInput';
import AuditStepResultComponent from './AuditStepResult';

const STEP_DEFINITIONS: { name: string; description: string }[] = [
  {
    name: 'Homepage',
    description: 'Analyse your homepage for general medical claims, before/after imagery, testimonials, and any content that could be considered advertising of regulated health services.',
  },
  {
    name: 'Services / Treatments Page',
    description: 'Review your services or treatments page for procedure descriptions, outcome claims, and any language that may breach AHPRA or TGA advertising guidelines.',
  },
  {
    name: 'About / Team Page',
    description: 'Check your about or team page for practitioner credential claims, qualification representations, and any statements that could mislead patients about expertise or scope.',
  },
  {
    name: 'Testimonials / Reviews Page',
    description: 'Examine your testimonials or reviews page for patient testimonials, before/after photos, and endorsements that may breach AHPRA guidelines on testimonial advertising.',
  },
  {
    name: 'Pricing / Specials Page',
    description: 'Inspect your pricing or specials page for promotional offers, discounts, inducements, and any content that could constitute prohibited advertising under TGA or AHPRA rules.',
  },
  {
    name: 'Blog / Articles Page',
    description: 'Review your blog or educational articles for treatment claims, health benefit assertions, and any content that could be interpreted as regulated therapeutic advertising.',
  },
];

function buildInitialSteps(): AuditStep[] {
  return STEP_DEFINITIONS.map((def) => ({
    name: def.name,
    description: def.description,
    url: '',
    status: 'pending',
  }));
}

const AuditFlow: React.FC = () => {
  const navigate = useNavigate();
  const { accountId, auditPurchased, accountLoading } = useAccount();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [steps, setSteps] = useState<AuditStep[]>(buildInitialSteps());
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showingResult, setShowingResult] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load or create an audit session
  const initSession = useCallback(async () => {
    if (!accountId) return;
    setSessionLoading(true);

    // Look for an existing in-progress session
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

    if (existing) {
      // Resume existing session
      const loadedSteps: AuditStep[] = existing.steps && existing.steps.length > 0
        ? existing.steps
        : buildInitialSteps();

      setSessionId(existing.id);
      setSteps(loadedSteps);

      // Find the first non-complete step
      const resumeIdx = loadedSteps.findIndex((s) => s.status !== 'complete');
      setCurrentStepIndex(resumeIdx >= 0 ? resumeIdx : loadedSteps.length - 1);
      setSessionLoading(false);
      return;
    }

    // Create a new session
    const initialSteps = buildInitialSteps();
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
    } else {
      setSessionId(newSession.id);
    }

    setSteps(initialSteps);
    setCurrentStepIndex(0);
    setSessionLoading(false);
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

  const saveSteps = useCallback(async (updatedSteps: AuditStep[], status: 'in_progress' | 'complete') => {
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
    const updatedSteps = steps.map((step, idx) => {
      if (idx === currentStepIndex) {
        return { ...step, url: result.url, status: 'complete' as const, result };
      }
      return step;
    });

    setSteps(updatedSteps);
    setSaveError(null);

    const isLast = currentStepIndex === steps.length - 1;
    await saveSteps(updatedSteps, isLast ? 'complete' : 'in_progress');

    setShowingResult(true);
  }, [steps, currentStepIndex, saveSteps]);

  const handleNext = useCallback(() => {
    const isLast = currentStepIndex === steps.length - 1;
    if (isLast) {
      navigate('/audit/report');
      return;
    }

    const nextIndex = currentStepIndex + 1;
    const updatedSteps = steps.map((step, idx) => {
      if (idx === nextIndex) {
        return { ...step, status: 'active' as const };
      }
      return step;
    });

    setSteps(updatedSteps);
    setCurrentStepIndex(nextIndex);
    setShowingResult(false);
  }, [currentStepIndex, steps, navigate]);

  // Map steps to progress bar format
  const progressSteps = steps.map((step, idx) => ({
    name: step.name,
    status: step.status === 'complete'
      ? 'complete'
      : idx === currentStepIndex
      ? 'active'
      : 'pending',
  })) as { name: string; status: 'pending' | 'complete' | 'active' }[];

  if (accountLoading || sessionLoading) {
    return (
      <LoggedInLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </LoggedInLayout>
    );
  }

  const currentStep = steps[currentStepIndex];
  const currentStepDef = STEP_DEFINITIONS[currentStepIndex];

  return (
    <LoggedInLayout>
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-[24px] font-bold text-gray-900 mb-1">Website Compliance Audit</h1>
          <p className="text-[14px] text-gray-500">
            Enter the URL for each page of your website to analyse it for AHPRA and TGA compliance.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <AuditProgressBar currentStep={currentStepIndex} steps={progressSteps} />
        </div>

        {saveError && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-[13px] text-amber-700">{saveError}</p>
          </div>
        )}

        {/* Step content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {showingResult && currentStep.result ? (
            <AuditStepResultComponent
              result={currentStep.result}
              onNext={handleNext}
              isLastStep={currentStepIndex === steps.length - 1}
            />
          ) : (
            <AuditStepInput
              step={currentStepDef}
              stepIndex={currentStepIndex}
              onStepComplete={handleStepComplete}
            />
          )}
        </div>

        {/* Skip note */}
        {!showingResult && currentStepIndex < steps.length - 1 && (
          <p className="text-center text-[12px] text-gray-400 mt-4">
            If you don't have this page, you can skip it — enter your homepage URL instead.
          </p>
        )}
      </div>
    </LoggedInLayout>
  );
};

export default AuditFlow;
