import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.11.0?target=deno&no-check=true';
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
      .eq('owner_user_id', userId);

    if (error) {
      console.error('Error updating account:', error);
      return new Response('Database update failed', { status: 500 });
    }

    // Also update user metadata
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { plan, billing },
    });

    console.log(`User ${userId} upgraded to ${plan} (${billing})`);

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
          from: 'SafePost <support@safepost.com.au>',
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
      return new Response('User not found', { status: 404 });
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
      return new Response('Database update failed', { status: 500 });
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

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
