import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.safepost.com.au',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Authenticate with service role key
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
    const { user_id, plan_tier } = await req.json();

    if (!user_id || !plan_tier) {
      return new Response(
        JSON.stringify({ error: 'user_id and plan_tier are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Schedule offsets in days for each email
    const scheduleOffsets = [0, 2, 3, 5, 7];

    const now = new Date();
    const rows = scheduleOffsets.map((offsetDays, index) => {
      const scheduledFor = new Date(now.getTime() + offsetDays * 24 * 60 * 60 * 1000);
      return {
        user_id,
        plan_tier,
        email_number: index + 1,
        scheduled_for: scheduledFor.toISOString(),
      };
    });

    // Use upsert with ignoreDuplicates to achieve INSERT ... ON CONFLICT DO NOTHING
    const { error } = await supabaseAdmin
      .from('onboarding_emails')
      .upsert(rows, { onConflict: 'user_id,email_number', ignoreDuplicates: true });

    if (error) {
      console.error('Failed to insert onboarding emails:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to insert onboarding emails', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    console.log(`Initialised onboarding sequence for user ${user_id} (${plan_tier})`);
    return new Response(
      JSON.stringify({ success: true, emails_scheduled: 5 }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Onboarding sequence error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
