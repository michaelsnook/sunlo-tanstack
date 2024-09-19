import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import type {
	LanguageFetched,
	LanguageLoaded,
	LanguageMeta,
	PhrasesMap,
	PhraseFull,
	pids,
	uuid,
} from 'types/main'
import supabase from 'lib/supabase-client'
import { mapArray } from 'lib/utils'

const qs = {
	phrase_full: () => `*, translations:phrase_translation(*)` as const,
	language_full: () => `*, phrases:phrase_plus(${qs.phrase_full()})` as const,
}

export async function fetchLanguage(lang: string): Promise<LanguageLoaded> {
	const { data } = await supabase
		.from('language_plus')
		.select(qs.language_full())
		.eq('lang', lang)
		.maybeSingle()
		.throwOnError()
	const { phrases: phrasesArray, ...meta }: LanguageFetched = data
	const pids: pids = phrasesArray?.map((p) => p.id)
	const phrasesMap: PhrasesMap = mapArray(phrasesArray, 'id')
	return {
		meta,
		pids,
		phrasesMap,
	}
}

// Inputs for any kind of deck query we want to construct
type LanguageQuery = {
	lang: string
	select?: (
		data: LanguageLoaded
	) =>
		| LanguageLoaded
		| PhraseFull
		| Array<PhraseFull>
		| PhrasesMap
		| LanguageMeta
		| pids
}

function useLanguageQuery({ select = undefined, lang }: LanguageQuery) {
	return useQuery({
		queryKey: ['language', lang],
		queryFn: async ({ queryKey }) => fetchLanguage(queryKey[1]),
		select,
		enabled: lang.length === 3,
		gcTime: 1_200_000,
		staleTime: 120_000,
		refetchOnWindowFocus: false,
	})
}

export const useLanguage = (lang: string) =>
	useLanguageQuery({ lang }) as UseQueryResult<LanguageLoaded>

export const useLanguageMeta = (lang: string) =>
	useLanguageQuery({
		lang,
		select: (data: LanguageLoaded) => data.meta,
	}) as UseQueryResult<LanguageMeta>

export const useLanguagePids = (lang: string) =>
	useLanguageQuery({
		lang,
		select: (data: LanguageLoaded) => data.pids,
	}) as UseQueryResult<pids>

export const useLanguagePhrases = (lang: string) =>
	useLanguageQuery({
		lang,
		select: (data: LanguageLoaded) => data.phrasesMap,
	}) as UseQueryResult<PhrasesMap>

export const usePhrase = (pid: uuid, lang: string) =>
	useLanguageQuery({
		lang,
		select: (data: LanguageLoaded) => data.phrasesMap[pid],
	}) as UseQueryResult<PhraseFull>
