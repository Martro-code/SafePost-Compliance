import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const BASE_URL = 'https://www.safepost.com.au';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const PLAN_DISPLAY: Record<string, string> = {
  professional: 'Professional',
  pro_plus: 'Pro+',
  ultra: 'Ultra',
};

function wrap(inner: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <img src="${BASE_URL}/assets/safepost-logo.png" alt="SafePost" width="200" style="width:200px; max-width:200px; height:auto; display:block; margin-bottom:24px;" />
      ${inner}
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
      <p style="color:#94a3b8;font-size:12px;">SafePost Pty Ltd | <a href="${BASE_URL}" style="color:#94a3b8;">safepost.com.au</a></p>
    </div>`;
}

function ctaButton(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0;font-weight:600;">${text}</a>`;
}

serve(async (req) => {
  // Authenticate with service role key
  const authHeader = req.headers.get('authorization');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (
    !authHeader ||
    (authHeader !== `Bearer ${serviceRoleKey}` && authHeader !== serviceRoleKey)
  ) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { owner_user_id } = await req.json();

    if (!owner_user_id) {
      return new Response(
        JSON.stringify({ error: 'owner_user_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // ── Fetch account details ───────────────────────────────────────────
    const { data: account, error: accountError } = await supabaseAdmin
      .from('accounts')
      .select('plan, billing_email, reset_at')
      .eq('owner_user_id', owner_user_id)
      .single();

    if (accountError || !account) {
      console.error('Account lookup error:', accountError);
      return new Response(
        JSON.stringify({ error: 'Account not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const { plan, billing_email, reset_at } = account;

    if (!billing_email) {
      console.error(`No billing email for account owner ${owner_user_id}`);
      return new Response(
        JSON.stringify({ error: 'No billing email on account' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const planDisplay = PLAN_DISPLAY[plan] ?? plan;
    const renewalDate = formatDate(reset_at);

    // ── Fetch user first name for personalisation ───────────────────────
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(owner_user_id);
    const rawFirstName = (!userError && user)
      ? (user.user_metadata?.firstName || user.user_metadata?.first_name || 'there')
      : 'there';
    const firstName = escapeHtml(rawFirstName);

    // ── Send email via Resend ───────────────────────────────────────────
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const subject = 'Your SafePost annual plan renews in 30 days';
    const html = wrap(`
      <h2 style="color:#1e293b;">Your annual plan renews in 30 days</h2>
      <p style="color:#475569;">Hi ${firstName},</p>
      <p style="color:#475569;">Just a heads-up — your SafePost <strong>${planDisplay}</strong> annual plan is set to renew on <strong>${renewalDate}</strong>.</p>
      <p style="color:#475569;">No action is needed. Your plan will renew automatically and you'll continue to have uninterrupted access to SafePost.</p>
      <p style="color:#475569;">If you'd like to review your billing details or make any changes before the renewal date, you can do that from your account settings.</p>
      ${ctaButton('Manage billing settings →', `${BASE_URL}/settings`)}
      <p style="color:#475569;">Got questions? Just reply to this email — we're here to help.</p>
      <p style="color:#475569;">Warmly,<br/>The SafePost Team</p>
    `);

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SafePost <support@safepost.com.au>',
        to: billing_email,
        subject,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error('Resend error:', errBody);
      return new Response(
        JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const maskedEmail = billing_email.slice(0, 3) + '***@***';
    console.log(`Sent renewal notice to ${maskedEmail} for account ${owner_user_id.slice(0, 8)}... (${planDisplay}, renews ${renewalDate})`);
    return new Response(
      JSON.stringify({ success: true, owner_user_id, plan: planDisplay, renewal_date: renewalDate }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Send renewal notice error:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
