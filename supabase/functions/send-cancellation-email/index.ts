import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { billing_email, first_name, access_end_date } = await req.json();

    if (!billing_email) {
      return new Response(JSON.stringify({ error: 'billing_email is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const name = first_name || 'there';
    const expiryDate = access_end_date
      ? new Date(access_end_date * 1000).toLocaleDateString('en-AU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'the end of your current billing period';

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SafePost <noreply@safepost.com.au>',
        to: billing_email,
        subject: 'Your SafePost subscription has been cancelled',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <img src="https://www.safepost.com.au/assets/safepost-logo.png" alt="SafePost" style="height: 40px; margin-bottom: 24px;" />
            <h2 style="color: #1e293b;">Subscription cancelled</h2>
            <p style="color: #475569;">Hi ${name},</p>
            <p style="color: #475569;">We're confirming that your SafePost subscription has been cancelled.</p>
            <p style="color: #475569;">You'll continue to have access to your current plan until <strong>${expiryDate}</strong>. After that date your account will revert to the free Starter plan.</p>
            <p style="color: #475569;">If this was a mistake, or you'd like to resubscribe at any time, you can pick up right where you left off:</p>
            <a href="https://www.safepost.com.au/pricing/medical-practitioners" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0;font-weight:600;">Resubscribe →</a>
            <p style="color: #475569;">If you have any questions or feedback, just reply to this email — we'd love to hear from you.</p>
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
      return new Response(JSON.stringify({ error: 'Failed to send cancellation email' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Cancellation email error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
