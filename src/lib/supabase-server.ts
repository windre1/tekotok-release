import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// Fungsi untuk Server Components
export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies }) as any
}

// Fungsi untuk API Routes / Route Handlers
export const createRouteClient = () => {
  return createRouteHandlerClient<Database>({ cookies }) as any
}