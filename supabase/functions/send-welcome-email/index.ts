import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.safepost.com.au',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only allow requests authenticated with the service role key.
  // This covers both internal Edge Function calls and Supabase database webhooks.
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
    const payload = await req.json();

    // Extract user data from the database webhook payload
    const record = payload.record;
    if (!record) {
      return new Response(JSON.stringify({ error: 'No record in payload' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    if (!record.owner_user_id) {
      return new Response(JSON.stringify({ error: 'No owner_user_id in record' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(record.owner_user_id);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Could not fetch user' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const email = user.email;
    const rawFirstName = user.user_metadata?.firstName || user.user_metadata?.first_name || 'there';
    const firstName = escapeHtml(rawFirstName);

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SafePost <support@safepost.com.au>',
        to: email,
        subject: 'Welcome to SafePost — you\'re in',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <img src="https://www.safepost.com.au/assets/safepost-logo.png" alt="SafePost" style="height: 40px; margin-bottom: 24px;" />
            <h2 style="color: #1e293b;">Welcome to SafePost!</h2>
            <p style="color: #475569;">Hi ${firstName},</p>
            <p style="color: #475569;">Welcome to SafePost! You've just taken the first step toward keeping your practice's online presence AHPRA and TGA compliant.</p>
            <p style="color: #475569;">Your account is ready. Here's what you can do right now:</p>
            <p style="color: #475569;">👉 <strong>Run your first compliance check</strong> — paste any social post, ad, or website content and see SafePost in action.</p>
            <a href="https://www.safepost.com.au/dashboard" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0;font-weight:600;">Run a compliance check →</a>
            <p style="color: #475569;">Got questions? Just reply to this email — we're here to help.</p>
            <p style="color: #475569;">Warmly,<br/>The SafePost Team</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
            <p style="color: #94a3b8;font-size:12px;">SafePost Pty Ltd | <a href="https://www.safepost.com.au" style="color:#94a3b8;">safepost.com.au</a></p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Welcome email error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
