import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';

    // ── Compute the target renewal date window (today + 30 days, UTC) ──
    const targetDate = new Date();
    targetDate.setUTCDate(targetDate.getUTCDate() + 30);
    const targetDateStr = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const windowStart = `${targetDateStr}T00:00:00.000Z`;
    const windowEnd = `${targetDateStr}T23:59:59.999Z`;

    // ── Fetch annual accounts renewing in exactly 30 days ──────────────
    const { data: accounts, error: fetchError } = await supabaseAdmin
      .from('accounts')
      .select('owner_user_id, plan')
      .eq('billing_period', 'yearly')
      .not('plan', 'eq', 'starter')
      .gte('reset_at', windowStart)
      .lte('reset_at', windowEnd);

    if (fetchError) {
      console.error('Failed to fetch accounts due for renewal notice:', fetchError);
      return new Response(
        JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!accounts || accounts.length === 0) {
      console.log(`No annual accounts due for 30-day renewal notice on ${targetDateStr}`);
      return new Response(
        JSON.stringify({ success: true, processed: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    console.log(`Found ${accounts.length} annual account(s) due for 30-day renewal notice on ${targetDateStr}`);

    let sent = 0;
    let failed = 0;

    for (const account of accounts) {
      try {
        const res = await fetch(
          `${supabaseUrl}/functions/v1/send-renewal-notice`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ owner_user_id: account.owner_user_id }),
          },
        );

        if (res.ok) {
          sent++;
          console.log(`Sent renewal notice for account owner ${account.owner_user_id} (${account.plan})`);
        } else {
          const errBody = await res.text();
          console.error(`Failed to send renewal notice for ${account.owner_user_id}:`, errBody);
          failed++;
        }
      } catch (err) {
        console.error(`Error sending renewal notice for ${account.owner_user_id}:`, err);
        failed++;
      }
    }

    console.log(`Renewal notices complete: ${sent} sent, ${failed} failed`);
    return new Response(
      JSON.stringify({ success: true, sent, failed }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Process renewal notices error:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
