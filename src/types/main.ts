import { Tables, TablesInsert } from './supabase'
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import {
	PostgrestError,
	PostgrestMaybeSingleResponse,
	PostgrestResponse,
} from '@supabase/supabase-js'

export type uuid = string
export type pids = Array<uuid>

export type SelectOption = { value: string; label: string }
// Don't keep using these. use the framework's types for links and routes
export type LinkType = {
	name: string
	href: string | null
	// TODO enum these for the caller
	icon?: string
}
export type MenuType = LinkType & {
	links: Array<LinkType>
}
export type NavbarData = {
	title: string
	subtitle?: string
	icon?: string
	onBackClick?: () => void
	contextMenu?: Array<LinkType>
}

export type UseSBQuery<T> = UseQueryResult<T, PostgrestError>
export type UseSBMutation<T> = UseMutationResult<T, PostgrestError>
export type SBQuery<T> = Promise<PostgrestResponse<T>>
export type SBQuerySingle<T> = Promise<PostgrestMaybeSingleResponse<T>>
export type SBMutation<T> = Promise<PostgrestResponse<T>>

export type LanguageRow = Omit<Tables<'language'>, 'alias_of'>
export type LanguageMeta = Tables<'language_plus'>
export type LanguageFetched = LanguageMeta & {
	phrases: Array<PhraseFull>
}
export type PhrasesMap = {
	[key: uuid]: PhraseFull
}
export type LanguageLoaded = {
	meta: LanguageMeta
	pids: pids
	phrasesMap: {
		[key: string]: PhraseFull
	}
}

export type PhraseRow = Tables<'phrase'>
export type PhraseStub = Tables<'phrase'>
export type PhraseInsert = TablesInsert<'phrase'>

export type Translation = Tables<'phrase_translation'>
export type TranslationRow = Tables<'phrase_translation'>
export type TranslationInsert = TablesInsert<'phrase_translation'>

export type RelationRow = Tables<'phrase_relation'>
export type RelationInsert = TablesInsert<'phrase_relation'>

export type PhraseMeta = Tables<'phrase_plus'>
export type PhraseFull = PhraseMeta & {
	translations: Array<TranslationRow>
}
export type PhraseFullInsert = PhraseInsert & {
	translations: Array<TranslationInsert>
	relation_pids?: pids
}

export type DeckRow = Tables<'user_deck'>
export type DeckStub = Tables<'user_deck'>
export type DeckInsert = TablesInsert<'user_deck'>
export type DeckMeta = Tables<'user_deck_plus'>
export type DeckFetched = DeckMeta & {
	cards: Array<CardFull>
}
// we are not literally using a map, but maybe we should!
export type CardsMap = {
	[key: uuid]: CardFull
}

export type DeckLoaded = {
	meta: DeckMeta
	pids: pids
	cardsMap: CardsMap
}

export type CardRow = Tables<'user_card'>
export type CardMeta = Tables<'user_card_plus'>
export type CardInsert = TablesInsert<'user_card'>
export type UserCardInsert = CardInsert // @TODO remove

export type ReviewMeta = Tables<'user_card_review_plus'>
export type ReviewRow = Tables<'user_card_review'>
export type Review = ReviewRow // @TODO remove
export type ReviewInsert = TablesInsert<'user_card_review'>

export type CardFull = CardMeta & {
	reviews?: Array<ReviewMeta>
}

// export type ProfilePublic = Tables<'public_profile'>
export type ProfileRow = Tables<'user_profile'>
export type ProfileInsert = TablesInsert<'user_profile'>
export type ProfileMeta = ProfileRow // Tables<'profile_meta'>
export type ProfileFull = Tables<'user_profile'> & {
	decksMap: DecksMap
	deckLanguages: Array<string>
	friendships?: Array<FriendshipRow>
}
export type DecksMap = null | {
	[key: string]: DeckMeta
}

export type FriendshipRow = {
	uid: uuid
	friend_uuid: uuid
	helping_with: Array<string>
	created_at: string
	updated_at: string
}

// for legacy hooks and such

export type PhraseCardInsert = {
	phrase: PhraseInsert
	translations: Array<TranslationInsert>
	user_deck_id: uuid
}

export type Phrase = PhraseStub & {
	// @TODO retire this
	see_also_phrases?: PhraseStub[]
	translations?: Translation[]
	card?: Tables<'user_card'>
}

export type PhraseCardRow = PhraseRow & {
	translations: Array<TranslationRow>
	card: CardRow
}

export type PhraseCardFull = {
	lang: string
	phrase: PhraseFull
	card: CardFull
	user_deck_id: uuid
}

export type Language = LanguageRow & {
	phrases: Array<Phrase>
	deck?: DeckStub
}

export type Deck = DeckStub & {
	pids: {
		active: pids
		learned: pids
		skipped: pids
	}
}

export type ReviewsCollated = {
	list: Array<Review>
	collated: object
	keysInOrder: Array<string>
}
