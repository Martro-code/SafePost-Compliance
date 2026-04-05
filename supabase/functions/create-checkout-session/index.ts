import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno&deno-std=0.224.0&no-check=true';
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

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      console.error('Auth error:', userError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // --- Rate limiting: 10 requests per 60 seconds per user ---
    const windowStart = new Date(Date.now() - 60 * 1000).toISOString();
    const { count: recentCount, error: rateLimitError } = await supabaseAdmin
      .from('rate_limit_events')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('function_name', 'create-checkout-session')
      .gte('created_at', windowStart);

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    }

    if ((recentCount ?? 0) >= 10) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment before trying again.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { error: insertRateLimitError } = await supabaseAdmin
      .from('rate_limit_events')
      .insert({ user_id: user.id, function_name: 'create-checkout-session' });

    if (insertRateLimitError) {
      console.error('Rate limit insert error:', insertRateLimitError);
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return new Response(JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const allowedPriceIds = (Deno.env.get('ALLOWED_STRIPE_PRICE_IDS') ?? '')
      .split(',')
      .map((id: string) => id.trim())
      .filter(Boolean);

    if (allowedPriceIds.length === 0) {
      console.error('ALLOWED_STRIPE_PRICE_IDS environment variable is not set or empty');
      return new Response(JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { priceId, productType } = await req.json();

    // ── Audit one-time payment ─────────────────────────────────────────────
    if (productType === 'audit') {
      const auditPriceId = Deno.env.get('AUDIT_PRICE_ID');
      if (!auditPriceId) {
        console.error('AUDIT_PRICE_ID is not configured');
        return new Response(JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Look up account to get account_id (for webhook) and stripe_customer_id
      const { data: account, error: accountError } = await supabaseAdmin
        .from('accounts')
        .select('id, stripe_customer_id')
        .eq('owner_user_id', user.id)
        .single();

      if (accountError || !account) {
        console.error('Account not found for audit checkout:', accountError);
        return new Response(JSON.stringify({ error: 'Account not found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const siteUrl = Deno.env.get('SITE_URL') ?? 'https://www.safepost.com.au';
      const auditSession = await stripe.checkout.sessions.create({
        ...(account.stripe_customer_id && { customer: account.stripe_customer_id }),
        payment_method_types: ['card'],
        line_items: [{ price: auditPriceId, quantity: 1 }],
        mode: 'payment',
        success_url: `${siteUrl}/audit?purchase=success`,
        cancel_url: `${siteUrl}/audit?purchase=cancelled`,
        metadata: {
          account_id: account.id,
          product_type: 'audit',
        },
      });

      return new Response(JSON.stringify({ url: auditSession.url }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ── Subscription checkout (existing logic unchanged) ───────────────────
    if (!priceId) {
      return new Response(JSON.stringify({ error: 'priceId is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!allowedPriceIds.includes(priceId)) {
      return new Response(JSON.stringify({ error: 'Invalid price ID' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://www.safepost.com.au/billing?success=true',
      cancel_url: 'https://www.safepost.com.au/billing?cancelled=true',
      metadata: { userId: user.id },
      client_reference_id: user.id,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
