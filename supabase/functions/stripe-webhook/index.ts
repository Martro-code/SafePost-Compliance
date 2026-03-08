import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const priceIdToPlan: Record<string, string> = {
  'price_1T8UTeR1RAuGYaVLg6CI48VN': 'professional',
  'price_1T8UUPR1RAuGYaVL8SdWS9ut': 'professional',
  'price_1T8UWKR1RAuGYaVL2RUXVEAr': 'pro_plus',
  'price_1T8UXuR1RAuGYaVLPGTPgSqA': 'pro_plus',
  'price_1T8UZUR1RAuGYaVLkkbcBvJL': 'ultra',
  'price_1T8UaCR1RAuGYaVL3M5ob7TV': 'ultra',
};

const priceIdToBilling: Record<string, string> = {
  'price_1T8UTeR1RAuGYaVLg6CI48VN': 'monthly',
  'price_1T8UUPR1RAuGYaVL8SdWS9ut': 'yearly',
  'price_1T8UWKR1RAuGYaVL2RUXVEAr': 'monthly',
  'price_1T8UXuR1RAuGYaVLPGTPgSqA': 'yearly',
  'price_1T8UZUR1RAuGYaVLkkbcBvJL': 'monthly',
  'price_1T8UaCR1RAuGYaVL3M5ob7TV': 'yearly',
};

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId || session.client_reference_id;

    if (!userId) {
      console.error('No userId found in session metadata or client_reference_id');
      return new Response('No userId found', { status: 400 });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;

    if (!priceId) {
      console.error('No priceId found in line items');
      return new Response('No priceId found', { status: 400 });
    }

    const plan = priceIdToPlan[priceId] || 'starter';
    const billing = priceIdToBilling[priceId] || 'monthly';

    const { error } = await supabase
      .from('accounts')
      .update({
        plan,
        billing_period: billing,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating account:', error);
      return new Response('Database update failed', { status: 500 });
    }

    // Also update user metadata
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { plan, billing },
    });

    console.log(`User ${userId} upgraded to ${plan} (${billing})`);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // Find user by stripe_customer_id
    const { data: accounts, error: lookupError } = await supabase
      .from('accounts')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .limit(1);

    if (lookupError || !accounts?.length) {
      console.error('Could not find user for customer:', customerId);
      return new Response('User not found', { status: 404 });
    }

    const userId = accounts[0].user_id;

    const { error } = await supabase
      .from('accounts')
      .update({
        plan: 'starter',
        billing_period: null,
        stripe_subscription_id: null,
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error downgrading account:', error);
      return new Response('Database update failed', { status: 500 });
    }

    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { plan: 'starter', billing: '' },
    });

    console.log(`User ${userId} downgraded to starter`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
