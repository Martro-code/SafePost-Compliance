// Sign-up Edge Function — server-side validation wrapper for Supabase Auth signup.
// Validates all required fields before creating the account, then delegates to
// supabase.auth.signUp (via the anon key) so Supabase's native email verification
// flow is preserved.
//
// Using HTTP 200 for all responses (including validation errors) so that
// supabase-js can read the response body directly. Non-2xx statuses cause
// supabase-js to set data = null, silencing the error message.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = await req.json();
    const {
      email,
      password,
      firstName,
      surname,
      mobileNumber,
      practiceName,
      streetAddress,
      suburb,
      state,
      postcode,
      specialty,
      abn,
      abnEntityName,
      plan,
      billing,
      emailRedirectTo,
    } = body;

    // 1. Check all required fields are present and non-empty
    const requiredFields: Record<string, string> = {
      email: (email ?? '').toString().trim(),
      password: (password ?? '').toString(),
      firstName: (firstName ?? '').toString().trim(),
      surname: (surname ?? '').toString().trim(),
      specialty: (specialty ?? '').toString().trim(),
    };

    for (const [, value] of Object.entries(requiredFields)) {
      if (!value) {
        return jsonResponse({ success: false, error: 'All fields are required.' });
      }
    }

    // 2. Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ success: false, error: 'Please enter a valid email address.' });
    }

    // 3. Validate password: alphanumeric only, minimum 8 characters
    if (!/^[a-zA-Z0-9]{8,}$/.test(password)) {
      return jsonResponse({
        success: false,
        error: 'Password must contain only letters and numbers and be at least 8 characters.',
      });
    }

    // 4. Create account — use the anon key so Supabase sends the verification email
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: emailRedirectTo ?? '',
        data: {
          first_name: firstName,
          surname,
          mobile_number: mobileNumber ?? '',
          practice_name: practiceName ?? '',
          street_address: streetAddress ?? '',
          suburb: suburb ?? '',
          state: state ?? '',
          postcode: postcode ?? '',
          abn: abn ?? '',
          abn_entity_name: abnEntityName ?? '',
          specialty,
          plan: plan ?? 'starter',
          billing: billing ?? 'monthly',
        },
      },
    });

    if (error) {
      return jsonResponse({ success: false, error: error.message });
    }

    return jsonResponse({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('sign-up unhandled error:', msg);
    return jsonResponse({ success: false, error: 'An unexpected error occurred. Please try again.' });
  }
});
