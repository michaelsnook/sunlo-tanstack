import supabase from 'lib/supabase-client'
import type { Phrase, Language, uuid } from 'types/main'

export const getAllPhraseDetails = async (): Promise<Array<Phrase>> => {
  const { data, error } = await supabase.from('phrase').select(phraseFullSelect)
  if (error) throw error
  return data.map((phrase) => phrasePostFetch(phrase)) || []
}

export const getLanguageDetails = async (
  lang: string
): Promise<Language | null> => {
  const { data, error } = await supabase
    .from('language')
    .select(
      `
        lang, name,
        phrase(${phraseFullSelect}),
        user_deck(id, lang, created_at, uid)
      `
    )
    .eq('lang', lang)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  const language: Language = {
    lang: data.lang,
    name: data.name,
    phrases:
      Array.isArray(data?.phrase) ?
        data.phrase?.map((p) => phrasePostFetch(p))
      : [],
    deck: data?.user_deck[0],
  }

  // console.log(`getLanguageDetails result, `, language)
  return language
}

const phraseFullSelect = `
    id, text, lang,
    translations:phrase_translation(id, text, lang),
    phrase_from:phrase_relation!phrase_see_also_to_phrase_id_fkey(
      id, from_phrase_id, phrase:phrase!phrase_see_also_from_phrase_id_fkey(id, text, lang)
    ),
    phrase_to:phrase_relation!phrase_see_also_from_phrase_id_fkey(
      id, to_phrase_id, phrase:phrase!phrase_see_also_to_phrase_id_fkey(id, text, lang)
    ),
    card:user_card(id, user_deck_id, status)
  `

const phrasePostFetch = (phrase): Phrase => {
  const see_also_phrases = (
    phrase?.phrase_from?.map((s) => s?.phrase) || []
  ).concat(phrase?.phrase_to?.map((s) => s?.phrase) || [])
  delete phrase.phrase_from
  delete phrase.phrase_to
  phrase['see_also_phrases'] = see_also_phrases
  if (phrase.card.length === 1) phrase.card = phrase.card[0]
  else if (phrase.card.length === 0) phrase.card = null
  return phrase
}

export const getPhraseDetails = async (id: uuid): Promise<Phrase> => {
  const { data, error } = await supabase
    .from('phrase')
    .select(phraseFullSelect)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  // console.log(`getPhraseDetails data`, data.phrase_to, data.phrase_from)
  return phrasePostFetch(data)
}
