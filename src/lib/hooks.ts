import type { Profile } from '../types/main'
import supabase from './supabase-client'
import { PostgrestError } from '@supabase/supabase-js'
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useContext } from 'react'
import { AuthContext } from '../components/auth-context'

export const useLang = () => {
  const parms = useParams({ strict: false })
  console.log(`useParams returns:`, parms)
  return parms['lang']
}

// Access the context's value from inside a provider
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('You need to wrap AuthProvider.')
  }
  return context
}

export const useSignOut = () => {
  const navigate = useNavigate()
  const client = useQueryClient()

  return useMutation({
    mutationFn: async () => await supabase.auth.signOut(),
    onSuccess: () => {
      client.removeQueries({ queryKey: ['user'], exact: false })
      navigate({ to: '/' })
    },
  })
}

export const profileQuery = queryOptions<Profile, PostgrestError>({
  queryKey: ['user', 'profile'],
  queryFn: async (): Promise<Profile | null> => {
    const { data } = await supabase
      .from('user_profile')
      .select(`*, decks:user_deck_plus(*)`)
      .maybeSingle()
      .throwOnError()
    return data
  },
})

export const useProfile = () => {
  const auth = useAuth()
  return useQuery({ ...profileQuery, enabled: auth.isAuth })
}
