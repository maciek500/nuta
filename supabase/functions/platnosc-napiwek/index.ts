import Stripe from 'npm:stripe@^14.0.0';

// Używamy natywnego klienta fetch, co jest wymagane na nowoczesnych serwerach Edge
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Nowoczesny sposób uruchamiania serwera: Deno.serve
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { kwota } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: '🍺 Piwo dla DJ-a',
              description: 'Zafunduj DJ-owi drinka za świetną imprezę!',
            },
            unit_amount: kwota * 100, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // UWAGA: PODMIEŃ PONIŻSZE LINKI NA SWÓJ ADRES Z VERCELA!
      success_url: `https://klubapp-vip.vercel.app/?success=true&napiwek=true`,
      cancel_url: `https://klubapp-vip.vercel.app/?canceled=true`,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});