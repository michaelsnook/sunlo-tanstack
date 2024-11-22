import { PostgrestError } from '@supabase/supabase-js'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { DeckMeta, DecksMap, ProfileFull, uuid } from '@/types/main'
import supabase from '@/lib/supabase-client'
import { mapArray } from '@/lib/utils'
import { useAuth } from '@/lib/hooks'

async function fetchAndShapeProfileFull() {
	const { data } = await supabase
		.from('user_profile')
		.select(`*, decks_array:user_deck_plus(*)`)
		.maybeSingle()
		.throwOnError()
	if (!data) return null
	const { decks_array, ...profile } = data
	const decksMap: DecksMap = mapArray<DeckMeta, 'lang'>(decks_array, 'lang')
	const deckLanguages: Array<string> = decks_array.map((d) => d.lang)
	return { ...profile, decksMap, deckLanguages } as ProfileFull
}

export const profileQuery = (userId = '') =>
	queryOptions<ProfileFull, PostgrestError>({
		queryKey: ['user', userId],
		queryFn: async () => {
			if (!userId) return null
			return await fetchAndShapeProfileFull()
		},
	})

export const useProfile = () => {
	const { userId } = useAuth()
	return useQuery({ ...profileQuery(userId) })
}

export const usePublicProfile = (uid: uuid) => {
	return useQuery({
		queryKey: ['public', 'profile', uid],
		queryFn: async () => {
			const res = await supabase
				.from('public_profile')
				.select()
				.eq('uid', uid)
				.maybeSingle()
				.throwOnError()
			return res.data
		},
		enabled: typeof uid === 'string' && uid?.length > 10,
	})
}
