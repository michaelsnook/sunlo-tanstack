import type { Profile } from '../types/main'
import supabase from './supabase-client'
import { PostgrestError } from '@supabase/supabase-js'
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'

export const useLang = () => {
  const parms = useParams({ strict: false })
  console.log(`useParams returns:`, parms)
  return parms['lang']
}

const blank = {
  isAuth: false,
  userId: null,
  userEmail: null,
  isPending: true,
}

export const useUserQuery = () =>
  useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return {
        isAuth: data?.user.role === 'authenticated',
        userId: data?.user.id ?? null,
        userEmail: data?.user.email ?? null,
        isPending: false,
      }
    },
    placeholderData: blank,
  })

export const useAuth = () => {
  const userQuery = useUserQuery()
  return userQuery.isPending ? blank : userQuery.data
}

export const useSignOut = () => {
  const navigate = useNavigate()
  const client = useQueryClient()

  return useMutation({
    mutationFn: async () => await supabase.auth.signOut(),
    onSuccess: () => {
      client.setQueryData(['user'], blank)
      navigate({ to: '/' })
    },
  })
}

export function useProfile() {
  return useQuery({
    queryKey: ['user_profile'],
    queryFn: async (): Promise<Profile | null> => {
      const { data } = await supabase
        .from('user_profile')
        .select(`*, decks:user_deck_plus(*)`)
        .maybeSingle()
        .throwOnError()
      return data
    },
  }) as UseQueryResult<Profile, PostgrestError>
}
