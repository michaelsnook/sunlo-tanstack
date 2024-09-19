import type { DeckMeta, DecksMap, ProfileFulls } from 'types/main'
import supabase from './supabase-client'
import { PostgrestError } from '@supabase/supabase-js'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { mapArray } from './utils'
import { useAuth } from './hooks'

async function fetchAndShapeProfileFull(): Promise<ProfileFulls | null> {
	const { data } = await supabase
		.from('user_profile')
		.select(`*, decks_array:user_deck_plus(*)`)
		.maybeSingle()
		.throwOnError()
	if (!data) return null
	const { decks_array, ...profile } = data
	const decksMap: DecksMap = mapArray<DeckMeta, 'lang'>(decks_array, 'lang')
	// @ts-ignore
	const deckLanguages: Array<lang> = decks_array.map((d) => d.lang)
	return { ...profile, decksMap, deckLanguages }
}

export const profileQuery = queryOptions<ProfileFulls, PostgrestError>({
	queryKey: ['user', 'profile'],
	queryFn: fetchAndShapeProfileFull,
})

export const useProfile = () => {
	const auth = useAuth()
	return useQuery({ ...profileQuery })
}
