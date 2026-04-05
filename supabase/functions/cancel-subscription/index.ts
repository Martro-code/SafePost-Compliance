import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno&deno-std=0.224.0&no-check=true';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Authenticate the caller via Supabase JWT
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing authorization' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Look up the account's Stripe subscription ID
  const { data: account, error: lookupError } = await supabase
    .from('accounts')
    .select('stripe_subscription_id')
    .eq('owner_user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (lookupError || !account?.stripe_subscription_id) {
    console.error('No subscription found for user:', user.id, lookupError);
    return new Response(JSON.stringify({ error: 'No active subscription found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Cancel at period end — the subscription stays active until the billing
  // period expires. When it does, Stripe fires customer.subscription.deleted
  // and the stripe-webhook function downgrades the user to the Starter plan.
  const subscription = await stripe.subscriptions.update(
    account.stripe_subscription_id,
    { cancel_at_period_end: true }
  );

  console.log(
    `Subscription ${subscription.id} for user ${user.id} set to cancel at period end (${new Date(subscription.current_period_end * 1000).toISOString()})`
  );

  return new Response(
    JSON.stringify({
      success: true,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_end: subscription.current_period_end,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
});
