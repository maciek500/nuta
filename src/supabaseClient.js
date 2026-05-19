import { createClient } from '@supabase/supabase-js'

// Pobieramy Twoje tajne klucze z sejfu (.env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Tworzymy główne połączenie, z którego będziemy korzystać
export const supabase = createClient(supabaseUrl, supabaseAnonKey)