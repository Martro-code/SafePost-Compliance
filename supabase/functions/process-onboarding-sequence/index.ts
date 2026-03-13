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

    // ── Fetch all due, unsent, uncancelled onboarding emails ──────────
    const now = new Date().toISOString();
    const { data: dueEmails, error: fetchError } = await supabaseAdmin
      .from('onboarding_emails')
      .select('id, user_id, email_number, plan_tier')
      .lte('scheduled_for', now)
      .is('sent_at', null)
      .is('cancelled_at', null);

    if (fetchError) {
      console.error('Failed to fetch due onboarding emails:', fetchError);
      return new Response(
        JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!dueEmails || dueEmails.length === 0) {
      console.log('No onboarding emails due to send');
      return new Response(
        JSON.stringify({ success: true, processed: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    console.log(`Found ${dueEmails.length} onboarding email(s) due to send`);

    let sent = 0;
    let skipped = 0;
    let upgraded = 0;

    // Track users we've already handled upgrades for to avoid duplicate work
    const upgradedUsers = new Set<string>();

    for (const row of dueEmails) {
      // ── Starter upgrade check ───────────────────────────────────────
      if (row.plan_tier === 'starter' && !upgradedUsers.has(row.user_id)) {
        const { data: account } = await supabaseAdmin
          .from('accounts')
          .select('plan')
          .eq('owner_user_id', row.user_id)
          .single();

        if (account && account.plan !== 'starter') {
          // User has upgraded — cancel all remaining unsent Starter emails
          upgradedUsers.add(row.user_id);

          await supabaseAdmin
            .from('onboarding_emails')
            .update({ cancelled_at: now })
            .eq('user_id', row.user_id)
            .eq('plan_tier', 'starter')
            .is('sent_at', null)
            .is('cancelled_at', null);

          // Insert new sequence for current paid plan starting from Email 2
          // (Email 1 was already sent when they first signed up or upgraded)
          const scheduleOffsets = [0, 1, 3, 5]; // days from now for emails 2–5
          const newRows = scheduleOffsets.map((offsetDays, index) => {
            const scheduledFor = new Date(
              Date.now() + offsetDays * 24 * 60 * 60 * 1000,
            );
            return {
              user_id: row.user_id,
              plan_tier: account.plan,
              email_number: index + 2,
              scheduled_for: scheduledFor.toISOString(),
              sent_at: null,
              cancelled_at: null,
            };
          });

          const { error: upsertError } = await supabaseAdmin
            .from('onboarding_emails')
            .upsert(newRows, { onConflict: 'user_id,email_number' });

          if (upsertError) {
            console.error(
              `Failed to insert new sequence for user ${row.user_id}:`,
              upsertError,
            );
          } else {
            console.log(
              `Cancelled Starter emails and inserted ${account.plan} sequence (emails 2–5) for user ${row.user_id}`,
            );
          }

          upgraded++;
          continue;
        }
      }

      // Skip if this user was already handled as an upgrade in this run
      if (row.plan_tier === 'starter' && upgradedUsers.has(row.user_id)) {
        skipped++;
        continue;
      }

      // ── Check user email preferences before sending ────────────────
      const { data: userPrefs } = await supabaseAdmin
        .from('user_preferences')
        .select('email_product_updates')
        .eq('user_id', row.user_id)
        .maybeSingle();

      if (userPrefs && userPrefs.email_product_updates === false) {
        // User has opted out — mark as sent so we don't retry
        await supabaseAdmin
          .from('onboarding_emails')
          .update({ sent_at: now })
          .eq('id', row.id);

        console.log(`Skipped onboarding email ${row.email_number} for user ${row.user_id} (email_product_updates = false)`);
        skipped++;
        continue;
      }

      // ── Send the onboarding email ───────────────────────────────────
      try {
        const res = await fetch(
          `${supabaseUrl}/functions/v1/send-onboarding-email`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: row.user_id,
              email_number: row.email_number,
              plan_tier: row.plan_tier,
            }),
          },
        );

        if (res.ok) {
          sent++;
          console.log(
            `Sent onboarding email ${row.email_number} (${row.plan_tier}) to user ${row.user_id}`,
          );
        } else {
          const errBody = await res.text();
          console.error(
            `Failed to send email ${row.email_number} for user ${row.user_id}:`,
            errBody,
          );
          skipped++;
        }
      } catch (err) {
        console.error(
          `Error sending email ${row.email_number} for user ${row.user_id}:`,
          err,
        );
        skipped++;
      }
    }

    console.log(
      `Processing complete: ${sent} sent, ${skipped} skipped, ${upgraded} upgraded`,
    );
    return new Response(
      JSON.stringify({ success: true, sent, skipped, upgraded }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Process onboarding sequence error:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
