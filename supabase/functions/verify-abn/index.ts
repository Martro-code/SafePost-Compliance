// ABR (Australian Business Register) ABN lookup Edge Function.
// Requires the ABR_GUID secret to be set in Supabase Edge Function secrets.
// To set: supabase secrets set ABR_GUID=<your-guid> --project-ref <ref>
//
// All "business logic" failures (missing secret, bad ABN, inactive ABN, ABR
// API errors) return HTTP 200 with { valid: false, error: '...' } so the
// frontend can read data.error directly. Non-2xx statuses cause supabase-js
// to set data = null, which silences the real error message.

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
    return jsonResponse({ valid: false, error: 'Method not allowed' }, 405);
  }

  try {
    const { abn } = await req.json();

    // Strip spaces and validate format: exactly 11 digits
    const cleaned = (abn ?? '').toString().replace(/\s/g, '');
    if (!/^\d{11}$/.test(cleaned)) {
      return jsonResponse({ valid: false, error: 'ABN must be exactly 11 digits.' });
    }

    const guid = Deno.env.get('ABR_GUID');
    if (!guid) {
      console.error('ABR_GUID secret is not configured');
      return jsonResponse({
        valid: false,
        error: 'ABR lookup is not configured — ABR_GUID secret is missing. Please contact support.',
      });
    }

    const abrUrl = `https://abr.business.gov.au/abrxmlsearch/AbrXmlSearch.asmx/SearchByABNv202001?searchString=${cleaned}&includeHistoricalDetails=N&authenticationGuid=${guid}`;

    let abrRes: Response;
    let xml: string;
    try {
      abrRes = await fetch(abrUrl);
      xml = await abrRes.text();
    } catch (fetchErr) {
      const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      console.error('ABR API fetch failed:', msg);
      return jsonResponse({
        valid: false,
        error: `ABR API request failed: ${msg}`,
      });
    }

    if (!abrRes.ok) {
      console.error(`ABR API returned HTTP ${abrRes.status}:`, xml);
      return jsonResponse({
        valid: false,
        error: `ABR API returned HTTP ${abrRes.status}. Response: ${xml.slice(0, 200)}`,
      });
    }

    // Helper to extract text content from an XML element by tag name.
    const tag = (name: string, src?: string): string => {
      const match = (src ?? xml).match(new RegExp(`<${name}[^>]*>([^<]*)</${name}>`));
      return match ? match[1].trim() : '';
    };

    // Check for an ABR-level exception in the response XML.
    const exceptionDesc = tag('exceptionDescription');
    if (exceptionDesc) {
      console.error('ABR API exception:', exceptionDesc);
      return jsonResponse({
        valid: false,
        error: `ABR API error: ${exceptionDesc}`,
      });
    }

    // Extract entity name — prefer organisation name, fall back to
    // individual name (given + family), then main trading name.
    const orgName = tag('OrganisationName');
    const givenName = tag('GivenName');
    const familyName = tag('FamilyName');
    const mainName = tag('OrganisationName', xml.match(/<MainName>[\s\S]*?<\/MainName>/)?.[0] ?? '');
    const entityName = orgName || (givenName || familyName ? `${givenName} ${familyName}`.trim() : '') || mainName || '';

    const entityType = tag('EntityDescription');
    const abnStatus = tag('EntityStatusCode');
    const isActive = abnStatus === 'Active';

    if (!isActive) {
      return jsonResponse({
        valid: false,
        entityName,
        entityType,
        status: abnStatus || 'Unknown',
        error: `This ABN is ${abnStatus || 'not active'}. Please check and try again.`,
      });
    }

    return jsonResponse({
      valid: true,
      entityName,
      entityType,
      status: abnStatus,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('verify-abn unhandled error:', msg);
    return jsonResponse({ valid: false, error: `Unexpected error: ${msg}` });
  }
});
