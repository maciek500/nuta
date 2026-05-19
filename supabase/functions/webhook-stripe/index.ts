import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@12.0.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Inicjalizacja Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

// Sekret Webhooka (ustawimy go za chwilę)
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') as string

serve(async (req) => {
  try {
    // Pobieramy sygnaturę od Stripe (żeby mieć pewność, że to hakerzy nie próbują dodać piosenek)
    const signature = req.headers.get('Stripe-Signature')

    if (!signature || !webhookSecret) {
      return new Response('Brak sygnatury lub sekretu webhooka.', { status: 400 })
    }

    const body = await req.text()
    let event

    try {
      // Weryfikujemy kryptograficznie, czy zapytanie naprawdę idzie od Stripe
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
    } catch (err) {
      console.error(`Błąd weryfikacji sygnatury: ${err.message}`)
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    // Interesuje nas tylko udana płatność
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      // Magia! Wyciągamy z sesji nasze dane, które ukryliśmy w metadata
      const { tytul, wiadomosc, kwota, okladka, spotify_id } = session.metadata

      // Łączymy się z bazą danych (używamy klucza SERVICE_ROLE, żeby wbić się bezpośrednio jako admin)
      const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Wrzucamy piosenkę bez litości prosto do bazy jako VIP
      const { error } = await supabase.from('piosenki').insert([
        {
          tytul: tytul,
          wiadomosc: wiadomosc || '',
          glosy: 0,
          platna: true,
          kwota: parseInt(kwota) / 100 || 10, // Dzielimy przez 100, bo Stripe operuje na groszach
          okladka: okladka || '',
          spotify_id: spotify_id || '',
          session_id: session.id
        }
      ])

      if (error) {
        console.error('Błąd dodawania piosenki VIP do Supabase:', error)
        return new Response('Błąd bazy danych', { status: 500 })
      }

      console.log(`BINGO! Dodano VIP-a z Webhooka: ${tytul}`)
    }

    // Mówimy Stripe'owi, że wszystko ogarnięte
    return new Response(JSON.stringify({ received: true }), { status: 200 })
    
  } catch (error) {
    console.error('Krytyczny błąd Webhooka:', error)
    return new Response('Wewnętrzny błąd serwera', { status: 500 })
  }
})