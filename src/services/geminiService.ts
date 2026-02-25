import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface ComplianceIssue {
  severity: 'critical' | 'warning' | 'info';
  rule_text: string;
  plain_english_summary: string;
  source_document: string;
  section_reference: string;
  category: string;
  subcategory: string;
  recommended_action: string;
  excerpt: string;
  explanation: string;
}

export interface ComplianceResult {
  overall_status: 'compliant' | 'non_compliant' | 'requires_review';
  compliance_score: number;
  summary: string;
  issues: ComplianceIssue[];
  compliant_elements: string[];
  revised_content_suggestion?: string;
  checked_at: string;
}

export interface GuidelineRecord {
  id: string;
  category: string;
  subcategory: string;
  source_document: string;
  section_reference: string;
  rule_text: string;
  plain_english_summary: string;
  recommended_action: string;
}

export async function analyzeCompliance(
  content: string,
  contentType: string,
  platform: string,
  guidelines: GuidelineRecord[]
): Promise<ComplianceResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const guidelinesText = guidelines
    .map(
      (g, i) =>
        `[GUIDELINE ${i + 1}]
Category: ${g.category}
Subcategory: ${g.subcategory}
Source: ${g.source_document} ${g.section_reference}
Rule: ${g.rule_text}
Plain English: ${g.plain_english_summary}
Recommended Action: ${g.recommended_action}`
    )
    .join('\n\n');

  const prompt = `You are SafePost™, an expert AHPRA (Australian Health Practitioner Regulation Agency) compliance analyst for Australian medical practitioners and healthcare practices.

Your task is to analyse the following ${contentType} intended for ${platform} against the AHPRA advertising guidelines, the Health Practitioner Regulation National Law, and TGA requirements provided below.

=== CONTENT TO ANALYSE ===
${content}

=== APPLICABLE GUIDELINES ===
${guidelinesText}

=== INSTRUCTIONS ===
Carefully analyse the content against EVERY guideline provided. Be thorough and precise.

Key areas to check:
1. TESTIMONIALS & PATIENT REVIEWS - Any patient testimonials, reviews, or before/after experiences are prohibited
2. CLAIMS - Unsubstantiated claims about treatment efficacy, success rates, or guaranteed outcomes
3. QUALIFICATIONS - Misrepresentation or misleading presentation of credentials
4. BEFORE/AFTER IMAGES - Prohibited in most healthcare advertising contexts
5. DISCOUNTS & INDUCEMENTS - Fee discounts, free consultations, or financial inducements that may be prohibited
6. COMPARATIVE ADVERTISING - Claims comparing practitioners or services
7. FEAR-BASED ADVERTISING - Creating unreasonable expectations or exploiting vulnerability
8. REQUIRED DISCLAIMERS - Missing mandatory disclaimers or disclosure statements
9. TGA REQUIREMENTS - Therapeutic goods advertising compliance if medicines/devices mentioned
10. PRIVACY - Any identifiable patient information

Return ONLY a valid JSON object in this exact structure (no markdown, no code blocks, just raw JSON):
{
  "overall_status": "compliant" | "non_compliant" | "requires_review",
  "compliance_score": <integer 0-100>,
  "summary": "<2-3 sentence executive summary of the compliance assessment>",
  "issues": [
    {
      "severity": "critical" | "warning" | "info",
      "rule_text": "<exact rule text from the guideline>",
      "plain_english_summary": "<plain english summary from guideline>",
      "source_document": "<source document name>",
      "section_reference": "<section reference>",
      "category": "<category>",
      "subcategory": "<subcategory>",
      "recommended_action": "<recommended action from guideline>",
      "excerpt": "<exact quote from the submitted content that triggered this issue>",
      "explanation": "<specific explanation of why this excerpt violates this rule>"
    }
  ],
  "compliant_elements": ["<list of things the content does correctly>"],
  "revised_content_suggestion": "<optional: a revised version of the content that would be compliant, only include if there are fixable issues>"
}

Severity definitions:
- critical: Direct violation that could result in regulatory action, must be fixed
- warning: Potential violation or grey area that should be reviewed by a compliance professional
- info: Best practice suggestion or minor improvement

Compliance score: 100 = fully compliant, 0 = severely non-compliant. Deduct points per issue: critical=-25, warning=-10, info=-3 (minimum 0).
overall_status: "compliant" if score>=85 and no critical issues, "non_compliant" if any critical issues or score<60, otherwise "requires_review"`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as ComplianceResult;
    parsed.checked_at = new Date().toISOString();

    return parsed;
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw new Error(
      `AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}