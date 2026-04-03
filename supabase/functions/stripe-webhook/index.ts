import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno&deno-std=0.177.0&no-check=true';
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
  'price_1TAHuHJAm9wjk5YfCqAF30bc': 'starter',
  'price_1TAI1AJAm9wjk5Yf5b68eoVw': 'starter',
  'price_1T8VA7JAm9wjk5YfkbJ56VTX': 'professional',
  'price_1T8VA3JAm9wjk5YfSRSEyVoW': 'professional',
  'price_1T8VA4JAm9wjk5YfEAzY5e4q': 'pro_plus',
  'price_1T8VA3JAm9wjk5YfsvpQvllA': 'pro_plus',
  'price_1T8VA6JAm9wjk5YfK73bIGbJ': 'ultra',
  'price_1T8VA7JAm9wjk5YfN6Ql6KfM': 'ultra',
};

const priceIdToBilling: Record<string, string> = {
  'price_1TAHuHJAm9wjk5YfCqAF30bc': 'monthly',
  'price_1TAI1AJAm9wjk5Yf5b68eoVw': 'yearly',
  'price_1T8VA7JAm9wjk5YfkbJ56VTX': 'monthly',
  'price_1T8VA3JAm9wjk5YfSRSEyVoW': 'yearly',
  'price_1T8VA4JAm9wjk5YfEAzY5e4q': 'monthly',
  'price_1T8VA3JAm9wjk5YfsvpQvllA': 'yearly',
  'price_1T8VA6JAm9wjk5YfK73bIGbJ': 'monthly',
  'price_1T8VA7JAm9wjk5YfN6Ql6KfM': 'yearly',
};

function getPlanName(amountTotal: number): string {
  const amount = amountTotal / 100;
  if (amount <= 20) return 'SafePost Starter';
  if (amount <= 49) return 'SafePost Professional';
  if (amount <= 99) return 'SafePost Pro+';
  return 'SafePost Ultra';
}

serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    // Use constructEventAsync instead of constructEvent — the sync version
    // requires Node.js crypto which is not available in Deno
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook error:', err.message);
    return new Response('Webhook error', { status: 400 });
  }

  // ── Idempotency check: skip already-processed events ──────────────────
  const { data: existing } = await supabase
    .from('processed_webhook_events')
    .select('event_id')
    .eq('event_id', event.id)
    .maybeSingle();

  if (existing) {
    console.log(`Skipping already-processed event ${event.id}`);
    return new Response(JSON.stringify({ received: true, duplicate: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId || session.client_reference_id;

    if (!userId) {
      console.error('No userId found in session metadata or client_reference_id');
      return new Response(JSON.stringify({ error: 'Invalid session data' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;

    if (!priceId) {
      console.error('No priceId found in line items');
      return new Response(JSON.stringify({ error: 'Invalid line items' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const plan = priceIdToPlan[priceId] || 'starter';
    const billing = priceIdToBilling[priceId] || 'monthly';

    // Find the most recently created account for this user to handle duplicates
    const { data: accountToUpdate, error: lookupErr } = await supabase
      .from('accounts')
      .select('id')
      .eq('owner_user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lookupErr || !accountToUpdate) {
      console.error('No account found for user:', userId, lookupErr);
      return new Response(JSON.stringify({ error: 'Account not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const { error } = await supabase
      .from('accounts')
      .update({
        plan,
        billing_period: billing,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
      })
      .eq('id', accountToUpdate.id);

    if (error) {
      console.error('Error updating account:', error);
      return new Response(JSON.stringify({ error: 'Processing failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Also update user metadata
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { plan, billing },
    });

    console.log(`User ${userId} upgraded to ${plan} (${billing})`);

    // Initialise onboarding email sequence for the new subscriber
    try {
      const onboardingRes = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/initialise-onboarding-sequence`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId, plan_tier: plan }),
        },
      );
      if (!onboardingRes.ok) {
        console.error('Failed to initialise onboarding sequence:', await onboardingRes.text());
      }
    } catch (e) {
      console.error('Error calling initialise-onboarding-sequence:', e);
    }

    // Send payment confirmation email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey && session.customer_email) {
      const planName = session.amount_total
        ? getPlanName(session.amount_total)
        : 'SafePost';

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SafePost <noreply@safepost.com.au>',
          to: session.customer_email,
          subject: 'Your SafePost subscription is confirmed',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <img src="https://www.safepost.com.au/logo.png" alt="SafePost" style="height: 40px; margin-bottom: 24px;" />
              <h2>You're subscribed!</h2>
              <p>Hi there,</p>
              <p>Your <strong>${planName}</strong> subscription is now active. You have full access to SafePost.</p>
              <a href="https://www.safepost.com.au/dashboard" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0;">Go to your dashboard →</a>
              <p>If you have any questions, just reply to this email.</p>
              <p>Warmly,<br/>The SafePost Team</p>
            </div>
          `,
        }),
      });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // Find user by stripe_customer_id
    const { data: accounts, error: lookupError } = await supabase
      .from('accounts')
      .select('owner_user_id, billing_email')
      .eq('stripe_customer_id', customerId)
      .limit(1);

    if (lookupError || !accounts?.length) {
      console.error('Could not find user for customer:', customerId);
      return new Response(JSON.stringify({ error: 'Processing failed' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const userId = accounts[0].owner_user_id;
    const billingEmail = accounts[0].billing_email;

    const { error } = await supabase
      .from('accounts')
      .update({
        plan: 'starter',
        billing_period: null,
        stripe_subscription_id: null,
      })
      .eq('owner_user_id', userId);

    if (error) {
      console.error('Error downgrading account:', error);
      return new Response(JSON.stringify({ error: 'Processing failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { plan: 'starter', billing: '' },
    });

    console.log(`User ${userId} downgraded to starter`);

    // Send cancellation confirmation email
    if (billingEmail) {
      let firstName = 'there';
      try {
        const { data: { user } } = await supabase.auth.admin.getUserById(userId);
        if (user) {
          firstName = user.user_metadata?.firstName || user.user_metadata?.first_name || 'there';
        }
      } catch (e) {
        console.error('Could not fetch user for cancellation email:', e);
      }

      try {
        const cancellationRes = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-cancellation-email`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              billing_email: billingEmail,
              first_name: firstName,
              access_end_date: subscription.current_period_end,
            }),
          },
        );

        if (!cancellationRes.ok) {
          console.error('Failed to send cancellation email:', await cancellationRes.text());
        }
      } catch (e) {
        console.error('Error calling send-cancellation-email:', e);
      }
    }
  }

  // ── Record this event as processed ──────────────────────────────────
  await supabase
    .from('processed_webhook_events')
    .insert({ event_id: event.id, processed_at: new Date().toISOString() });

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
