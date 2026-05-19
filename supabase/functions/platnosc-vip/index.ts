import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@12.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("1. Otrzymano nowe zapytanie VIP!");

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Odbieramy tytul, wiadomosc i NOWOŚĆ: kwotę!
    const { tytul, wiadomosc, kwota } = await req.json()
    console.log(`2. Przetwarzam piosenkę: ${tytul}, Kwota: ${kwota} PLN`);

    // ZABEZPIECZENIE: Jeśli brakuje kwoty lub jest za niska (ktoś kombinuje), ustawiamy minimum 10 PLN
    const bezpiecznaKwota = (kwota && kwota >= 10) ? Math.round(kwota * 100) : 1000;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: { name: `VIP: ${tytul}` },
            // Tutaj wstawiamy naszą zmienną, którą wyliczył serwer
            unit_amount: bezpiecznaKwota, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        tytul: tytul,
        wiadomosc: wiadomosc || '',
        kwota: bezpiecznaKwota.toString() // Zapisujemy kwotę w logach transakcji
      },
      success_url: 'https://klubapp-vip.vercel.app/?success=true&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://klubapp-vip.vercel.app/?canceled=true',
    })

    console.log("3. Sukces! Wysyłam link do kasy.");
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error("BŁĄD KRYTYCZNY STRIPE:", error.message); 
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})