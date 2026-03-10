// Follow-along: https://supabase.com/docs/guides/functions/cors
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const categoryTagMap: Record<string, string> = {
  'Compliance check question': 'compliance',
  'Billing or subscription': 'billing',
  'Account or login issue': 'account',
  'Feature request': 'feature',
  'Report a bug': 'bug',
  'Other': 'general',
};

Deno.serve(async (req) => {
  // Handle CORS preflight — must return 200 with CORS headers
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
    const { first_name, last_name, email, phone, subject, category, message } = body;

    // Validate required fields
    const missingFields: string[] = [];
    if (!first_name?.trim()) missingFields.push('first_name');
    if (!last_name?.trim()) missingFields.push('last_name');
    if (!email?.trim()) missingFields.push('email');
    if (!category?.trim()) missingFields.push('category');
    if (!message?.trim()) missingFields.push('message');

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ error: `Missing required fields: ${missingFields.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const freshdeskApiKey = Deno.env.get('FRESHDESK_API_KEY');
    const freshdeskSubdomain = Deno.env.get('FRESHDESK_SUBDOMAIN');

    if (!freshdeskApiKey || !freshdeskSubdomain) {
      console.error('Missing Freshdesk configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const tag = categoryTagMap[category] || 'general';

    const ticketPayload = {
      name: `${first_name.trim()} ${last_name.trim()}`,
      email: email.trim(),
      phone: phone?.trim() || undefined,
      subject: category,
      description: message.trim(),
      priority: 1,
      status: 2,
      tags: [tag],
    };

    const freshdeskUrl = `https://${freshdeskSubdomain}.freshdesk.com/api/v2/tickets`;
    const credentials = btoa(`${freshdeskApiKey}:X`);

    const freshdeskResponse = await fetch(freshdeskUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketPayload),
    });

    if (!freshdeskResponse.ok) {
      const errorText = await freshdeskResponse.text();
      console.error('Freshdesk API error:', freshdeskResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to create support ticket' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const ticket = await freshdeskResponse.json();

    return new Response(
      JSON.stringify({ success: true, ticket_id: ticket.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (error) {
    console.error('submit-contact-form error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
