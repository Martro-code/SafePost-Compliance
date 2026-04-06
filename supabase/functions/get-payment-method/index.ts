import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno&deno-std=0.224.0&no-check=true';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const authHeader = req.headers.get('authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the user via their JWT
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Look up the user's account to get stripe_customer_id
    const { data: membership } = await supabase
      .from('account_members')
      .select('account_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1)
      .single();

    if (!membership) {
      return new Response(JSON.stringify({ error: 'No account found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: account } = await supabase
      .from('accounts')
      .select('stripe_customer_id')
      .eq('id', membership.account_id)
      .single();

    if (!account?.stripe_customer_id) {
      return new Response(JSON.stringify({ card: null }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      return new Response(JSON.stringify({ error: 'Stripe is not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Get the customer's default payment method
    const customer = await stripe.customers.retrieve(account.stripe_customer_id) as Stripe.Customer;

    let paymentMethodId: string | null = null;

    if (customer.invoice_settings?.default_payment_method) {
      paymentMethodId = typeof customer.invoice_settings.default_payment_method === 'string'
        ? customer.invoice_settings.default_payment_method
        : customer.invoice_settings.default_payment_method.id;
    }

    // Fallback: list payment methods and use the first one
    if (!paymentMethodId) {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: account.stripe_customer_id,
        type: 'card',
        limit: 1,
      });
      if (paymentMethods.data.length > 0) {
        paymentMethodId = paymentMethods.data[0].id;
      }
    }

    // Fetch active subscription for next payment details
    let subscription = null;
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: account.stripe_customer_id,
        status: 'active',
        limit: 1,
      });
      if (subscriptions.data.length > 0) {
        const sub = subscriptions.data[0];
        const nextDate = new Date(sub.current_period_end * 1000);
        const formatted = nextDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
        const amount = sub.items.data[0]?.price?.unit_amount
          ? sub.items.data[0].price.unit_amount / 100
          : 0;
        subscription = {
          next_payment_date: formatted,
          amount,
          interval: sub.items.data[0]?.price?.recurring?.interval ?? 'month',
        };
      }
    } catch (subErr) {
      console.error('Failed to fetch subscription:', subErr);
    }

    if (!paymentMethodId) {
      return new Response(JSON.stringify({ card: null, subscription }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const pm = await stripe.paymentMethods.retrieve(paymentMethodId);

    return new Response(JSON.stringify({
      card: {
        brand: pm.card?.brand ?? 'card',
        last4: pm.card?.last4 ?? '****',
        exp_month: pm.card?.exp_month,
        exp_year: pm.card?.exp_year,
      },
      subscription,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('get-payment-method error:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
