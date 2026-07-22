import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const PLACEHOLDER_KEY = 'placeholder'

export const supabase = createClient(
  url && url.startsWith('https://') ? url : PLACEHOLDER_URL,
  key || PLACEHOLDER_KEY,
)

export const supabaseConfigured =
  !!url && url.startsWith('https://') && !!key && key !== 'placeholder'

if (import.meta.env.DEV) {
  console.log('[supabase] URL:', url ?? '(niet ingesteld)')
  console.log('[supabase] configured:', supabaseConfigured)
}
