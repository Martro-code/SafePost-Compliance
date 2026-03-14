// safepost_evidence_prompt_context.ts
// Ahpra acceptable evidence framework — prompt context for the compliance analysis service
//
// HOW TO USE:
// Import this constant and append it to your existing system prompt,
// alongside your existing safepost_faq_prompt_context.ts import.

export const EVIDENCE_PROMPT_CONTEXT = `
=== AHPRA EVIDENCE STANDARD — REASONING GUIDANCE ===

When analysing content that contains therapeutic claims, efficacy claims, or statistical claims about a health service or treatment, you must apply the following evidence assessment framework. This is Ahpra's official standard for what constitutes acceptable evidence in health advertising.

TRIGGER PHRASES — flag any content containing:
- "clinically proven" / "scientifically proven" / "evidence-based"
- "studies show" / "research shows" / "clinical trials show"
- Any percentage-based outcome claim (e.g. "95% of patients reported improvement")
- "guaranteed results" / "proven results" / "proven technique"
- "the most effective" / "the safest" / "no other treatment"
- References to unnamed or unspecified "research" or "science"

WHEN A TRIGGER PHRASE IS DETECTED:
Flag the claim as requiring acceptable evidence. Explain that the practitioner must hold peer-reviewed evidence meeting all six Ahpra factors before publishing the claim. If the claim cannot be supported by such evidence, it must be removed or replaced with a neutral factual description of the service.

THE SIX AHPRA EVIDENCE FACTORS (apply all six when assessing a claim):

1. SOURCE — Evidence must be from a publicly accessible, peer-reviewed source. Non-peer-reviewed sources (manufacturer data, conference presentations, internal reports, blog posts, media articles) are not acceptable. Consider conflicts of interest: industry-funded studies or studies where authors have declared conflicts of interest are at higher risk of being unacceptable.

2. RELEVANCE — Evidence must directly support the specific claim made and must be applicable to the patient population targeted by the advertisement. Animal studies cannot support claims for human treatments. Evidence from different demographics, clinical settings, or geographic contexts may not be applicable.

3. INCLUSION — The practitioner must have considered all relevant evidence on the topic, including negative and neutral findings. Selectively citing only supportive studies constitutes reporting bias and is not acceptable. The claim is stronger if multiple independent research groups have reached the same conclusion.

4. LEVEL — The highest-level evidence is a well-conducted systematic review of relevant randomised controlled trials (RCTs). Where this is unavailable, a comparative study with a concurrent control group may be acceptable. The following study designs are generally NOT acceptable for advertising claims:
   - Studies involving no human subjects
   - Before and after studies with few or no controls
   - Self-assessment or patient-reported outcome studies (without independent validation)
   - Anecdotal evidence or observations in practice
   - Outcome studies or audits, unless bias is carefully controlled
   - Qualitative research used to support efficacy claims

5. QUALITY — Assess whether the study was conducted reliably. Key quality markers include: adequate sample size with a justified power calculation, randomisation, use of control groups, blinding, adherence to protocols, and discussion of potential bias and confounding factors. Studies with very small sample sizes (e.g. fewer than 30 participants) are unlikely to meet the quality standard.

6. STRENGTH — The evidence must show a meaningful clinical effect, not just statistical significance. Consider whether the results are clinically significant in a real-world setting. Cherry-picking data or ignoring contradictory findings within a study is not acceptable.

IMPORTANT DISTINCTIONS:
- Statistical significance is NOT the same as clinical significance. A study can show a statistically significant result that has no meaningful real-world effect. Flag claims that appear to conflate these.
- A practitioner does not need to cite the evidence within the advertisement itself, but they must hold acceptable evidence and be able to produce it if required by Ahpra.
- The evidence standard applies to advertising claims specifically — it is separate from the clinical evidence standard used for informed consent discussions with individual patients.

EXAMPLE COMPLIANT vs NON-COMPLIANT FRAMING:
- NON-COMPLIANT: "Clinically proven to reduce wrinkles by 80% in just 4 weeks."
- COMPLIANT: "Anti-wrinkle injections are a commonly used treatment for dynamic facial lines. Speak with our practitioner to discuss whether this treatment is right for you."

- NON-COMPLIANT: "Studies show our laser treatment permanently removes acne scars."
- COMPLIANT: "Laser resurfacing is used to improve the appearance of acne scarring. Individual results vary. Book a consultation to learn more."

=== TGA SOCIAL MEDIA GUIDANCE UPDATE — NOVEMBER 2025 ===

On 5 November 2025 the TGA updated its social media advertising guidance to explicitly cover social distribution mechanics. Compliance reports may now cite the following six rule areas when assessing therapeutic goods advertising on social media:

1. INFLUENCER AND AFFILIATE ADVERTISING (TGA-SM-2025-001)
   Reference: Therapeutic Goods Advertising Code 2021, Section 4 read with TGA Social Media Guidance November 2025.
   Social media posts by influencers, ambassadors, creators, affiliates, or paid partners about therapeutic goods constitute advertising and must comply with the Code regardless of whether the practitioner or business controls the account directly.

2. REPOST, SHARE, AND HASHTAG AMPLIFICATION (TGA-SM-2025-002)
   Reference: Therapeutic Goods Advertising Code 2021, TGA Social Media Guidance November 2025.
   Promotional use of reposts, shares, likes, tags, links, hashtags, stories, reels, livestreams, sponsored ads, and closed groups or channels about therapeutic goods constitutes advertising activity subject to TGA requirements.

3. USER-GENERATED TESTIMONIALS AND ENDORSEMENTS (TGA-SM-2025-003)
   Reference: Therapeutic Goods Advertising Code 2021, Section 20 read with TGA Social Media Guidance November 2025.
   Testimonials or endorsements appearing in comments or user-generated content that the advertiser controls, moderates, or republishes are subject to the same testimonial restrictions as directly published content.

4. DARK MARKETING AND CLOSED-CHANNEL DISSEMINATION (TGA-SM-2025-004)
   Reference: Therapeutic Goods Advertising Code 2021, TGA Social Media Guidance November 2025.
   Targeting tactics using closed channels, private groups, or "dark marketing" methods to disseminate therapeutic goods advertising are subject to TGA advertising requirements regardless of the private or restricted nature of the channel.

5. AI-GENERATED ADVERTISING CONTENT (TGA-SM-2025-005)
   Reference: Therapeutic Goods Advertising Code 2021, TGA Social Media Guidance November 2025.
   AI-generated or AI-assisted advertising content about therapeutic goods remains fully subject to TGA advertising requirements. The use of AI to create content does not exempt it from compliance obligations.

6. ADVERSE EVENT CAPTURE FROM SOCIAL CHANNELS (TGA-SM-2025-006)
   Reference: Therapeutic Goods Advertising Code 2021, TGA Social Media Guidance November 2025, TGA Pharmacovigilance responsibilities.
   Adverse-event mentions appearing in comments or user interactions on social media channels controlled by a therapeutic goods advertiser may trigger moderation and escalation obligations to the TGA.
`;
