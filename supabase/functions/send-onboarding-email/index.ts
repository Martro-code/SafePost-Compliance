import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { buildUnsubscribeUrl } from '../_shared/unsubscribe-token.ts';

const allowedOrigins = [
  'https://www.safepost.com.au',
  'https://safepost.com.au',
  'http://localhost:3000',
  'http://localhost:5173',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

const BASE_URL = 'https://www.safepost.com.au';

// ---------------------------------------------------------------------------
// CTA link helpers
// ---------------------------------------------------------------------------
const CTA = {
  runCheck: { text: 'Run a compliance check →', url: `${BASE_URL}/dashboard` },
  login: { text: 'Log in to SafePost →', url: `${BASE_URL}/dashboard` },
  viewPlans: { text: 'View plans →', url: `${BASE_URL}/pricing/medical-practitioners` },
  viewHistory: { text: 'View compliance history →', url: `${BASE_URL}/history` },
  addTeam: { text: 'Add your team →', url: `${BASE_URL}/settings` },
  bulkReview: { text: 'Try bulk review →', url: `${BASE_URL}/dashboard` },
  bookCall: { text: 'Book your onboarding call →', url: `${BASE_URL}/contact` },
};

function ctaButton(cta: { text: string; url: string }): string {
  return `<a href="${cta.url}" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0;font-weight:600;">${cta.text}</a>`;
}

function wrap(inner: string, unsubscribeUrl?: string): string {
  const unsubscribeFooter = unsubscribeUrl
    ? `<p style="color:#94a3b8;font-size:11px;margin-top:8px;">You're receiving this because you signed up for SafePost. <a href="${unsubscribeUrl}" style="color:#94a3b8;">Unsubscribe from marketing emails</a>.</p>`
    : '';
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <img src="${BASE_URL}/assets/safepost-logo.png" alt="SafePost" width="200" style="width:200px; max-width:200px; height:auto; display:block; margin-bottom:24px;" />
      ${inner}
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
      <p style="color:#94a3b8;font-size:12px;">SafePost Pty Ltd | <a href="${BASE_URL}" style="color:#94a3b8;">safepost.com.au</a></p>
      ${unsubscribeFooter}
    </div>`;
}

// ---------------------------------------------------------------------------
// Email templates: templates[plan_tier][email_number] → { subject, html(firstName) }
// ---------------------------------------------------------------------------
interface EmailTemplate {
  subject: string;
  html: (name: string, unsubscribeUrl?: string) => string;
}

type TemplateMap = Record<string, Record<number, EmailTemplate>>;

const templates: TemplateMap = {
  // ── STARTER ─────────────────────────────────────────────────────────────
  starter: {
    1: {
      subject: "Welcome to SafePost – you're all set",
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Welcome to SafePost!</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">Welcome to SafePost! You've just taken the first step toward keeping your practice's online presence AHPRA and TGA compliant.</p>
        <p style="color:#475569;">You're on the Starter plan — which gives you 3 free compliance checks so you can see SafePost in action.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Run your first compliance check. Paste any social post, ad, or website content and see exactly what SafePost flags.</p>
        ${ctaButton(CTA.runCheck)}
        <p style="color:#475569;">Got questions? Just reply to this email — we're here to help.</p>
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    2: {
      subject: 'Did you run your first check?',
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Did you run your first check?</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">Just checking in — have you had a chance to run your first compliance check yet?</p>
        <p style="color:#475569;">It takes less than 2 minutes and you'll immediately see how SafePost works on real content.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Paste a recent social post or ad into SafePost and see what comes back.</p>
        ${ctaButton(CTA.runCheck)}
        <p style="color:#475569;">Got questions? Just reply.</p>
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    3: {
      subject: 'What you get when you upgrade',
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">What you get when you upgrade</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">On the Starter plan you have 3 compliance checks to try SafePost out.</p>
        <p style="color:#475569;">When you're ready to do more, here's what upgrading unlocks:</p>
        <p style="color:#475569;">✅ 30–unlimited compliance checks per month<br/>✅ Image and video content analysis<br/>✅ Compliance history<br/>✅ Multi-user access for your team<br/>✅ Priority support</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 See which plan fits your practice.</p>
        ${ctaButton(CTA.viewPlans)}
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    4: {
      subject: 'Why AHPRA and TGA compliance matters for your practice',
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Why AHPRA and TGA compliance matters</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">AHPRA and TGA guidelines around advertising are strict — and the consequences of non-compliant content can include formal complaints, mandatory corrections, or reputational damage.</p>
        <p style="color:#475569;">SafePost checks your content against these guidelines automatically, before it goes out.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Run a check on your most recent social post or ad — even if it's already published. You might be surprised what it finds.</p>
        ${ctaButton(CTA.runCheck)}
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    5: {
      subject: "Your free checks are waiting — here's how to use them",
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Your free checks are waiting</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">You've had SafePost for a week now. If you haven't used all 3 of your free compliance checks yet, now's a great time.</p>
        <p style="color:#475569;">And if you've already used them and want more — upgrading to Professional gives you 30 checks a month for $20.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Log in and use your remaining checks, or upgrade to keep going.</p>
        ${ctaButton(CTA.login)}
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
  },

  // ── PROFESSIONAL ────────────────────────────────────────────────────────
  professional: {
    1: {
      subject: "Welcome to SafePost – you're all set",
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Welcome to SafePost!</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">Welcome to SafePost! You've just taken the first step toward keeping your practice's online presence AHPRA and TGA compliant.</p>
        <p style="color:#475569;">Your Professional plan gives you 30 compliance checks per month, image and video analysis, and compliance history.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Log in and run your very first compliance check. It takes less than 2 minutes.</p>
        ${ctaButton(CTA.login)}
        <p style="color:#475569;">Tomorrow we'll show you how to make the most of your plan.</p>
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    2: {
      subject: "Run your first compliance check – here's how",
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Run your first compliance check</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">Yesterday you got access. Today, let's make it real.</p>
        <p style="color:#475569;">Paste or upload your content and SafePost will flag anything that needs attention before it goes out.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Run a compliance check on a piece of content your practice has published recently — a social post, a client email, anything.</p>
        ${ctaButton(CTA.runCheck)}
        <p style="color:#475569;">Got questions? Just reply.</p>
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    3: {
      subject: 'Try image and video analysis today',
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Try image and video analysis</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">Your Professional plan includes image and video content analysis — not just text.</p>
        <p style="color:#475569;">This means SafePost can check your visual content for compliance too, including promotional images and video ads.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Upload an image or video from your practice's recent content and run a compliance check.</p>
        ${ctaButton(CTA.runCheck)}
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    4: {
      subject: 'Your compliance history is building up',
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Your compliance history is building up</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">Every compliance check you run is saved in your compliance history — the last 30 checks are stored on your Professional plan.</p>
        <p style="color:#475569;">This is your record of due diligence.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Log in and review your compliance history.</p>
        ${ctaButton(CTA.viewHistory)}
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    5: {
      subject: "Need more checks or team access? Here's your next step",
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Need more checks or team access?</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">You've been with SafePost for a week — great work.</p>
        <p style="color:#475569;">If you're finding you need more than 30 checks per month, or want to add team members to your account, our Pro+ plan gives you 100 checks and up to 3 team members for $49/month.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 See if Pro+ or Ultra is right for your practice.</p>
        ${ctaButton(CTA.viewPlans)}
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
  },

  // ── PRO PLUS ────────────────────────────────────────────────────────────
  pro_plus: {
    1: {
      subject: "Welcome to SafePost – you're all set",
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Welcome to SafePost!</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">Welcome to SafePost! You've just unlocked 100 compliance checks per month, multi-user access for up to 3 team members, and full compliance history.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Log in and run your very first compliance check.</p>
        ${ctaButton(CTA.login)}
        <p style="color:#475569;">Tomorrow we'll show you how to get your team set up.</p>
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    2: {
      subject: "Run your first compliance check – here's how",
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Run your first compliance check</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">Yesterday you got access. Today, let's make it real.</p>
        <p style="color:#475569;">Paste or upload your content and SafePost will flag anything that needs attention.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Run a compliance check on a piece of content your practice has published recently.</p>
        ${ctaButton(CTA.runCheck)}
        <p style="color:#475569;">Got questions? Just reply.</p>
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    3: {
      subject: 'Bring your team in – it only takes a minute',
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Bring your team in</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">Your Pro+ plan includes multi-user access for up to 3 team members.</p>
        <p style="color:#475569;">When your whole team is running content through SafePost, nothing slips through the cracks.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Add at least one team member to your SafePost account. Go to Settings → Team Members → Invite.</p>
        ${ctaButton(CTA.addTeam)}
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    4: {
      subject: 'Your compliance history is building up',
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Your compliance history is building up</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">Every compliance check you run is saved — your Pro+ plan stores your last 100 checks.</p>
        <p style="color:#475569;">This is your record of due diligence for your practice.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Log in and review your compliance history.</p>
        ${ctaButton(CTA.viewHistory)}
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    5: {
      subject: "Need unlimited checks or a bigger team? Here's your next step",
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Need unlimited checks or a bigger team?</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">You've been with SafePost for a week — great work.</p>
        <p style="color:#475569;">If your practice is growing and you need unlimited checks, up to 10 team members, bulk content review, and PDF audit log exports, our Ultra plan has you covered at $149/month.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 See if Ultra is right for your practice.</p>
        ${ctaButton(CTA.viewPlans)}
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
  },

  // ── ULTRA ───────────────────────────────────────────────────────────────
  ultra: {
    1: {
      subject: "Welcome to SafePost – you're all set",
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Welcome to SafePost!</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">Welcome to SafePost! We're really glad you're here.</p>
        <p style="color:#475569;">You've just unlocked everything you need to keep your practice's content compliant – unlimited compliance checks, audit logs, bulk content review, and a lot more.</p>
        <p style="color:#475569;">We know getting started with a new tool can feel like one more thing on your plate. So we've kept it simple.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Log in and run your very first compliance check. It takes less than 2 minutes and you'll immediately see SafePost in action.</p>
        ${ctaButton(CTA.login)}
        <p style="color:#475569;">Tomorrow we'll show you how to get your team set up.</p>
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    2: {
      subject: "Run your first compliance check – here's how",
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Run your first compliance check</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">Yesterday you got access. Today, let's make it real.</p>
        <p style="color:#475569;">Running a compliance check in SafePost is straightforward – paste or upload your content, and we'll flag anything that needs attention before it goes out.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Run a compliance check on a piece of content your practice has published recently – a social post, a client email, anything.</p>
        ${ctaButton(CTA.runCheck)}
        <p style="color:#475569;">Got questions? Just reply to this email – we're here to help.</p>
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    3: {
      subject: 'Bring your team in – it only takes a minute',
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Bring your team in</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">As an Ultra member, you can add up to 10 team members to SafePost – so everyone in your practice is working from the same compliance standards.</p>
        <p style="color:#475569;">This is one of the most valuable things you can do this week. When your whole team is running content through SafePost, nothing slips through the cracks.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Add at least one team member to your SafePost account. Go to Settings → Team Members → Invite. All they need is their email address.</p>
        ${ctaButton(CTA.addTeam)}
        <p style="color:#475569;">Tomorrow we'll walk you through your audit logs and bulk review.</p>
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    4: {
      subject: 'Two features worth knowing about',
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Two features worth knowing about</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">By now you've run a compliance check and hopefully added a few team members. Nice work.</p>
        <p style="color:#475569;">Today we want to show you two features that multi-practitioner practices tell us they love most:</p>
        <p style="color:#475569;">📋 <strong>Compliance Audit Log Export</strong> — Every check your team runs is logged and exportable as a PDF. This is your paper trail.</p>
        <p style="color:#475569;">📦 <strong>Bulk Content Review</strong> — Upload multiple posts or documents at once. If your team produces a lot of content, this is a serious time-saver.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Try uploading more than one piece of content using bulk review.</p>
        ${ctaButton(CTA.bulkReview)}
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
    5: {
      subject: "Let's connect – book your onboarding call",
      html: (n, u) => wrap(`
        <h2 style="color:#1e293b;">Let's connect</h2>
        <p style="color:#475569;">Hi ${n},</p>
        <p style="color:#475569;">You've made it through your first week with SafePost – and we hope it's already making compliance feel a little less daunting.</p>
        <p style="color:#475569;">As an Ultra member, you're entitled to a personal onboarding call with us. This is your chance to walk through any questions about your setup, make sure your team is using SafePost in the way that works best for your practice, and learn about anything you might not have explored yet.</p>
        <p style="color:#475569;">It's 15 minutes, relaxed, and completely focused on your practice.</p>
        <p style="color:#475569;"><strong>Your one action today:</strong></p>
        <p style="color:#475569;">👉 Book your onboarding call at a time that suits you.</p>
        ${ctaButton(CTA.bookCall)}
        <p style="color:#475569;">Looking forward to speaking with you.</p>
        <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
      `, u),
    },
  },
};

// ---------------------------------------------------------------------------
// Edge Function
// ---------------------------------------------------------------------------
serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Authenticate with service role key
  const authHeader = req.headers.get('authorization');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (
    !authHeader ||
    (authHeader !== `Bearer ${serviceRoleKey}` && authHeader !== serviceRoleKey)
  ) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { user_id, email_number, plan_tier } = await req.json();

    if (!user_id || !email_number || !plan_tier) {
      return new Response(
        JSON.stringify({ error: 'user_id, email_number, and plan_tier are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // ── Upgrade-cancellation check for Starter users ────────────────────
    // If the onboarding row was created for a Starter sequence but the user
    // has since upgraded to a paid plan, cancel all remaining unsent Starter
    // emails and skip sending.
    if (plan_tier === 'starter') {
      const { data: account } = await supabaseAdmin
        .from('accounts')
        .select('plan')
        .eq('owner_user_id', user_id)
        .single();

      if (account && account.plan !== 'starter') {
        // User has upgraded — cancel all remaining unsent Starter emails
        const now = new Date().toISOString();
        await supabaseAdmin
          .from('onboarding_emails')
          .update({ cancelled_at: now })
          .eq('user_id', user_id)
          .eq('plan_tier', 'starter')
          .is('sent_at', null)
          .is('cancelled_at', null);

        console.log(`Cancelled remaining Starter onboarding emails for user ${user_id} (upgraded to ${account.plan})`);
        return new Response(
          JSON.stringify({ success: true, skipped: true, reason: 'user_upgraded' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
    }

    // ── Check user email preferences ────────────────────────────────────
    // Onboarding emails are non-essential product emails; respect opt-out.
    const { data: prefs } = await supabaseAdmin
      .from('user_preferences')
      .select('email_product_updates')
      .eq('user_id', user_id)
      .maybeSingle();

    if (prefs && prefs.email_product_updates === false) {
      console.log(`User ${user_id} has opted out of product emails — skipping onboarding email ${email_number}`);

      // Mark as sent so it doesn't keep retrying
      await supabaseAdmin
        .from('onboarding_emails')
        .update({ sent_at: new Date().toISOString() })
        .eq('user_id', user_id)
        .eq('email_number', email_number)
        .eq('plan_tier', plan_tier);

      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: 'email_preferences_opt_out' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── Look up the template ────────────────────────────────────────────
    const tierTemplates = templates[plan_tier];
    if (!tierTemplates) {
      return new Response(
        JSON.stringify({ error: `Unknown plan_tier: ${plan_tier}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const template = tierTemplates[email_number];
    if (!template) {
      return new Response(
        JSON.stringify({ error: `No template for email_number ${email_number} on ${plan_tier}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── Fetch user details for personalisation ──────────────────────────
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(user_id);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Could not fetch user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const rawFirstName = user.user_metadata?.firstName || user.user_metadata?.first_name || 'there';
    const firstName = escapeHtml(rawFirstName);
    const toEmail = user.email;
    if (!toEmail) {
      return new Response(
        JSON.stringify({ error: 'User has no email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── Generate signed unsubscribe URL ────────────────────────────────
    const unsubscribeUrl = await buildUnsubscribeUrl(user_id);

    // ── Send email via Resend ───────────────────────────────────────────
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SafePost <support@safepost.com.au>',
        to: toEmail,
        subject: template.subject,
        html: template.html(firstName, unsubscribeUrl),
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error('Resend error:', errBody);
      return new Response(
        JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── Mark as sent ────────────────────────────────────────────────────
    const { error: updateError } = await supabaseAdmin
      .from('onboarding_emails')
      .update({ sent_at: new Date().toISOString() })
      .eq('user_id', user_id)
      .eq('email_number', email_number)
      .eq('plan_tier', plan_tier);

    if (updateError) {
      console.error('Failed to update sent_at:', updateError);
    }

    console.log(`Sent onboarding email ${email_number} (${plan_tier}) to user ${user_id}`);
    return new Response(
      JSON.stringify({ success: true, email_number, plan_tier }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Send onboarding email error:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
