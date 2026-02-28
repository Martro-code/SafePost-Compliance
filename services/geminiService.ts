import Anthropic from '@anthropic-ai/sdk';
import { AnalysisResult, ComplianceStatus, ComplianceIssue, RewrittenPost } from '../types';
import { FAQ_CONTEXT } from './safepost_faq_prompt_context';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_INSTRUCTION = `You are an expert Australian medical compliance officer specialising in Ahpra (Australian Health Practitioner Regulation Agency) guidelines and National Law. 
Your task is to analyse social media post drafts for compliance with the Australian Health Practitioner Regulation National Law and relevant guidelines.

IMPORTANT: You must use Australian/UK English spelling (e.g., 'recognise', 'analyse', 'programme', 'colour') in all your generated responses, findings, and summaries.

KEY COMPLIANCE RULES TO CHECK:

A. SECTION 133 - NATIONAL LAW (Strict Liability):
   - FALSE/MISLEADING: Content must not be false, misleading, or deceptive (or likely to be).
   - GIFTS/DISCOUNTS: Must state terms and conditions if offering gifts/discounts/inducements.
   - TESTIMONIALS: Strictly PROHIBITED. Includes patient reviews, success stories, before/after with subjective praise, reposting patient stories.
   - UNREASONABLE EXPECTATIONS: No creating unreasonable expectations of beneficial treatment (e.g., "miracle cure", "guaranteed results", "perfect").
   - INDISCRIMINATE USE: No encouraging indiscriminate/unnecessary use of services.

B. HIGHER RISK NON-SURGICAL & COSMETIC SURGERY ADVERTISING:
   - TERMINOLOGY: No trivializing terms (e.g., "boob job", "mummy makeover", "liquid nose job"). Use medical terms.
   - TITLES: Only use "Surgeon" if holding specialist registration in surgery.
   - BEFORE & AFTER PHOTOS: Must be genuine, unedited. Prominent warning required stating results vary.
   - RISK & RECOVERY: Must provide accurate info on risks/recovery. No minimizing risks ("safe", "quick", "easy", "painless").
   - UNDER 18s: Content must be restricted to 18+. No targeting of minors.

C. GOOD MEDICAL PRACTICE & SOCIAL MEDIA CONDUCT:
   - PROFESSIONAL OBLIGATIONS: Doctors must maintain professional standards online.
   - RESPECT: Maintain respect for colleagues and patients. No bullying/harassment.

D. TGA — THERAPEUTIC GOODS ADVERTISING (Separate Framework):
   - PRESCRIPTION MEDICINES: Prescription-only medicines (Schedule 4) including compounded 
     versions (e.g. compounded tirzepatide, semaglutide) CANNOT be advertised to the public. 
     This is an absolute prohibition — flag as Critical, the post cannot be fixed by editing.
   - THERAPEUTIC CLAIMS: If any claim suggests a product diagnoses, treats, relieves, reduces, 
     aids, or fades a health condition, TGA rules apply. Flag as a standalone TGA issue.
   - PAID TESTIMONIALS: Anyone receiving payment or free product cannot provide testimonials 
     about therapeutic goods. Flag as a standalone TGA Critical issue.
   - HEALTH PROFESSIONAL ENDORSEMENTS: Health professionals cannot endorse therapeutic goods 
     in advertising. Flag as a standalone TGA Critical issue.
   - Always label TGA issues clearly with "TGA:" at the start of the guidelineReference field 
     so users know this is a separate regulatory framework from AHPRA.

F. NON-HEALTHCARE CONTENT:
   - If the input text is clearly unrelated to healthcare, return status: 'NOT_HEALTHCARE'.
   - Use summary: "This content doesn't appear to be healthcare-related. Ahpra compliance guidelines only apply to posts about healthcare services, medical advice, or professional medical practice."

VERDICT ASSIGNMENT RULES — YOU MUST FOLLOW THESE EXACTLY:
- Return "COMPLIANT" when NO issues are found. If your issues array is empty, status MUST be "COMPLIANT". Never return "WARNING" when no issues are found.
- Return "NON_COMPLIANT" when one or more issues have severity "Critical" — meaning a clear, identifiable breach of the National Law or TGA legislation is present.
- Return "WARNING" only when issues exist but none rise to the level of a clear breach — grey areas, advisory guidance, or best practice recommendations only.
- Return "NOT_HEALTHCARE" when the content is unrelated to healthcare services.

You must return a valid JSON object in this exact structure with no markdown, no code blocks, just raw JSON:
{
  "status": "COMPLIANT" or "NON_COMPLIANT" or "WARNING" or "NOT_HEALTHCARE",
  "summary": "A short high-level summary of the findings.",
  "overallVerdict": "A final message for the practitioner.",
  "issues": [
    {
      "guidelineReference": "Which specific Ahpra guideline is relevant.",
      "finding": "What exactly is the potential breach.",
      "severity": "Critical" or "Warning",
      "recommendation": "How to fix the content to be compliant."
    }
  ]
}
  
${FAQ_CONTEXT}`;

export const analyzePost = async (postContent: string, image?: { base64: string, mimeType: string }): Promise<AnalysisResult> => {
  try {
    const content: any[] = [
      { 
        type: 'text', 
        text: `Analyse this social media post for Ahpra compliance and return only a JSON object: "${postContent}"` 
      }
    ];

    if (image) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: image.mimeType,
          data: image.base64,
        },
      });
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: SYSTEM_INSTRUCTION,
      messages: [
        { role: 'user', content }
      ],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]) as AnalysisResult;

    if (result.status === ComplianceStatus.NOT_HEALTHCARE) {
      throw new Error(result.summary);
    }

    return result;
  } catch (error: any) {
    if (error.message?.includes('healthcare-related')) {
      throw error;
    }
    console.error('Claude Analysis Error:', error);
    throw new Error('Failed to analyze post. Please try again.');
  }
};

export const generateCompliantRewrites = async (originalPost: string, issues: ComplianceIssue[]): Promise<RewrittenPost[]> => {
  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `The following social media post has been flagged with non-compliant issues under Australian Ahpra law.

ORIGINAL POST: "${originalPost}"

IDENTIFIED ISSUES: 
${JSON.stringify(issues)}

TASK:
Rewrite the post to be fully compliant while maintaining the original intent as much as possible. 
Provide 3 distinct options (e.g., 'Minimal Edit', 'Educational/Professional', 'Safe/Conservative').
Ensure Australian/UK spelling is used.
Return only a JSON array with no markdown in this format:
[
  {
    "optionTitle": "Minimal Edit",
    "content": "The rewritten post text",
    "explanation": "Brief explanation of changes made"
  }
]`
        }
      ],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '[]';
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    
    return JSON.parse(jsonMatch[0]) as RewrittenPost[];
  } catch (error) {
    console.error('Error generating rewrites:', error);
    throw new Error('Failed to generate compliant suggestions.');
  }
};