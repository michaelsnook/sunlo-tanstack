'use client'

import supabase from 'lib/supabase-client'
import { DeckStub } from 'types/main'

export const postNewDeck = async (lang: string): Promise<DeckStub> => {
  // console.log(`postNewDeck ${lang}`)
  if (typeof lang !== 'string' || lang.length !== 3)
    throw new Error('Form not right. Maybe refresh. Or tell the devs.')
  const { data, error } = await supabase
    .from('user_deck')
    .insert({ lang })
    .select()
  // console.log(`postNewDeck`, data, error)
  if (error) throw error
  return data[0]
}
