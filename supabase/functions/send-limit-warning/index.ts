import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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

const BASE_URL = 'https://www.safepost.com.au';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only allow requests authenticated with the webhook secret.
  const authHeader = req.headers.get('authorization');
  const webhookSecret = Deno.env.get('WEBHOOK_AUTH_SECRET') ?? '';
  if (!authHeader || authHeader !== `Bearer ${webhookSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { user_id, checks_used, checks_limit } = await req.json();

    if (!user_id || checks_used == null || checks_limit == null) {
      return new Response(JSON.stringify({ error: 'Missing required fields: user_id, checks_used, checks_limit' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // 1. Retrieve reset_at and billing_email from the accounts table
    const { data: account, error: accountError } = await supabaseAdmin
      .from('accounts')
      .select('reset_at, billing_email')
      .eq('owner_user_id', user_id)
      .single();

    if (accountError || !account) {
      console.error('Account lookup error:', accountError);
      return new Response(JSON.stringify({ error: 'Account not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { reset_at, billing_email } = account;

    // 2. Check for existing limit_warning notification in this billing period
    const { data: existingNotification, error: notifCheckError } = await supabaseAdmin
      .from('notifications')
      .select('id')
      .eq('user_id', user_id)
      .eq('type', 'limit_warning')
      .gt('created_at', reset_at)
      .limit(1);

    if (notifCheckError) {
      console.error('Notification check error:', notifCheckError);
      return new Response(JSON.stringify({ error: 'Failed to check existing notifications' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (existingNotification && existingNotification.length > 0) {
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Insert a new limit_warning notification
    const { error: insertError } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id,
        type: 'limit_warning',
        title: 'Approaching your monthly check limit',
        message: `You've used ${checks_used} of your ${checks_limit} monthly checks this month. Upgrade your plan to keep checking without interruption.`,
        read: false,
      });

    if (insertError) {
      console.error('Notification insert error:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to create notification' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Send a branded email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const checksRemaining = checks_limit - checks_used;

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SafePost <support@safepost.com.au>',
        to: billing_email,
        subject: "You're approaching your SafePost check limit",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <img src="${BASE_URL}/assets/safepost-logo.png" alt="SafePost" width="200" style="width:200px; max-width:200px; height:auto; display:block; margin-bottom:24px;" />
            <h2 style="color: #1e293b;">You're approaching your check limit</h2>
            <p style="color: #475569;">Hi there,</p>
            <p style="color: #475569;">Just a heads-up — you've used <strong>${checks_used}</strong> of your <strong>${checks_limit}</strong> monthly compliance checks this billing period.</p>
            <p style="color: #475569;">You have <strong>${checksRemaining}</strong> check${checksRemaining === 1 ? '' : 's'} remaining. Once you've reached your limit, you won't be able to run new checks until your next billing cycle.</p>
            <p style="color: #475569;">To keep checking without interruption, consider upgrading your plan.</p>
            <a href="${BASE_URL}/change-plan?mode=upgrade" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0;font-weight:600;">Upgrade your plan →</a>
            <p style="color: #475569;">Got questions? Just reply to this email — we're here to help.</p>
            <p style="color: #475569;">Warmly,<br/>The SafePost Team</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
            <p style="color: #94a3b8; font-size: 12px;">SafePost Pty Ltd | <a href="${BASE_URL}" style="color:#94a3b8;">safepost.com.au</a></p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Limit warning error:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
