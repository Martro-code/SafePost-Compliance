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

    const abrUrl = `https://abr.business.gov.au/json/AbnDetails.aspx?abn=${cleaned}&callback=callback&guid=${guid}`;
    const abrRes = await fetch(abrUrl);
    const text = await abrRes.text();

    // Parse JSONP: strip "callback(" prefix and ")" suffix
    const jsonStr = text.replace(/^callback\(/, '').replace(/\)$/, '');
    const data = JSON.parse(jsonStr);

    // ABR returns Abn, AbnStatus, EntityName, EntityTypeName etc.
    const abnStatus = data.AbnStatus ?? '';
    const entityName = data.EntityName ?? data.BusinessName?.[0]?.Name ?? '';
    const entityType = data.EntityTypeName ?? '';
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
