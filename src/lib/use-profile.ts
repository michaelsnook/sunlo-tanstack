import { PostgrestError } from '@supabase/supabase-js'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { DeckMeta, DecksMap, ProfileFull } from 'types/main'
import supabase from 'lib/supabase-client'
import { mapArray } from 'lib/utils'
import { useAuth } from 'lib/hooks'

async function fetchAndShapeProfileFull(): Promise<ProfileFull | null> {
	const { data } = await supabase
		.from('user_profile')
		.select(`*, decks_array:user_deck_plus(*)`)
		.maybeSingle()
		.throwOnError()
	if (!data) return null
	const { decks_array, ...profile } = data
	const decksMap: DecksMap = mapArray<DeckMeta, 'lang'>(decks_array, 'lang')
	const deckLanguages: Array<string> = decks_array.map((d) => d.lang)
	return { ...profile, decksMap, deckLanguages }
}

export const profileQuery = queryOptions<ProfileFull, PostgrestError>({
	queryKey: ['user', 'profile'],
	queryFn: fetchAndShapeProfileFull,
})

export const useProfile = () => {
	// TODO this is only here to re-render when auth changes
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const auth = useAuth()
	return useQuery({ ...profileQuery })
}
