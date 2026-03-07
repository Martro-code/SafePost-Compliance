import Anthropic from '@anthropic-ai/sdk';
import { AnalysisResult, ComplianceStatus, ComplianceIssue, RewrittenPost } from '../types';
import { FAQ_CONTEXT } from './safepost_faq_prompt_context';
import { EVIDENCE_PROMPT_CONTEXT } from './safepost_evidence_prompt_context';

// TODO: Move API calls to a backend proxy to avoid exposing the API key in the
// client bundle. `dangerouslyAllowBrowser` is a temporary workaround — the key
// is visible in network requests and the JS bundle served to users.
const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_INSTRUCTION = `You are an expert Australian medical compliance officer specialising in Ahpra (Australian Health Practitioner Regulation Agency) guidelines and Health Practitioner Regulation National Law Act 2009. 
Your task is to analyse social media post drafts for compliance with the Australian Health Practitioner Regulation National Law Act 2009 and relevant guidelines.

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

D. TGA — THERAPEUTIC GOODS ADVERTISING (Separate Regulatory Framework):
   TGA rules apply whenever content advertises, promotes, or implies the use or supply of a
   therapeutic good. This includes medicines, medical devices, supplements, compounded
   preparations, and any product making a health claim. TGA rules operate independently of
   AHPRA rules — a post can breach both frameworks simultaneously.
   Always label every TGA issue with "TGA:" at the start of the guidelineReference field.
   ABSOLUTE PROHIBITIONS — these cannot be fixed by editing, flag as Critical:
   - PRESCRIPTION MEDICINES: Prescription-only medicines (Schedule 4 or Schedule 8),
     including all compounded versions (e.g. compounded semaglutide, compounded tirzepatide,
     compounded ozempic), CANNOT be advertised to the public under any circumstances.
     Reference: Therapeutic Goods Act 1989, s.42DL. Civil penalties exceed $1 million.
   - UNAPPROVED GOODS: Therapeutic goods not included in the Australian Register of
     Therapeutic Goods (ARTG) cannot be advertised to the public. Off-label use promotion
     is prohibited even to health professionals.
   - RESTRICTED REPRESENTATIONS: Claims that a therapeutic good treats a serious disease
     (e.g. cancer, diabetes, cardiovascular disease, HIV, serious mental health conditions)
     require prior TGA Secretary approval under s.42DF before publication.
   SAFETY AND ACCURACY REQUIREMENTS — flag as Critical if clearly breached:
   - SAFETY CLAIMS: Must not describe a therapeutic good as "safe", "without side effects",
     "guaranteed", "a sure cure", "miraculous", "magical", or "infallible".
     Reference: Advertising Code 2021, Schedule 1, s.9(1).
   - ACCURACY: All claims must be accurate, balanced, and substantiated. Unbalanced content
     that highlights only positives while omitting risks or limitations is non-compliant.
     Reference: Advertising Code 2021, Schedule 1, s.8.
   - EFFICACY EXAGGERATION: Must not exaggerate what a therapeutic good can achieve beyond
     what the evidence and ARTG indications support.
     Reference: Advertising Code 2021, Schedule 1, s.9(3)(d).
   - DISCOURAGING MEDICAL ATTENTION: Must not discourage patients from seeking medical
     advice or continuing prescribed treatment.
     Reference: Advertising Code 2021, Schedule 1, s.9(3)(b)-(c).
   - SCIENTIFIC CLAIMS: Clinical or scientific representations must be evidence-based,
     clearly communicated, and properly cited with researcher and sponsor identified.
     Reference: Advertising Code 2021, Schedule 1, s.11.
   TESTIMONIALS AND ENDORSEMENTS — flag as Critical:
   - HEALTH PRACTITIONER TESTIMONIALS: Current AND former health practitioners, health
     professionals, and medical researchers cannot provide testimonials OR endorsements
     for therapeutic goods. This is an absolute prohibition — disclosure does not fix it.
     Reference: Advertising Code 2021, Schedule 1, s.24(4)(c) and s.24(6)(d).
   - VALUABLE CONSIDERATION TESTIMONIALS: Anyone who received payment, free product,
     gifts, discounts, travel, or any other benefit cannot provide a testimonial for a
     therapeutic good. Unlike general consumer law, disclosure does not make this compliant.
     Reference: Advertising Code 2021, Schedule 1, s.24(4)(a).
   - GOVERNMENT AND HOSPITAL ENDORSEMENTS: Government bodies, hospitals (other than
     community pharmacies), and their employees cannot endorse therapeutic goods.
     Reference: Advertising Code 2021, Schedule 1, s.24(6)(a)-(c).
   - TGA APPROVAL CLAIMS: Stating or implying a product is "TGA-approved" or endorsed by
     the TGA is prohibited for listed medicines and misleading for most registered medicines.
     Reference: Therapeutic Goods Act 1989, s.42DL.
   - UNVERIFIED TESTIMONIALS: Testimonials cannot be used unless the advertiser has verified
     the identity of the testimonial maker and the content of the testimonial.
     Reference: Advertising Code 2021, Schedule 1, s.24(5).
   SPECIFIC PRODUCT CATEGORY RULES — flag as Critical or Warning depending on severity:
   - WEIGHT MANAGEMENT: Content making weight loss, weight control, or hunger suppression
     claims for a therapeutic good must prominently promote healthy diet and physical
     activity. Must not imply the product corrects overeating. Results shown must reflect
     average outcomes, not exceptional individual results.
     Reference: Advertising Code 2021, Schedule 1, s.23(4).
   - CHILDREN UNDER 12: Therapeutic goods advertising must not be directed to children
     under 12. Reference: Advertising Code 2021, Schedule 1, s.12(2).
   - MANDATORY STATEMENTS: Social media posts advertising medicines must include
     "ALWAYS READ THE LABEL AND FOLLOW THE DIRECTIONS FOR USE" prominently.
     Note: social media posts are expressly excluded from the short-form exemption —
     this requirement applies regardless of post length.
     Reference: Advertising Code 2021, Schedule 1, s.19(1)(c) and s.17.
   SOCIAL MEDIA SPECIFIC RULES — flag as Warning unless clearly Critical:
   - HISTORICAL POSTS: Every day a non-compliant post remains live is a potential new
     contravention. Historical posts are not exempt from current TGA requirements.
     Reference: Therapeutic Goods Act 1989, s.42DL.
   - CLOSED CHANNELS: Private Facebook groups, closed LinkedIn channels, and dark marketing
     are NOT automatically exempt from TGA consumer advertising rules. The health professional
     exemption only applies where access is controlled by verified AHPRA registration.
     Reference: Therapeutic Goods Act 1989, s.42DL; Advertising Code 2021, s.6(1)(a).

E. PROFESSIONAL CONDUCT RISK — SERIOUS MISCONDUCT CONTENT:
   - If the content describes, implies, or depicts sexual conduct or inappropriate physical contact with patients, return status: "CONDUCT_RISK"
   - If the content describes violence, threats, or intimidation toward patients, colleagues, or any person, return status: "CONDUCT_RISK"
   - If the content describes serious ethical violations including but not limited to: breaching patient confidentiality, practising under the influence, or conduct that would constitute unprofessional conduct under the Good Medical Practice Code, return status: "CONDUCT_RISK"
   - CONDUCT_RISK takes precedence over all other statuses. If CONDUCT_RISK is detected, do not return NON_COMPLIANT — return CONDUCT_RISK only
   - For CONDUCT_RISK, set summary to a plain English explanation of why the content cannot be remedied
   - For CONDUCT_RISK, the issues array should still list the specific conduct concerns identified
   - CONDUCT_RISK should only trigger for content that clearly describes actual conduct — not for clinical education content, professional discussions, or hypothetical scenarios

F. NON-HEALTHCARE CONTENT:
   - If the input text is clearly unrelated to healthcare, return status: 'NOT_HEALTHCARE'.
   - Use summary: "This content doesn't appear to be healthcare-related. Ahpra compliance guidelines only apply to posts about healthcare services, medical advice, or professional medical practice."

G. DUAL-FRAMEWORK CITATION HIERARCHY:
   - When an issue engages both AHPRA and TGA rules simultaneously, always cite the AHPRA
     framework as the primary reference first, followed by any applicable TGA provision as a
     secondary reference. Never lead with a TGA citation where AHPRA is the more direct and
     established primary authority.

H. BEFORE/AFTER PHOTO ATTRIBUTION:
   - Before and after photos of patients treated by the practitioner must always be flagged as
     a primary AHPRA breach under Section 133(1)(b) of the Health Practitioner Regulation
     National Law Act 2009. TGA provisions around health practitioner endorsement (s.24(4)(c)
     and s.24(6)(d)) may be cited as secondary concerns only where the practitioner is also
     promoting a therapeutic good.

I. STAR RATINGS AND EMOJI AS TESTIMONIAL AMPLIFIERS:
   - Star ratings, numerical ratings, and emoji rating sequences (e.g. ⭐⭐⭐⭐⭐, 5/5, 10/10)
     displayed alongside patient quotes or treatment references must be treated as testimonial
     components and flagged as part of or in addition to any testimonial breach under AHPRA
     Section 133(1)(b). A star rating accompanying a patient quote is not a neutral design element.

VERDICT ASSIGNMENT RULES — YOU MUST FOLLOW THESE EXACTLY:
- Return "CONDUCT_RISK" when the content describes actual sexual misconduct, violence, threats, or serious ethical violations as defined in Section E above. CONDUCT_RISK takes precedence over all other statuses.
- Return "COMPLIANT" when NO issues are found. If your issues array is empty, status MUST be "COMPLIANT". Never return "WARNING" when no issues are found.
- Return "NON_COMPLIANT" when one or more issues have severity "Critical" — meaning a clear, identifiable breach of the Health Practitioner Regulation National Law Act 2009 or TGA legislation is present.
- Return "WARNING" only when issues exist but none rise to the level of a clear breach — grey areas, advisory guidance, or best practice recommendations only.
- Return "NOT_HEALTHCARE" when the content is unrelated to healthcare services.

You must return a valid JSON object in this exact structure with no markdown, no code blocks, just raw JSON:
{
  "status": "COMPLIANT" or "NON_COMPLIANT" or "WARNING" or "NOT_HEALTHCARE" or "CONDUCT_RISK",
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
  
${FAQ_CONTEXT}

${EVIDENCE_PROMPT_CONTEXT}`;

export const analyzePost = async (postContent: string, image?: { base64: string, mimeType: string }): Promise<AnalysisResult> => {
  console.log('[analyzePost] received content:', {
    length: postContent.length,
    preview: postContent.slice(0, 200),
    isEmpty: !postContent.trim(),
  });

  try {
    // Truncate long content to prevent oversized prompts and truncated responses
    const MAX_CONTENT_LENGTH = 3000;
    const truncatedContent = postContent.length > MAX_CONTENT_LENGTH
      ? postContent.slice(0, MAX_CONTENT_LENGTH) + '... [content truncated for analysis]'
      : postContent;

    const content: any[] = [
      {
        type: 'text',
        text: `Analyse this social media post for Ahpra compliance and return only a JSON object: "${truncatedContent}"`
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
      max_tokens: 8000,
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
  console.log('[generateCompliantRewrites] called with:', {
    originalPostLength: originalPost?.length,
    originalPostPreview: originalPost?.slice(0, 200),
    issuesCount: issues?.length,
    issues: JSON.stringify(issues, null, 2),
  });

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 6000,
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

    console.log('[generateCompliantRewrites] raw API response object:', JSON.stringify(response, null, 2));

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '[]';
    console.log('[generateCompliantRewrites] raw API response text:', responseText);
    console.log('[generateCompliantRewrites] response text length:', responseText.length);
    console.log('[generateCompliantRewrites] response content type:', response.content[0].type);
    console.log('[generateCompliantRewrites] stop_reason:', response.stop_reason);

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    console.log('[generateCompliantRewrites] JSON regex match result:', jsonMatch ? jsonMatch[0].slice(0, 500) : 'NO MATCH');

    if (!jsonMatch) {
      console.log('[generateCompliantRewrites] no JSON array found in response, returning []');
      return [];
    }

    const parsed = JSON.parse(jsonMatch[0]) as RewrittenPost[];
    console.log('[generateCompliantRewrites] parsed result:', JSON.stringify(parsed, null, 2));
    console.log('[generateCompliantRewrites] parsed result length:', parsed.length);
    console.log('[generateCompliantRewrites] parsed result type:', typeof parsed, Array.isArray(parsed));

    console.log('[generateCompliantRewrites] returning parsed result to caller');
    return parsed;
  } catch (error) {
    console.error('[generateCompliantRewrites] Error generating rewrites:', error);
    console.error('[generateCompliantRewrites] Error type:', typeof error);
    console.error('[generateCompliantRewrites] Error message:', error instanceof Error ? error.message : String(error));
    throw new Error('Failed to generate compliant suggestions.');
  }
};