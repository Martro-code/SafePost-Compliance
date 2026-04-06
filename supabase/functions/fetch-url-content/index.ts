import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const MAX_CONTENT_LENGTH = 10_000;

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

function extractTextFromHtml(html: string): { content: string; title: string } {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1] : '';
  const title = rawTitle.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();

  // Remove script and style blocks entirely
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  // Replace block elements with newlines to preserve sentence boundaries
  text = text
    .replace(/<\/(p|div|h[1-6]|li|td|th|br|section|article|header|footer|main|nav|aside)[^>]*>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n');

  // Strip remaining tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '...')
    .replace(/&#\d+;/g, ' ')
    .replace(/&[a-z]+;/g, ' ');

  // Collapse whitespace
  text = text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    content: text.slice(0, MAX_CONTENT_LENGTH),
    title,
  };
}

serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { url } = body as { url?: string };

    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'url is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return new Response(JSON.stringify({ error: 'Only http and https URLs are supported' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch the page
    let response: Response;
    try {
      response = await fetch(parsedUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SafePost-AuditBot/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-AU,en;q=0.9',
        },
        redirect: 'follow',
      });
    } catch (fetchErr) {
      console.error('Failed to fetch URL:', fetchErr);
      return new Response(JSON.stringify({ error: 'Failed to fetch the URL. The page may be unavailable or blocking automated access.' }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `URL returned HTTP ${response.status}` }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain') && !contentType.includes('application/xhtml')) {
      return new Response(JSON.stringify({ error: 'URL does not return HTML content' }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = await response.text();
    const { content, title } = extractTextFromHtml(html);

    if (!content || content.trim().length < 50) {
      return new Response(JSON.stringify({ error: 'Not enough readable content found on the page' }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ content, title }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('fetch-url-content error:', err);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
