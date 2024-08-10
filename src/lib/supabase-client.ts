import { createClient } from '@supabase/supabase-js'
import { Database } from 'types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const publicKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY

const supabase = createClient<Database>(supabaseUrl, publicKey)

export default supabase
