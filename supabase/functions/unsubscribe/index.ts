import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { verifyUnsubscribeToken } from '../_shared/unsubscribe-token.ts';

/**
 * Unsubscribe Edge Function — Spam Act 2003 (Cth) compliance.
 *
 * Accepts a GET request with a signed token (?token=xxx).
 * Verifies the token, then sets email_product_updates = false
 * in user_preferences for the identified user.
 *
 * This function uses verify_jwt = false so that unsubscribe links
 * work without the user being logged in.
 *
 * Required secrets:
 *   - SUPABASE_URL (auto-provided)
 *   - SUPABASE_SERVICE_ROLE_KEY (auto-provided)
 *   - UNSUBSCRIBE_SECRET — must be set manually:
 *       supabase secrets set UNSUBSCRIBE_SECRET=<your-secret> --project-ref acvcwzaipsxyrwbxithc
 */

const BASE_URL = 'https://www.safepost.com.au';

function htmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — SafePost</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 480px; margin: 80px auto; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 48px 32px; text-align: center; }
    .logo { width: 180px; margin-bottom: 24px; }
    h1 { color: #1e293b; font-size: 20px; margin-bottom: 12px; }
    p { color: #475569; font-size: 15px; line-height: 1.6; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .footer { margin-top: 32px; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <img src="${BASE_URL}/assets/safepost-logo.png" alt="SafePost" class="logo" />
    <h1>${title}</h1>
    <p>${message}</p>
    <p class="footer">SafePost Pty Ltd | <a href="${BASE_URL}">safepost.com.au</a></p>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  // Only accept GET requests
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response(
      htmlPage('Invalid Link', 'This unsubscribe link is missing a token. Please use the link from your email.'),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  let userId: string | null;
  try {
    userId = await verifyUnsubscribeToken(token);
  } catch (err) {
    console.error('Token verification error:', err);
    return new Response(
      htmlPage('Error', 'Something went wrong. Please try again later.'),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  if (!userId) {
    return new Response(
      htmlPage('Invalid Link', 'This unsubscribe link is invalid or has been tampered with. Please use the link from your email.'),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  // Update user preferences
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { error } = await supabaseAdmin
    .from('user_preferences')
    .upsert(
      { user_id: userId, email_product_updates: false },
      { onConflict: 'user_id' },
    );

  if (error) {
    console.error('Failed to update user_preferences:', error);
    return new Response(
      htmlPage('Error', 'Something went wrong while processing your request. Please try again later.'),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  console.log(`User ${userId} unsubscribed from marketing emails via link`);

  return new Response(
    htmlPage(
      'Unsubscribed',
      "You've been unsubscribed from SafePost marketing emails. You can re-enable these in your <a href=\"" + BASE_URL + "/settings\">account settings</a>.",
    ),
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
});
