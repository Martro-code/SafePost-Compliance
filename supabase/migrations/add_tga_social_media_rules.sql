-- Migration: Add TGA Social Media Advertising Rules (November 2025 Guidance Update)
-- This migration creates the guidelines table (if it does not already exist)
-- and inserts six new TGA social media advertising rules based on the
-- TGA Social Media Guidance published 5 November 2025.

CREATE TABLE IF NOT EXISTS public.guidelines (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code          text NOT NULL UNIQUE,
  section       text NOT NULL,
  title         text NOT NULL,
  description   text NOT NULL,
  severity      text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  category      text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- 1. Influencer and affiliate advertising
INSERT INTO public.guidelines (code, section, title, description, severity, category)
VALUES (
  'TGA-SM-2025-001',
  'Therapeutic Goods Advertising Code 2021, Section 4 (definition of "advertiser") read with TGA Social Media Guidance November 2025',
  'TGA Advertising Code — Influencer and affiliate advertising',
  'Social media posts by influencers, ambassadors, creators, affiliates, or paid partners about therapeutic goods constitute advertising and must comply with the Code regardless of whether the practitioner or business controls the account directly.',
  'high',
  'TGA Social Media'
);

-- 2. Repost, share, and hashtag amplification
INSERT INTO public.guidelines (code, section, title, description, severity, category)
VALUES (
  'TGA-SM-2025-002',
  'Therapeutic Goods Advertising Code 2021, TGA Social Media Guidance November 2025',
  'TGA Advertising Code — Repost, share, and hashtag amplification',
  'Promotional use of reposts, shares, likes, tags, links, hashtags, stories, reels, livestreams, sponsored ads, and closed groups or channels about therapeutic goods constitutes advertising activity subject to TGA requirements.',
  'high',
  'TGA Social Media'
);

-- 3. User-generated testimonials and endorsements
INSERT INTO public.guidelines (code, section, title, description, severity, category)
VALUES (
  'TGA-SM-2025-003',
  'Therapeutic Goods Advertising Code 2021, Section 20 (testimonials) read with TGA Social Media Guidance November 2025',
  'TGA Advertising Code — User-generated testimonials and endorsements',
  'Testimonials or endorsements appearing in comments or user-generated content that the advertiser controls, moderates, or republishes are subject to the same testimonial restrictions as directly published content.',
  'high',
  'TGA Social Media'
);

-- 4. Dark marketing and closed-channel dissemination
INSERT INTO public.guidelines (code, section, title, description, severity, category)
VALUES (
  'TGA-SM-2025-004',
  'Therapeutic Goods Advertising Code 2021, TGA Social Media Guidance November 2025',
  'TGA Advertising Code — Dark marketing and closed-channel dissemination',
  'Targeting tactics using closed channels, private groups, or "dark marketing" methods to disseminate therapeutic goods advertising are subject to TGA advertising requirements regardless of the private or restricted nature of the channel.',
  'high',
  'TGA Social Media'
);

-- 5. AI-generated advertising content
INSERT INTO public.guidelines (code, section, title, description, severity, category)
VALUES (
  'TGA-SM-2025-005',
  'Therapeutic Goods Advertising Code 2021, TGA Social Media Guidance November 2025',
  'TGA Advertising Code — AI-generated advertising content',
  'AI-generated or AI-assisted advertising content about therapeutic goods remains fully subject to TGA advertising requirements. The use of AI to create content does not exempt it from compliance obligations.',
  'high',
  'TGA Social Media'
);

-- 6. Adverse event capture from social channels
INSERT INTO public.guidelines (code, section, title, description, severity, category)
VALUES (
  'TGA-SM-2025-006',
  'Therapeutic Goods Advertising Code 2021, TGA Social Media Guidance November 2025, TGA Pharmacovigilance responsibilities',
  'TGA Advertising Code — Adverse event capture from social channels',
  'Adverse-event mentions appearing in comments or user interactions on social media channels controlled by a therapeutic goods advertiser may trigger moderation and escalation obligations to the TGA.',
  'critical',
  'TGA Social Media'
);
