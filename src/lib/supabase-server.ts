import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export const createRouteClient = () => {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )
}

export const createServerClient = createRouteClient