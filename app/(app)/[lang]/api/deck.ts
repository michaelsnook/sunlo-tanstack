import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from 'lib/supabase-client'
import { DeckInsert } from 'types/main'
// postNewDeck
async function postInsertDeck(values: DeckInsert) {
  const { data, error } = await supabase.from('user_deck').insert(values)
  if (error) throw error
  return data
}

// createNewDeck
function useInsertDeck() {
  const client = useQueryClient()
  return useMutation({
    // mutationKey: [],
    mutationFn: async (values: DeckInsert) => postInsertDeck(values),
    onSuccess: () => {
      // it's a fresh deck, so no need for optimistics
      client.invalidateQueries({ queryKey: ['user_profile'] })
    },
  })
}
// update deck: nope
