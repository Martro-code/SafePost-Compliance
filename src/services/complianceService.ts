import { AnalysisResult, ComplianceStatus, ComplianceIssue, RewrittenPost } from '../types';
import { supabase } from './supabaseClient';

export class SessionExpiredError extends Error {
  constructor() {
    super('Your session has expired. Please save your content and log in again.');
    this.name = 'SessionExpiredError';
  }
}

export const analyzePost = async (
  postContent: string,
  options?: { image?: { base64: string; mimeType: string }; pdfBase64?: string },
): Promise<AnalysisResult & { extractedText?: string }> => {
  console.log('[analyzePost] received content:', {
    length: postContent.length,
    preview: postContent.slice(0, 200),
    isEmpty: !postContent.trim(),
    isPdf: !!options?.pdfBase64,
  });

  try {
    const body: Record<string, unknown> = { content: postContent };
    if (options?.image) {
      body.imageBase64 = options.image.base64;
    }
    if (options?.pdfBase64) {
      body.pdfBase64 = options.pdfBase64;
    }

    const { data, error } = await supabase.functions.invoke('analyze-post', { body });

    if (error) throw error;

    const { analysis, extractedText } = data as { analysis: AnalysisResult; extractedText?: string };

    if (analysis.status === ComplianceStatus.NOT_HEALTHCARE) {
      throw new Error(analysis.summary);
    }

    return { ...analysis, extractedText };
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
    const { data, error } = await supabase.functions.invoke('analyze-post', {
      body: {
        action: 'rewrite',
        content: originalPost,
        issues,
      },
    });

    if (error) throw error;

    const { rewrites } = data as { rewrites: RewrittenPost[] };
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
