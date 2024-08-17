import supabase from 'lib/supabase-client'
import type {
  UserCardInsert,
  PhraseCardInsert,
  PhraseCardRow,
  CardRow,
} from '../types/main'

// status will default to 'active' at the DB
export const postNewCard = async (object: UserCardInsert): Promise<CardRow> => {
  // console.log(`postNewCard`, object)
  const { data } = await supabase
    .from('user_card')
    .insert(object)
    .select()
    .throwOnError()

  // console.log(`postNewCard result: `, data)
  return data[0]
}

export const postNewPhraseCardTranslations = async ({
  phrase,
  translations,
  user_deck_id,
}: PhraseCardInsert): Promise<PhraseCardRow> => {
  console.log(
    `postNewPhraseCardTranslations`,
    phrase,
    translations,
    user_deck_id
  )
  // i guess as long as they're logged in 🤷
  // if (!user_deck_id) throw new Error('deck ID not present')
  // @@TODO okay now is probably when i need proper validation
  if (!phrase.lang || !phrase.text)
    throw new Error('missing phrase lang or text')
  if (!(translations.length > 0)) throw new Error('no translations')
  // there must be a better way to validate this or type-check it
  translations.forEach((t, i) => {
    if (!t.text || !t.lang || !t.phrase_id)
      throw new Error('Something is broken with the translations')
  })

  const { data } = await supabase
    .from('phrase')
    .upsert(phrase)
    .select()
    .throwOnError()

  console.log(`this is the result of the new phrase thing`, data)
  const phraseData = data[0]
  // on the off chance that it's different from phrase.id...
  const { id: phrase_id } = phraseData

  // only works with a 1-item array, fine for now
  const translationsInsertPromise = supabase
    .from('phrase_translation')
    .upsert(translations)
    .select()

  // what if deck is not there and we know this will fail?
  const cardInsertPromise = supabase
    .from('user_card')
    .upsert({ user_deck_id, phrase_id })
    .select()

  // resolve both promises in parallel
  const [
    { data: translationsInserted, error: translationsInsertError },
    { data: cardInserted, error: cardInsertError },
  ] = await Promise.all([translationsInsertPromise, cardInsertPromise])

  const result: PhraseCardRow = {
    ...phraseData,
    translations: translationsInserted,
    card: cardInserted[0],
  }
  console.log(result)
  return result
}
