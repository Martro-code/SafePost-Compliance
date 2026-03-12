import { AnalysisResult, ComplianceStatus, ComplianceIssue, RewrittenPost } from '../types';
import { supabase } from './supabaseClient';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-post`;

export class SessionExpiredError extends Error {
  constructor() {
    super('Your session has expired. Please save your content and log in again.');
    this.name = 'SessionExpiredError';
  }
}

/**
 * Retrieve a fresh access token, attempting a refresh if the session is missing.
 * Returns the raw JWT string or throws SessionExpiredError.
 */
async function getFreshAccessToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.access_token) {
    return session.access_token;
  }

  // Session missing — attempt a single refresh
  const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError || !refreshData.session?.access_token) {
    console.error('[getFreshAccessToken] refresh failed:', refreshError?.message ?? 'no session after refresh');
    throw new SessionExpiredError();
  }

  return refreshData.session.access_token;
}

export const analyzePost = async (postContent: string, image?: { base64: string, mimeType: string }): Promise<AnalysisResult> => {
  console.log('[analyzePost] received content:', {
    length: postContent.length,
    preview: postContent.slice(0, 200),
    isEmpty: !postContent.trim(),
  });

  try {
    const accessToken = await getFreshAccessToken();
    console.log('[analyzePost] access token obtained:', !!accessToken, 'length:', accessToken.length);

    const body: Record<string, unknown> = { content: postContent };
    if (image) {
      body.imageBase64 = image.base64;
    }

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      throw new SessionExpiredError();
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
    if (error instanceof SessionExpiredError || error.name === 'SessionExpiredError') {
      throw error;
    }
    if (error.message?.includes('healthcare-related')) {
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
    const accessToken = await getFreshAccessToken();

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        action: 'rewrite',
        content: originalPost,
        issues,
      }),
    });

    if (response.status === 401) {
      throw new SessionExpiredError();
    }

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to generate compliant suggestions.');
    }

    const { rewrites } = await response.json() as { rewrites: RewrittenPost[] };
    console.log('[generateCompliantRewrites] received rewrites:', rewrites?.length);
    return rewrites;
  } catch (error) {
    if (error instanceof SessionExpiredError || (error as any).name === 'SessionExpiredError') {
      throw error;
    }
    console.error('[generateCompliantRewrites] Error generating rewrites:', error);
    throw new Error('Failed to generate compliant suggestions.');
  }
};
