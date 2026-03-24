-- Migration: Add TGA Social Media Advertising Rules (November 2025 Guidance Update)
-- Inserts six new TGA social media advertising rules into the existing guidelines table.
-- The guidelines table already exists with 174 rows — this migration only adds new rows.

-- 1. Influencer and affiliate advertising
INSERT INTO public.guidelines (category, subcategory, source_document, section_reference, rule_text, plain_english_summary, recommended_action, regulatory_framework)
VALUES (
  'TGA',
  'Influencer and Affiliate Advertising',
  'Therapeutic Goods Advertising Code 2021 — TGA Social Media Guidance November 2025',
  'Section 4 (definition of advertiser)',
  'Social media posts by influencers, ambassadors, creators, affiliates, or paid partners about therapeutic goods constitute advertising and must comply with the Code regardless of whether the practitioner or business controls the account directly.',
  'If you pay or reward someone to promote your therapeutic goods on social media, their posts are your advertising and must follow TGA rules.',
  'Review any influencer, affiliate, or ambassador arrangements involving therapeutic goods and ensure all content meets TGA advertising requirements.',
  'tga'
);

-- 2. Social media amplification mechanics
INSERT INTO public.guidelines (category, subcategory, source_document, section_reference, rule_text, plain_english_summary, recommended_action, regulatory_framework)
VALUES (
  'TGA',
  'Social Media Amplification Mechanics',
  'Therapeutic Goods Advertising Code 2021 — TGA Social Media Guidance November 2025',
  'TGA Social Media Guidance November 2025',
  'Promotional use of reposts, shares, likes, tags, links, hashtags, stories, reels, livestreams, sponsored ads, and closed groups or channels about therapeutic goods constitutes advertising activity subject to TGA requirements.',
  'Using hashtags, reposts, stories, or reels to promote therapeutic goods is advertising — TGA rules apply even if it feels informal.',
  'Audit your social media activity for promotional amplification mechanics involving therapeutic goods and assess each for TGA compliance.',
  'tga'
);

-- 3. User-generated testimonials and endorsements
INSERT INTO public.guidelines (category, subcategory, source_document, section_reference, rule_text, plain_english_summary, recommended_action, regulatory_framework)
VALUES (
  'TGA',
  'User-Generated Testimonials and Endorsements',
  'Therapeutic Goods Advertising Code 2021 — TGA Social Media Guidance November 2025',
  'Section 20 (testimonials)',
  'Testimonials or endorsements appearing in comments or user-generated content that the advertiser controls, moderates, or republishes are subject to the same testimonial restrictions as directly published content.',
  'If you repost or moderate a comment praising your therapeutic goods, it becomes your testimonial and must comply with TGA testimonial rules.',
  'Review your comment moderation and reposting practices for therapeutic goods content — republished praise may constitute a regulated testimonial.',
  'tga'
);

-- 4. Dark marketing and closed-channel dissemination
INSERT INTO public.guidelines (category, subcategory, source_document, section_reference, rule_text, plain_english_summary, recommended_action, regulatory_framework)
VALUES (
  'TGA',
  'Dark Marketing and Closed-Channel Dissemination',
  'Therapeutic Goods Advertising Code 2021 — TGA Social Media Guidance November 2025',
  'TGA Social Media Guidance November 2025',
  'Targeting tactics using closed channels, private groups, or dark marketing methods to disseminate therapeutic goods advertising are subject to TGA advertising requirements regardless of the private or restricted nature of the channel.',
  'Promoting therapeutic goods in private Facebook groups or via closed messaging channels is still advertising — TGA rules still apply.',
  'Ensure any closed-channel or targeted dissemination of therapeutic goods content meets TGA advertising requirements.',
  'tga'
);

-- 5. AI-generated advertising content
INSERT INTO public.guidelines (category, subcategory, source_document, section_reference, rule_text, plain_english_summary, recommended_action, regulatory_framework)
VALUES (
  'TGA',
  'AI-Generated Advertising Content',
  'Therapeutic Goods Advertising Code 2021 — TGA Social Media Guidance November 2025',
  'TGA Social Media Guidance November 2025',
  'AI-generated or AI-assisted advertising content about therapeutic goods remains fully subject to TGA advertising requirements. The use of AI to create content does not exempt it from compliance obligations.',
  'Using AI to write or design your therapeutic goods advertising does not reduce your compliance obligations — TGA rules apply regardless of how the content was created.',
  'Apply the same TGA compliance checks to AI-generated content as you would to manually created therapeutic goods advertising.',
  'tga'
);

-- 6. Adverse event capture from social channels
INSERT INTO public.guidelines (category, subcategory, source_document, section_reference, rule_text, plain_english_summary, recommended_action, regulatory_framework)
VALUES (
  'TGA',
  'Adverse Event Capture from Social Channels',
  'Therapeutic Goods Advertising Code 2021 — TGA Social Media Guidance November 2025 — TGA Pharmacovigilance Responsibilities',
  'TGA Social Media Guidance November 2025',
  'Adverse-event mentions appearing in comments or user interactions on social media channels controlled by a therapeutic goods advertiser may trigger moderation and escalation obligations to the TGA.',
  'If someone mentions a side effect or adverse reaction in the comments of your therapeutic goods social media post, you may be legally required to report it to the TGA.',
  'Establish a process to monitor social media comments on therapeutic goods content for adverse event mentions and escalate to your pharmacovigilance process as required.',
  'tga'
);
