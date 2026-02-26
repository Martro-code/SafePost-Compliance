/**
 * SafePost™ — AHPRA FAQ Context Block
 * Source: Ahpra Advertising Hub Frequently Asked Questions
 *
 * PURPOSE:
 * This constant provides authoritative AHPRA guidance on edge cases and
 * grey-area questions that are NOT fully resolved by the guidelines database
 * rows alone. Inject this into your Claude API system prompt so the AI can
 * reason correctly about scope, responsibility, and nuanced scenarios users
 * will commonly ask about.
 *
 * HOW TO USE:
 * Append FAQ_CONTEXT to your existing system prompt string in geminiService.ts
 * (or wherever you construct your Claude API messages array).
 *
 * Example:
 *   const systemPrompt = `${YOUR_EXISTING_SYSTEM_PROMPT}\n\n${FAQ_CONTEXT}`;
 *
 * This content is sourced directly from the AHPRA Advertising Hub FAQ and
 * represents AHPRA's authoritative interpretation of the National Law.
 * It should be treated with the same weight as the guidelines themselves.
 */

export const FAQ_CONTEXT = `
## AHPRA Advertising Hub — FAQ Guidance for Edge Cases

The following guidance comes directly from the AHPRA Advertising Hub FAQ. 
Apply it when assessing content that raises questions about who is responsible, 
whether the law applies, or how specific content types should be treated.

---

### 1. WHO IS AN "ADVERTISER" — SCOPE OF RESPONSIBILITY

The advertising requirements apply to ANYONE who advertises a regulated health 
service — not just registered practitioners. This includes businesses, partnerships, 
and corporate entities.

A person or entity is the "advertiser" (and therefore responsible) if they:
- Publish the content themselves, OR
- Authorise content to be published, OR  
- Direct a third party, staff member, or marketing agency to draft or publish content, OR
- Have the ability to modify or remove content published by an unrelated publisher.

Key implication: If a practitioner engages a marketing agency to create advertising, 
the PRACTITIONER is responsible for that content complying with the National Law. 
They must check all content produced by others on their behalf before it is published.

A practitioner is NOT responsible for removing testimonials or content on websites 
they do not control and cannot modify or remove.

---

### 2. SCOPE OF THE NATIONAL LAW — EXTENDS BEYOND REGULATED SERVICES

The advertising requirements apply to ALL of a practitioner's advertising — not just 
the portion relating to their regulated health service.

Example: A physiotherapist who also practises as a naturopath and advertises both 
services must comply with the National Law advertising requirements for ALL their 
advertising — including advertising that is solely about their naturopathic services.

When analysing content: if the person is a registered health practitioner, treat all 
their advertising as subject to the National Law, even if the specific content 
being reviewed relates to a non-regulated service they also offer.

---

### 3. BREACH CONSEQUENCES — RISK-TIERED ENFORCEMENT

Not all breaches carry the same consequences. AHPRA uses a risk-tiered approach:

LOW / MEDIUM RISK breaches:
- Handled through an administrative process
- Matter is closed once the practitioner corrects the breach
- No registration impact if corrected promptly

HIGH RISK breaches:
- Prioritised for investigation, prosecution, or disciplinary action
- May affect registration
- Examples include: content that could cause significant public harm, 
  systematic misinformation, exploitation of vulnerable patients

REPEATED / UNCORRECTED breaches:
- The National Board may place CONDITIONS on registration preventing the 
  practitioner from advertising at all
- Each non-compliant advertisement is a separate offence (up to $5,000/individual, 
  $10,000/body corporate per offence)

When advising users: always recommend correcting breaches immediately. 
The risk to registration is lower for first-time, promptly corrected breaches.
AHPRA cannot pre-approve advertising — practitioners must self-assess.

---

### 4. AWARD SYMBOLS AND RATINGS — NUANCED TESTIMONIAL RULING

This is a commonly misunderstood grey area. Apply this distinction carefully:

PERMITTED: Publishing an award symbol, badge, or rating on your website 
(e.g. "Winner: Best Clinic 2024" badge from a review platform) is NOT a testimonial 
and does NOT breach the National Law — provided the badge itself does not 
republish the underlying patient reviews on which the award was based.

NOT PERMITTED: If publishing the award symbol requires republishing or displaying 
the patient reviews or comments on which the award or rating is based, this IS a 
breach — those reviews are testimonials.

Rule: The symbol/title/rating itself ≠ testimonial. The patient review text behind it = 
testimonial if republished.

---

### 5. BIRTH STORIES — CONTEXT-DEPENDENT RULING

Whether a birth story is a testimonial depends entirely on WHERE it appears and 
WHO published it:

NOT a testimonial (permitted):
- Published on the PATIENT'S OWN social media page
- Published on an independent patient review site
- The patient is sharing their own story in a forum not controlled by the practitioner

IS a testimonial (prohibited in advertising context):
- Published on the practitioner's or clinic's website
- Published on the practitioner's or clinic's social media pages
- The practitioner SHARES, REPUBLISHES, or PROMOTES the patient's birth story 
  (even if the original was on the patient's own page)

Key test: Is the practitioner using the birth story to advertise their regulated 
health service? If yes, it is a prohibited testimonial regardless of format.

---

### 6. HOSPITAL / CLINIC FUNDRAISING PATIENT STORIES

Patient stories used in fundraising material occupy a grey area. Apply this test:

UNLIKELY to be "advertising" (testimonial ban unlikely to apply):
- The overriding purpose of the material is to raise donations or financial support
- The material is not primarily designed to attract patients to the service

LIKELY to be "advertising" (testimonial ban likely to apply):
- The material serves a dual purpose of fundraising AND attracting patients
- The clinical outcomes described would lead a reasonable person to seek the service

This requires case-by-case judgement. When in doubt, advise the user to seek 
legal advice, and flag that the content may be in a grey area.

---

### 7. EDITING REVIEWS — HIGH RISK ACTIVITY

Editing patient reviews before publishing them is HIGH RISK and almost always 
results in content that is false, misleading or deceptive. The following scenarios 
are all prohibited:

- Editing a negative review to make it positive → falsely presents feedback
- Removing negative portions of a mixed review → implies the reviewer 
  only had positive comments (false impression)
- Editing a review that contains both clinical and non-clinical comments so 
  that ONLY the non-clinical comments remain → distorts the feedback even 
  if the remaining content is technically non-clinical

Only COMPLETE and UNEDITED reviews that do not contain clinical aspects 
may be published without breaching the testimonial ban.

If a user asks whether they can edit reviews before publishing: advise strongly 
against it. Even seemingly minor edits carry high risk of creating a misleading 
impression.

---

### 8. THIRD-PARTY WEBSITES — LIABILITY TEST

Whether a practitioner is responsible for content on third-party websites depends 
on their level of control. Apply this two-part test:

RESPONSIBLE (National Law applies) if EITHER:
(a) The practitioner authorised the content to be published there, OR
(b) The practitioner has the ability to modify or remove the content 
    (e.g. they can delete a patient review left on their social media page, 
    or disable the review function)

NOT RESPONSIBLE if:
- The content is on a website they did not authorise and cannot modify or remove
- AHPRA does not expect practitioners to monitor the entire internet for 
  unsolicited mentions of their services

IMPORTANT EXCEPTION — Engagement = Using a Testimonial:
Even if a practitioner is not responsible for a third-party testimonial, if they 
CHOOSE TO ENGAGE with it (liking, responding, sharing, commenting), this 
constitutes "using" the testimonial to advertise, which IS prohibited.
Advise users: do not engage with third-party reviews or testimonials about your 
clinical services, even if you did not create them and cannot remove them.

---

### 9. BULK PURCHASE DISCOUNTS — PERMITTED WITH RISK

Discounts to specific patient groups (e.g. pensioners, Health Care Card holders) 
are permitted — there are no National Law restrictions on group discounts, provided 
terms and conditions are clearly stated.

Bulk purchase discounts (e.g. pay for 5 sessions, get 1 free) are also not 
prohibited IN PRINCIPLE — however they carry a specific risk:

If the bulk offer encourages more treatment than is clinically necessary or 
provides no additional therapeutic benefit beyond what fewer sessions would 
provide, this may breach s.133(1)(e) (encouraging indiscriminate use).

Example from AHPRA: An offer for 4 treatments, when 2 treatments would be 
clinically effective, may encourage patients to purchase unnecessary treatments 
to take advantage of the discount — this may be unlawful.

When assessing bulk discount offers: flag if the volume offered appears to exceed 
what is typically clinically indicated for the service.

---

### 10. "DR" TITLE — NON-MEDICAL PRACTITIONERS

"Doctor" and "Dr" are NOT protected titles under the National Law. However:

Non-medical practitioners using "Dr" in advertising (e.g. those holding a PhD 
or doctorate) MUST make their actual registered profession clear to avoid 
misleading the public, who historically associate "Dr" with medical practitioners.

Required format: "Dr [Name] ([profession])" — e.g. "Dr Lee (Osteopath)"
Insufficient: "Dr Lee" alone, with no profession identified

This applies regardless of whether the person genuinely holds a doctorate degree 
or PhD. The obligation is to prevent the public from believing they are a 
registered medical practitioner when they are not.

---

### 11. ONLINE MARKETING PRODUCTS

There is no ban on using online marketing products, platforms, or tools to 
advertise health services. Practitioners may use any marketing technology 
they wish — but the CONTENT of that advertising must comply with the National Law.

The medium does not affect the compliance obligation.

---

END OF FAQ GUIDANCE
`;
