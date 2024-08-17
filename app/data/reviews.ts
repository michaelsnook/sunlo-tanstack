'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import supabase from 'lib/supabase-client'

export function useRecentReviews(lang: string) {
  const priorTime = useMemo(() => {
    const dt = new Date()
    dt.setHours(0, 0, 0, 0)
    dt.setDate(dt.getDate() - 7)
    return dt.toUTCString()
  }, [])

  return useQuery({
    queryKey: ['reviews', lang, priorTime],
    queryFn: async ({ queryKey }) => {
      const { data } = await supabase
        .from('user_card_review_plus')
        .select(`id, created_at, card_id, score`)
        .eq('lang', lang)
        .gt('created_at', queryKey[2])
        .throwOnError()
      return data
    },
    enabled: !!priorTime && typeof lang === 'string' && lang.length === 3,
    staleTime: 120_000,
    gcTime: 1_200_000,
  })
}
