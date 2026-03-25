// ABR (Australian Business Register) ABN lookup Edge Function.
// Requires the ABR_GUID secret to be set in Supabase Edge Function secrets.
// To set: supabase secrets set ABR_GUID=<your-guid> --project-ref <ref>

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
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const { abn } = await req.json();

    // Strip spaces and validate format: exactly 11 digits
    const cleaned = (abn ?? '').toString().replace(/\s/g, '');
    if (!/^\d{11}$/.test(cleaned)) {
      return jsonResponse({ error: 'ABN must be exactly 11 digits.' }, 400);
    }

    const guid = Deno.env.get('ABR_GUID');
    if (!guid) {
      console.error('ABR_GUID secret is not configured');
      return jsonResponse({ error: 'ABR lookup is not configured. Please contact support.' }, 500);
    }

    const abrUrl = `https://abr.business.gov.au/abrxmlsearch/AbrXmlSearch.asmx/SearchByABNv202001?searchString=${cleaned}&includeHistoricalDetails=N&authenticationGuid=${guid}`;
    const abrRes = await fetch(abrUrl);
    const xml = await abrRes.text();

    // Helper to extract text content from an XML element by tag name.
    const tag = (name: string, src?: string): string => {
      const match = (src ?? xml).match(new RegExp(`<${name}[^>]*>([^<]*)</${name}>`));
      return match ? match[1].trim() : '';
    };

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
      return jsonResponse(
        {
          valid: false,
          entityName,
          entityType,
          status: abnStatus || 'Unknown',
          error: `This ABN is ${abnStatus || 'not active'}. Please check and try again.`,
        },
        400,
      );
    }

    return jsonResponse({
      valid: true,
      entityName,
      entityType,
      status: abnStatus,
    });
  } catch (err) {
    console.error('verify-abn error:', err);
    return jsonResponse({ error: 'Failed to verify ABN. Please try again.' }, 500);
  }
});
