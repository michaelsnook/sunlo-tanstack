'use client'

import { UseQueryResult, useQuery } from '@tanstack/react-query'
import supabase from 'lib/supabase-client'
import { Profile, ReviewsCollated, pids } from 'types/main'
import { useAuth } from 'components/auth-context'
import { collateArray } from 'lib/utils'
import { PostgrestError } from '@supabase/supabase-js'

type DeckPids = {
  active: pids
  learned: pids
  skipped: pids
}
const fetchDeckPids = async (lang: string): Promise<DeckPids> => {
  const { data } = await supabase
    .from('user_card_plus')
    .select('phrase_id, status')
    .eq('lang', lang)
    .throwOnError()

  if (!data) throw new Error('404')

  const deckPids = {
    active: data
      .filter(({ status }) => status === 'active')
      .map((c) => c.phrase_id),
    learned: data
      .filter(({ status }) => status === 'learned')
      .map((c) => c.phrase_id),
    skipped: data
      .filter(({ status }) => status === 'skipped')
      .map((c) => c.phrase_id),
  }

  return deckPids
}

export function usePidsByStatus(deckLang: string) {
  return useQuery({
    queryKey: ['user_deck', deckLang],
    queryFn: ({ queryKey }) => fetchDeckPids(queryKey[1]),
    enabled: !!deckLang,
    staleTime: 120_000,
    gcTime: 1_200_000,
    refetchOnWindowFocus: false,
  }) as UseQueryResult<DeckPids>
}

export function useProfile() {
  const { userId } = useAuth()
  return useQuery({
    queryKey: ['user_profile'],
    queryFn: async (): Promise<Profile | null> => {
      const { data } = await supabase
        .from('user_profile')
        .select(`*, deck_stubs:user_deck_plus(*)`)
        .eq('uid', userId)
        .maybeSingle()
        .throwOnError()

      return {
        languages_spoken: [],
        deck_stubs: [],
        ...data,
      }
    },
    enabled: userId ? true : false,
  }) as UseQueryResult<Profile, PostgrestError>
}

export const useRecentReviewActivity = () => {
  return useQuery({
    queryKey: ['all-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_card_review_plus')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error

      const result = collateArray(data, 'lang')
      console.log(`The collated array`, result)

      return {
        list: data,
        collated: result,
        keysInOrder: Object.keys(result),
      }
    },
  }) as UseQueryResult<ReviewsCollated>
}
