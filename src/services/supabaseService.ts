import { supabase } from './supabaseClient';
import type { ComplianceResult } from './geminiService';

// ── Guidelines ──────────────────────────────────────────────────────────────

export async function fetchAllGuidelines() {
  const { data, error } = await supabase
    .from('guidelines')
    .select('*')
    .order('category', { ascending: true });

  if (error) throw new Error(`Failed to fetch guidelines: ${error.message}`);
  return data ?? [];
}

// ── Compliance Checks ────────────────────────────────────────────────────────

export interface SavedComplianceCheck {
  id: string;
  created_at: string;
  user_id: string;
  content_text: string;
  content_type: string;
  platform: string;
  overall_status: string;
  compliance_score: number;
  result_json: ComplianceResult;
  notes?: string;
}

export async function saveComplianceCheck(
  userId: string,
  contentText: string,
  contentType: string,
  platform: string,
  result: ComplianceResult,
  notes?: string
): Promise<SavedComplianceCheck> {
  const { data, error } = await supabase
    .from('compliance_checks')
    .insert({
      user_id: userId,
      content_text: contentText,
      content_type: contentType,
      platform: platform,
      overall_status: result.overall_status,
      compliance_score: result.compliance_score,
      result_json: result,
      notes: notes ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to save check: ${error.message}`);
  return data;
}

export async function fetchUserComplianceHistory(
  userId: string,
  limit = 20
): Promise<SavedComplianceCheck[]> {
  const { data, error } = await supabase
    .from('compliance_checks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch history: ${error.message}`);
  return data ?? [];
}

export async function fetchComplianceCheckById(
  id: string
): Promise<SavedComplianceCheck | null> {
  const { data, error } = await supabase
    .from('compliance_checks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function deleteComplianceCheck(id: string): Promise<void> {
  const { error } = await supabase
    .from('compliance_checks')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete check: ${error.message}`);
}