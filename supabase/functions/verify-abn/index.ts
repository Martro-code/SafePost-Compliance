// ABR (Australian Business Register) ABN lookup Edge Function.
// Requires the ABR_GUID secret to be set in Supabase Edge Function secrets.
// To set: supabase secrets set ABR_GUID=<your-guid> --project-ref <ref>
//
// All responses return HTTP 200 so supabase-js can read the body.
// Structured error codes:
//   INVALID_FORMAT      — ABN is not exactly 11 digits
//   ABN_NOT_FOUND       — ABN inactive, cancelled, or not found in ABR
//   SERVICE_UNAVAILABLE — network error, ABR API failure, or misconfiguration

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
    return jsonResponse({ valid: false, error: 'SERVICE_UNAVAILABLE', message: 'Method not allowed' }, 405);
  }

  try {
    const { abn } = await req.json();

    // Strip spaces and validate format: exactly 11 digits
    const cleaned = (abn ?? '').toString().replace(/\s/g, '');
    if (!/^\d{11}$/.test(cleaned)) {
      return jsonResponse({ valid: false, error: 'INVALID_FORMAT', message: 'ABN must be exactly 11 digits' });
    }

    const guid = Deno.env.get('ABR_GUID');
    if (!guid) {
      console.error('ABR_GUID secret is not configured');
      return jsonResponse({ valid: false, error: 'SERVICE_UNAVAILABLE', message: 'ABN verification service unavailable' });
    }

    const abrUrl = `https://abr.business.gov.au/abrxmlsearch/AbrXmlSearch.asmx/SearchByABNv202001?searchString=${cleaned}&includeHistoricalDetails=N&authenticationGuid=${guid}`;

    let abrRes: Response;
    let xml: string;
    try {
      abrRes = await fetch(abrUrl);
      xml = await abrRes.text();
    } catch (fetchErr) {
      const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      console.error(`ABR API request failed: ${msg}`);
      return jsonResponse({ valid: false, error: 'SERVICE_UNAVAILABLE', message: 'ABN verification service unavailable' });
    }

    if (!abrRes.ok) {
      console.error(`ABR API returned HTTP ${abrRes.status}. Response: ${xml.slice(0, 200)}`);
      return jsonResponse({ valid: false, error: 'SERVICE_UNAVAILABLE', message: 'ABN verification service unavailable' });
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
      return jsonResponse({ valid: false, error: 'SERVICE_UNAVAILABLE', message: 'ABN verification service unavailable' });
    }

    // Extract entity name — prefer organisation name, fall back to
    // individual name (given + family), then main trading name.
    const orgName = tag('OrganisationName');
    const givenName = tag('GivenName');
    const familyName = tag('FamilyName');
    const mainName = tag('OrganisationName', xml.match(/<MainName>[\s\S]*?<\/MainName>/)?.[0] ?? '');
    const entityName = orgName || (givenName || familyName ? `${givenName} ${familyName}`.trim() : '') || mainName || '';

    const entityType = tag('EntityDescription');

    // The ABR XML response may contain multiple entityStatus elements — one
    // per status period in the ABN's history. Find the current record by
    // looking for effectiveTo = '0001-01-01', which means no end date.
    // The ABN is active if that record's entityStatusCode is 'ACT'.
    const statusElements = xml.match(/<entityStatus>[\s\S]*?<\/entityStatus>/gi) || [];
    console.log('ABR entityStatus elements found:', statusElements.length, JSON.stringify(statusElements));

    let isActive = false;
    let abnStatus = '';
    for (const statusBlock of statusElements) {
      const effectiveTo = statusBlock.match(/<effectiveTo>(.*?)<\/effectiveTo>/i)?.[1];
      const statusCode = statusBlock.match(/<entityStatusCode>(.*?)<\/entityStatusCode>/i)?.[1];
      if (effectiveTo === '0001-01-01') {
        abnStatus = statusCode ?? '';
        if (statusCode === 'ACT' || statusCode === 'Active') {
          isActive = true;
        }
        break;
      }
    }

    // Fallback: if no current-record found via effectiveTo, accept any ACT/Active code.
    if (!abnStatus) {
      const entityStatusBlock = xml.match(/<[Ee]ntity[Ss]tatus>[\s\S]*?<\/[Ee]ntity[Ss]tatus>/)?.[0] ?? '';
      abnStatus = tag('EntityStatusCode', entityStatusBlock) || tag('EntityStatusCode');
      isActive = abnStatus === 'Active' || abnStatus === 'ACT';
      console.log('ABR status fallback used — abnStatus:', abnStatus);
    }

    if (!isActive) {
      return jsonResponse({
        valid: false,
        error: 'ABN_NOT_FOUND',
        message: 'ABN not found or invalid',
        entityName,
        entityType,
        status: abnStatus || 'Unknown',
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
    return jsonResponse({ valid: false, error: 'SERVICE_UNAVAILABLE', message: 'ABN verification service unavailable' });
  }
});
