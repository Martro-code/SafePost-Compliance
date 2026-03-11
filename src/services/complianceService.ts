import { AnalysisResult, ComplianceStatus, ComplianceIssue, RewrittenPost } from '../types';
import { supabase } from './supabaseClient';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-post`;

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated. Please sign in to analyze posts.');
  }
  return {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
  };
}

export const analyzePost = async (postContent: string, image?: { base64: string, mimeType: string }): Promise<AnalysisResult> => {
  console.log('[analyzePost] received content:', {
    length: postContent.length,
    preview: postContent.slice(0, 200),
    isEmpty: !postContent.trim(),
  });

  try {
    const headers = await getAuthHeaders();

    const body: Record<string, unknown> = { content: postContent };
    if (image) {
      body.imageBase64 = image.base64;
    }

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      throw new Error('Not authenticated. Please sign in to analyze posts.');
    }

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to analyze post. Please try again.');
    }

    const { analysis } = await response.json() as { analysis: AnalysisResult };

    if (analysis.status === ComplianceStatus.NOT_HEALTHCARE) {
      throw new Error(analysis.summary);
    }

    return analysis;
  } catch (error: any) {
    if (error.message?.includes('healthcare-related') || error.message?.includes('Not authenticated')) {
      throw error;
    }
    console.error('Claude Analysis Error:', error);
    throw new Error('Failed to analyze post. Please try again.');
  }
};

export const generateCompliantRewrites = async (originalPost: string, issues: ComplianceIssue[]): Promise<RewrittenPost[]> => {
  console.log('[generateCompliantRewrites] called with:', {
    originalPostLength: originalPost?.length,
    originalPostPreview: originalPost?.slice(0, 200),
    issuesCount: issues?.length,
  });

  try {
    const headers = await getAuthHeaders();

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action: 'rewrite',
        content: originalPost,
        issues,
      }),
    });

    if (response.status === 401) {
      throw new Error('Not authenticated. Please sign in.');
    }

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to generate compliant suggestions.');
    }

    const { rewrites } = await response.json() as { rewrites: RewrittenPost[] };
    console.log('[generateCompliantRewrites] received rewrites:', rewrites?.length);
    return rewrites;
  } catch (error) {
    console.error('[generateCompliantRewrites] Error generating rewrites:', error);
    throw new Error('Failed to generate compliant suggestions.');
  }
};
