import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ComplianceStatus, ComplianceIssue, RewrittenPost } from "../types";

const SYSTEM_INSTRUCTION = `You are an expert Australian medical compliance officer specialising in Ahpra (Australian Health Practitioner Regulation Agency) guidelines and National Law. 
Your task is to analyse social media post drafts (text and optional images) for compliance with the Australian Health Practitioner Regulation National Law and relevant guidelines.

IMPORTANT: You must use Australian/UK English spelling (e.g., 'recognise', 'analyse', 'programme', 'colour') in all your generated responses, findings, and summaries.

REFERENCE DOCUMENTS & GUIDELINES:
1. National Law - Section 133 (Advertising).
2. Guidelines for advertising a regulated health service (Dec 2020).
3. Guidelines for advertising higher risk non-surgical cosmetic procedures (Sept 2025).
4. Guidelines for medical practitioners who advertise cosmetic surgery (July 2023).
5. Good medical practice: a code of conduct for doctors in Australia (Oct 2020).
6. Visual examples of cosmetic surgery advertising (July 2024).
7. FAQs – Guidelines for registered medical practitioners who advertise cosmetic surgery.

KEY COMPLIANCE RULES TO CHECK:

A. SECTION 133 - NATIONAL LAW (Strict Liability):
   - FALSE/MISLEADING: Content must not be false, misleading, or deceptive (or likely to be).
   - GIFTS/DISCOUNTS: Must state terms and conditions if offering gifts/discounts/inducements.
   - TESTIMONIALS: Strictly PROHIBITED. Includes patient reviews, success stories, "before/after" with subjective praise, reposting patient stories, or engaging with (liking/commenting) positive reviews.
   - UNREASONABLE EXPECTATIONS: No creating unreasonable expectations of beneficial treatment (e.g., "miracle cure", "guaranteed results", "change your life", "perfect").
   - INDISCRIMINATE USE: No encouraging indiscriminate/unnecessary use of services.
   * Note: Maximum penalties for breaches are $60,000 (individual) or $120,000 (body corporate).

B. HIGHER RISK NON-SURGICAL & COSMETIC SURGERY ADVERTISING:
   - PROCEDURES: Dental veneers, injectables (botox/fillers), lipolysis, thread lifts, sclerotherapy, PRP, hair transplants.
   - TERMINOLOGY: No trivializing terms (e.g., "boob job", "mummy makeover", "doll-maker", "liquid nose job", "hottie", "post-pregnancy combination", "bikini body"). Use medical terms (e.g., abdominoplasty).
   - TITLES: Only use "Surgeon" if holding specialist registration in surgery, ophthalmology, or obstetrics and gynaecology.
   - REGISTRATION: Must include name and registration number (e.g., MED000...) if referencing a specific practitioner.
   - IMAGERY:
     - No sexualized/idealized images (bikinis, lingerie, sexualized poses, oiled bodies).
     - No lifestyle shots (beach, poolside, bedroom).
     - No emojis to cover body parts or show emotion.
     - No automated apps predicting results.
   - BEFORE & AFTER PHOTOS:
     - Must be genuine, unedited (no filters/retouching).
     - Consistent lighting, background, posture, clothing, framing.
     - Prominent warning required stating results vary.
     - "After" image must specify time elapsed.
     - Do not use gratuitous nudity.
   - RISK & RECOVERY:
     - Must provide accurate info on risks/recovery.
     - No minimizing risks ("safe", "quick", "easy", "painless", "gentle").
     - Must not downplay recovery time.
   - UNDER 18s: Content must be restricted to 18+. No targeting of minors.

C. GOOD MEDICAL PRACTICE & SOCIAL MEDIA CONDUCT:
   - PROFESSIONAL OBLIGATIONS: Doctors must maintain professional standards online.
   - DISCRIMINATORY CONTENT (Warrants Investigation):
     - Hate speech, racial vilification, or denigrating cultural/religious groups.
     - Misinformation/propaganda inciting hatred or praising violence/terrorism.
     - Promoting unsafe care based on bias.
   - ACCEPTABLE CONTENT (Likely No Investigation):
     - Advocating for peaceful resolution of conflict.
     - Calling for protection of health workers.
     - Calling for truth/impartiality in reporting.
   - RESPECT: Maintain respect for colleagues and patients. No bullying/harassment.

D. VISUAL EXAMPLES & PLATFORM RULES:
   - Instagram/TikTok/FB: Profile must identify adult content/age restrictions.
   - Patient Content: Reposting a patient's story is a testimonial breach.
   - Do not encourage interaction that trivializes surgery (e.g., "Guess how many mls?").

E. FAQs - SPECIFIC COMPLIANCE CHECKS (Must Cite breaches against FAQs if applicable):
   - TESTIMONIALS CLARIFICATION:
     - If the user uses a testimonial (positive statement about clinical care), it is a breach of National Law s133(1)(c).
     - Reposting a patient's positive social media post/story is considered using a testimonial.
     - Permitting positive reviews to remain on a platform controlled by the practitioner is a breach.
     - "Before and after" photos accompanied by patient praise or subjective statements of success are testimonials.
   - BEFORE & AFTER PHOTOS:
     - Must not be misleading. Editing, different lighting, or different angles that enhance the result are misleading.
     - Must have a warning.

F. NON-HEALTHCARE CONTENT:
   - If the input text is clearly unrelated to healthcare, medical practice, or regulated health services (e.g., a post about a holiday, a car, a pet, purely personal non-medical content), you must return status: 'NOT_HEALTHCARE'.
   - In this case, use the exact summary: "This content doesn't appear to be healthcare-related. Ahpra compliance guidelines only apply to posts about healthcare services, medical advice, or professional medical practice. Tip: If this is healthcare-related content, try including relevant terms such as treatment, patient, consultation, or your medical specialty."

G. IMAGE ANALYSIS (If image provided):
   - Analyze the image for compliance with the "Visual examples of cosmetic surgery advertising" and Guidelines.
   - Check for: Inconsistent lighting/posing in before/afters, use of makeup in after photos, sexualized imagery, lifestyle settings, emojis hiding features, lack of warnings in the image itself (if text overlay exists).

H. SPECIFIC CATEGORIES OF CONDUCT (Must be identified if applicable):
   • Endorsing Capital Punishment: Posts that endorse calls for capital punishment for medical practitioners who provide termination of pregnancy services.
   • Calls for Violence and Genocide: Posts that appear to endorse or call for violence and/or genocide toward specific racial and religious groups.
   • Denigrating Abortion Providers: Posts that denigrate, demean, and slur medical practitioners who provide termination of pregnancy services.
   • Denigrating Gender Dysphoria Treatment: Posts that denigrate practitioners who recognise and treat gender dysphoria in accordance with accepted medical practice.
   • Comments on Transgender Individuals: Posts that denigrate practitioners who recognise that people who identify as transgender are not suffering from a mental health condition.
   • LGBQTI+ Commentary: Commentary expressing demeaning views regarding LGBQTI+ persons that have no proper clinical basis and are contrary to accepted medical practice.

You must return a structured JSON analysis of the post content provided.`;

export const analyzePost = async (postContent: string, image?: { base64: string, mimeType: string }): Promise<AnalysisResult> => {
  // Use process.env.API_KEY directly as required by guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [{ text: `Analyse this social media post for Ahpra compliance: "${postContent}"` }];

  if (image) {
    parts.push({
      inlineData: {
        data: image.base64,
        mimeType: image.mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              description: "Must be COMPLIANT, NON_COMPLIANT, WARNING, or NOT_HEALTHCARE",
            },
            summary: {
              type: Type.STRING,
              description: "A short high-level summary of the findings.",
            },
            overallVerdict: {
              type: Type.STRING,
              description: "A final message for the practitioner.",
            },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  guidelineReference: { type: Type.STRING, description: "Which specific Ahpra guideline is relevant." },
                  finding: { type: Type.STRING, description: "What exactly is the potential breach." },
                  severity: { type: Type.STRING, description: "Critical or Warning" },
                  recommendation: { type: Type.STRING, description: "How to fix the content to be compliant." }
                },
                required: ["guidelineReference", "finding", "severity", "recommendation"]
              }
            }
          },
          required: ["status", "summary", "overallVerdict", "issues"]
        }
      },
    });

    // Access .text property directly, do not call as a function
    const result = JSON.parse(response.text || '{}') as AnalysisResult;
    
    if (result.status === ComplianceStatus.NOT_HEALTHCARE) {
      throw new Error(result.summary);
    }
    
    return result;
  } catch (error: any) {
    if (error.message.includes("healthcare-related")) {
      throw error;
    }
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze post. Please try again.");
  }
};

export const generateCompliantRewrites = async (originalPost: string, issues: ComplianceIssue[]): Promise<RewrittenPost[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const promptText = `
    The following social media post has been flagged with non-compliant issues under Australian Ahpra law.
    
    ORIGINAL POST: "${originalPost}"
    
    IDENTIFIED ISSUES: 
    ${JSON.stringify(issues)}
    
    TASK:
    Rewrite the post to be fully compliant while maintaining the original intent as much as possible. 
    Provide 3 distinct options (e.g., 'Minimal Edit', 'Educational/Professional', 'Safe/Conservative').
    Ensure Australian/UK spelling is used (e.g., 'recognise', 'centre', 'programme').
    If the issues relate to an image (which you cannot edit), include a bracketed note in the content [NOTE: ...] advising the user on what to change visually.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              optionTitle: { type: Type.STRING, description: "E.g., Minimal Edit, Professional Rewrite" },
              content: { type: Type.STRING, description: "The rewritten compliant post text" },
              explanation: { type: Type.STRING, description: "Brief explanation of what was changed to ensure compliance" }
            },
            required: ["optionTitle", "content", "explanation"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]') as RewrittenPost[];
  } catch (error) {
    console.error("Error generating rewrites:", error);
    throw new Error("Failed to generate compliant suggestions.");
  }
};
