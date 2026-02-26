import { useState, useCallback } from 'react';
import { analyzePost } from '../../services/geminiService';
import { AnalysisResult, ComplianceStatus } from '../../types';
import { supabase } from '../services/supabaseClient';

export interface SavedComplianceCheck {
  id: string;
  created_at: string;
  user_id: string;
  content_text: string;
  content_type: string;
  platform: string;
  overall_status: string;
  compliance_score: number;
  result_json: any;
  notes?: string;
}

async function fetchUserComplianceHistory(userId: string): Promise<SavedComplianceCheck[]> {
  const { data, error } = await supabase
    .from('compliance_checks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function deleteComplianceCheck(id: string): Promise<void> {
  const { error } = await supabase
    .from('compliance_checks')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export type CheckerStep = 'idle' | 'analyzing' | 'complete' | 'error';

export function useComplianceChecker() {
  const [step, setStep] = useState<CheckerStep>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedComplianceCheck[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const runCheck = useCallback(async (content: string) => {
    setStep('analyzing');
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzePost(content);
      setResult(analysisResult);

      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('compliance_checks').insert({
          user_id: user.id,
          content_text: content,
          content_type: 'social_media_post',
          platform: 'general',
          overall_status: analysisResult.status === ComplianceStatus.COMPLIANT
            ? 'compliant'
            : analysisResult.status === ComplianceStatus.NON_COMPLIANT
            ? 'non_compliant'
            : 'requires_review',
          compliance_score: analysisResult.status === ComplianceStatus.COMPLIANT
            ? 100
            : analysisResult.status === ComplianceStatus.NON_COMPLIANT
            ? Math.max(0, 100 - (analysisResult.issues.filter(i => i.severity === 'Critical').length * 25) - (analysisResult.issues.filter(i => i.severity === 'Warning').length * 10))
            : 70,
          result_json: analysisResult,
        });
      }

      setStep('complete');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      setStep('error');
    }
  }, []);

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const checks = await fetchUserComplianceHistory(user.id);
        setHistory(checks);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const deleteCheck = useCallback(async (id: string) => {
    await deleteComplianceCheck(id);
    setHistory((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const resetChecker = useCallback(() => {
    setStep('idle');
    setResult(null);
    setError(null);
  }, []);

  return {
    step,
    result,
    error,
    history,
    isLoadingHistory,
    runCheck,
    loadHistory,
    deleteCheck,
    resetChecker,
  };
}