/**
 * Shared helper for generating and verifying signed unsubscribe tokens.
 *
 * Tokens are HMAC-SHA256 signatures over the user's ID, keyed with
 * UNSUBSCRIBE_SECRET. This ensures unsubscribe links cannot be forged
 * or used to unsubscribe other users.
 *
 * Required secret:
 *   UNSUBSCRIBE_SECRET — a random string (≥ 32 characters recommended).
 *   Set it via:
 *     supabase secrets set UNSUBSCRIBE_SECRET=<your-secret> --project-ref acvcwzaipsxyrwbxithc
 */

const FUNC_BASE = 'https://acvcwzaipsxyrwbxithc.supabase.co/functions/v1';

function getSecret(): string {
  const secret = Deno.env.get('UNSUBSCRIBE_SECRET');
  if (!secret) throw new Error('UNSUBSCRIBE_SECRET is not configured');
  return secret;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Generate a signed unsubscribe token for a given user ID.
 * Format: `<user_id>.<hex_signature>`
 */
export async function generateUnsubscribeToken(userId: string): Promise<string> {
  const key = await hmacKey(getSecret());
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(userId));
  return `${userId}.${toHex(sig)}`;
}

/**
 * Verify an unsubscribe token and return the user ID if valid.
 * Returns `null` if the token is invalid or tampered with.
 */
export async function verifyUnsubscribeToken(token: string): Promise<string | null> {
  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) return null;

  const userId = token.substring(0, dotIndex);
  const sigHex = token.substring(dotIndex + 1);

  if (!userId || !sigHex) return null;

  try {
    const key = await hmacKey(getSecret());
    const enc = new TextEncoder();
    const valid = await crypto.subtle.verify('HMAC', key, fromHex(sigHex), enc.encode(userId));
    return valid ? userId : null;
  } catch {
    return null;
  }
}

/**
 * Build a full unsubscribe URL for embedding in emails.
 */
export async function buildUnsubscribeUrl(userId: string): Promise<string> {
  const token = await generateUnsubscribeToken(userId);
  return `${FUNC_BASE}/unsubscribe?token=${encodeURIComponent(token)}`;
}
