import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from 'types/supabase'

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL
const publicKey: string = import.meta.env.VITE_SUPABASE_PUBLIC_KEY

const supabase: SupabaseClient = createClient<Database>(supabaseUrl, publicKey)

export default supabase
