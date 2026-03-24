import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
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

  // Authenticate: accept either the service role key (from Stripe webhook / internal calls)
  // or a valid user JWT (from frontend, e.g. AccountContext for Starter users).
  const authHeader = req.headers.get('authorization');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const isServiceRole =
    authHeader === `Bearer ${serviceRoleKey}` || authHeader === serviceRoleKey;

  let jwtUserId: string | null = null;

  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!isServiceRole) {
    // Attempt to verify as a user JWT
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    jwtUserId = user.id;
  }

  try {
    const { user_id, plan_tier } = await req.json();

    if (!user_id || !plan_tier) {
      return new Response(
        JSON.stringify({ error: 'user_id and plan_tier are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // When called with a user JWT (not service role), enforce that the user
    // can only initialise their own onboarding sequence.
    if (jwtUserId && jwtUserId !== user_id) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: user_id does not match authenticated user' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
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
        JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
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
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
