import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Gunakan NEXT_PUBLIC_ karena variabel ini tersedia saat build di Vercel
// Tambahkan fallback string kosong untuk mencegah crash saat prerendering static pages
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const createRouteClient = () => {
  // Jika URL tidak ada, kita tetap panggil createClient tapi dengan string kosong
  // Supabase akan memberikan error yang lebih jelas di runtime daripada crash saat build
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

export const createServerClient = createRouteClient