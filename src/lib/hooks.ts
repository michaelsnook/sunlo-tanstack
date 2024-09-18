import type { ProfileFull } from 'types/main'
import supabase from './supabase-client'
import { PostgrestError } from '@supabase/supabase-js'
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useContext } from 'react'
import { AuthContext } from 'components/auth-context'

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

export const profileQuery = queryOptions<ProfileFull, PostgrestError>({
  queryKey: ['user', 'profile'],
  queryFn: async () => {
    const { data } = await supabase
      .from('user_profile')
      .select(`*, decks:user_deck_plus(*)`) // `friendships:user_friendships(*)`
      .maybeSingle()
      .throwOnError()
    return data
  },
})

export const useProfile = (): UseQueryResult<ProfileFull, PostgrestError> => {
  const auth = useAuth()
  return useQuery({ ...profileQuery, enabled: auth.isAuth })
}
