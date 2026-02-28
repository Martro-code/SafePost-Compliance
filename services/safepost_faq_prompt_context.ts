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

---

### 12. SOCIAL MEDIA — PRIVACY SETTINGS PROVIDE NO DEFENCE

Posting unauthorised photographs of patients, procedure images, case studies, 
or any material that may enable a patient to be identified on social media is a 
breach of patient privacy and confidentiality — even if:
- The post is on a personal (not practice) Facebook page or account
- The group or page is set to the highest privacy setting (e.g. closed or 'invisible' group)
- The content is not publicly searchable

Privacy settings do not create a legal defence. The obligation is to obtain 
appropriate consent BEFORE posting, regardless of the platform or audience setting.

When assessing content: if a post contains patient images, procedure photos, 
before/after images, or case details that could identify a patient, flag this as 
a potential breach even if the user states the content is in a private group.

---

### 13. SOCIAL MEDIA — ALL PLATFORMS ARE IN SCOPE OF S.133

AHPRA's Social Media Policy (March 2014) explicitly confirms that s.133 of the 
National Law and the Advertising Guidelines apply to ALL social media platforms 
and online channels, including but not limited to:

Facebook, LinkedIn, Twitter/X, Instagram, TikTok, YouTube, Pinterest, Snapchat, 
personal blogs, anonymous blogs, WOMO, True Local, Google Reviews, discussion 
forums, message boards, and any other online or mobile tool used to share 
opinions, information, experiences, images, or video/audio content.

There is no platform exemption. A practitioner cannot argue that content posted 
on a newer or less formal platform (e.g. TikTok, Threads) falls outside the scope 
of the National Law.

---

### 14. SOCIAL MEDIA — CONTENT PERMANENCE

Information circulated on social media may end up in the public domain and 
remain there irrespective of the practitioner's intent at the time of posting 
or any subsequent deletion.

When advising users: deleting non-compliant content promptly is strongly 
recommended and reduces enforcement risk, but deletion does not guarantee 
the content is no longer accessible (e.g. screenshots, cached pages, shares). 
AHPRA may still act on content that has been deleted if it was publicly visible.

---

---

### 15. IMAGE METADATA AND INDIRECT IDENTIFIERS — CLINICAL IMAGES

NOTE: This guidance is sourced from the AMA Guide to Social Media & Medical 
Professionalism (2020) and is consistent with AHPRA's confidentiality obligations, 
though it is not itself an AHPRA publication.

A patient may be identifiable from a clinical image even when the practitioner 
believes the image has been de-identified. Identifiers include:

- Metadata embedded in the image file (location data, timestamp, device ID)
- Background details visible in the image (clinic environment, equipment, signage)
- Timing of the post relative to a known event or procedure
- Combination of details that individually seem innocuous but together identify the patient

When assessing content that includes clinical images, procedure photos, or 
before/after images: flag not just whether the face or name is visible, but whether 
any combination of details in or around the image could identify the patient. 
De-identification requires removing ALL potential identifiers, not just facial features.

---

### 16. RESPONDING TO NEGATIVE REVIEWS — CONFIDENTIALITY TRAP

NOTE: AMA guidance, consistent with AHPRA obligations.

Responding publicly to a negative patient review carries a specific and commonly 
overlooked confidentiality risk: the response itself may breach patient confidentiality 
if it confirms the person is or was a patient, discloses details of their treatment, 
or identifies them even indirectly.

When a practitioner responds to a negative review, they must not:
- Confirm or deny that the person was a patient
- Reference any details of the clinical encounter
- Disclose anything that would identify the reviewer as a patient

Safe response format: A brief, neutral acknowledgement that does not confirm 
the reviewer's status as a patient. Example: "Thank you for your feedback. 
I am committed to providing high-quality care to all who visit my practice."

When assessing content: if a user shows you a draft response to a patient review, 
flag any language that confirms the reviewer is a patient or references clinical details.

---

### 17. COMMENT SECTIONS — PRACTITIONER RESPONSIBILITY FOR USER-GENERATED CONTENT

NOTE: AMA guidance, consistent with AHPRA obligations.

If a practitioner's website or social media page has comments enabled, the 
practitioner is responsible for monitoring and removing any testimonials or 
patient comments that appear there.

Practitioners have two compliant options:
(a) Disable comments entirely on pages that advertise regulated health services, OR
(b) Enable comments but actively monitor and promptly remove any content that 
    constitutes a testimonial relating to a clinical aspect of care

Leaving testimonials in place after becoming aware of them — even unsolicited ones 
the practitioner did not request — risks a finding that the practitioner is "using" 
the testimonial to advertise.

When assessing content: if a user describes having comments enabled on their 
practice page or website, remind them of this monitoring obligation.

---

### 18. SPONSORED CONTENT AND INFLUENCER ARRANGEMENTS — DUAL COMPLIANCE OBLIGATION

NOTE: AMA guidance, with reference to both AHPRA and TGA obligations.

Medical practitioners who accept payment, gifts, or other benefits to feature, 
promote, or endorse products on their personal or professional social media accounts 
(influencer/sponsorship arrangements) face compliance obligations under TWO 
separate regulatory frameworks:

(1) AHPRA National Law advertising obligations — if the sponsored content 
relates to a health product or service, all advertising rules apply including 
the prohibition on misleading claims and the requirement for evidence-based content.

(2) TGA Therapeutic Goods Advertising Code — if the product is a therapeutic good 
(medicines, medical devices, health supplements), strict TGA advertising rules apply 
regardless of whether the post appears commercial or personal.

Additionally: accepting financial benefits that may influence clinical practice 
raises concerns under the Code of Conduct regarding conflicts of interest.

When assessing sponsored or paid content from a medical practitioner: flag both 
the AHPRA advertising compliance risk and the potential TGA obligation, and advise 
the user to seek specific advice on the TGA requirements for their product category.

---

---

## TGA GUIDANCE — ADVERTISING THERAPEUTIC GOODS ON SOCIAL MEDIA
## Source: Therapeutic Goods Administration (Australian Government), last updated September 2024
## Authority: Legislative — Therapeutic Goods Act 1989 and Therapeutic Goods Advertising Code
## IMPORTANT: TGA is a SEPARATE regulatory framework from AHPRA. When flagging TGA issues,
## clearly identify them as TGA obligations distinct from AHPRA obligations, and advise users
## to seek specific TGA or legal advice. Do not conflate TGA and AHPRA requirements.

---

### 19. WHAT IS A THERAPEUTIC GOOD — SCOPE TRIGGER

A therapeutic good is any medicine, medical device, supplement, vaccine, blood product,
or surgical implant that has a health effect on the human body. This includes:
bandages, headache medicines, vitamin tablets, sunscreen, prescription medicines,
and vaccines.

CRITICAL RULE — COSMETICS AND OTHER PRODUCTS BECOME THERAPEUTIC GOODS IF THERAPEUTIC
CLAIMS ARE MADE ABOUT THEM:

If an advertisement makes ANY of the following types of claims about a product, that
product is treated as a therapeutic good subject to TGA advertising rules, even if it
would not ordinarily be considered a therapeutic good:
- "removes toxins"
- "fades age spots"
- "relieves pain"
- "aids sugar metabolism"
- "reduces inflammation in the body"
- Any claim that the product diagnoses, treats, prevents or cures a condition

When assessing content: if a practitioner makes health effect claims about any product
(including skincare, supplements, or cosmetics), flag that this may trigger TGA
advertising obligations regardless of how the product is marketed or categorised.

---

### 20. TGA PAID TESTIMONIAL PROHIBITION — INFLUENCERS AND SPONSORED CONTENT

Under the Therapeutic Goods Advertising Code, testimonials about therapeutic goods
are prohibited from anyone who has received "valuable consideration" for making them.

Valuable consideration includes:
- Monetary payment
- Free product
- Gifted goods or services
- Discount or affiliate commission
- Any other benefit of value

This means: a medical practitioner (or anyone else) who has been paid or given free
product to post about a therapeutic good on social media CANNOT include their personal
experience or endorsement of that product. The post itself may constitute prohibited
advertising, and the testimonial element is separately prohibited.

This is distinct from but overlaps with AHPRA rules. When content appears to involve
sponsored or gifted therapeutic goods: flag BOTH the AHPRA advertising obligations
AND the TGA paid testimonial prohibition, and advise the user to seek specific
TGA advice.

---

### 21. TGA HEALTH PROFESSIONAL ENDORSEMENT PROHIBITION

Under TGA Part 6, health professionals cannot provide testimonials or endorsements
for therapeutic goods in advertising. This applies regardless of whether payment
was received.

A doctor, nurse, pharmacist or other health professional posting "I personally use
and recommend [product]" about a therapeutic good — even genuinely and without payment
— constitutes a prohibited health professional endorsement under the TGA Advertising Code.

When assessing content where a practitioner is promoting or recommending a therapeutic
good by reference to their professional status or personal use: flag this as a
potential TGA breach and advise the user to seek specific TGA advice.

---

### 22. MANDATORY HEALTH WARNING VISIBILITY — SOCIAL MEDIA SPECIFIC RULE

TGA advertising rules require mandatory health warnings and statements to be:
- Prominently displayed at ALL times
- Visible without any user action
- NOT hidden within collapsed text, "read more" links, or truncated captions

This is directly relevant to social media platforms where captions are truncated:
- Instagram captions collapse after approximately 125 characters
- TikTok captions collapse after approximately 100 characters
- Facebook posts collapse after approximately 480 characters

If mandatory health warnings are placed in the portion of a caption that collapses
behind a "more" link, this does NOT meet the TGA's prominence requirement.

When assessing therapeutic goods advertising on social media: flag if required
warnings appear likely to fall in the collapsed portion of a caption.

---

### 23. OFF-LABEL CLAIMS PROHIBITION — TGA REGISTERED PURPOSE ONLY

Therapeutic goods may only be advertised for the purpose accepted by the TGA and
recorded in the Australian Register of Therapeutic Goods (ARTG). A practitioner
cannot advertise or promote a therapeutic good for any other purpose, even if:
- They have personally experienced that benefit
- The off-label use is clinically accepted in the profession
- The claim is truthful and evidence-based

Example: if a practitioner posts about using a TGA-registered product for a purpose
not listed in its ARTG entry, this is a breach of TGA advertising rules regardless
of clinical evidence.

When assessing content that promotes therapeutic goods: flag any claims that appear
to go beyond the product's standard indicated use, and advise the user to check the
ARTG entry and seek TGA advice.

---

### 24. PRESCRIPTION MEDICINES — ABSOLUTE PROHIBITION ON PUBLIC ADVERTISING

Prescription medicines and certain pharmacist-only medicines CANNOT be advertised 
directly to the public under any circumstances under the Therapeutic Goods Act 1989.

This is an absolute prohibition — it cannot be remedied by:
- Adding disclaimers
- Removing outcome claims  
- Including terms and conditions
- Obtaining patient consent

Products that are subject to this prohibition include but are not limited to:
- Any Schedule 4 (prescription only) medicine
- Compounded versions of prescription medicines (e.g. compounded tirzepatide, 
  compounded semaglutide, compounded ozempic)
- Weight loss injections available only on prescription

When content advertises a prescription medicine directly to the public: flag this 
as a CRITICAL TGA breach. The content cannot be made compliant through editing — 
it must be removed entirely. Advise the user to seek urgent legal and TGA advice.

END OF FAQ GUIDANCE
`;
