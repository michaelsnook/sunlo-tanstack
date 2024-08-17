import { PostgrestError } from '@supabase/supabase-js'
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import supabase from 'lib/supabase-client'
import { RelationInsert, RelationRow } from 'types/main'

export function useInsertRelation(): UseMutationResult<
  Array<RelationRow>,
  PostgrestError
> {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (values: RelationInsert) => {
      // supports multiple inserts
      const { data, error } = await supabase
        .from('phrase_relation')
        .insert(values)
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      client.invalidateQueries()
    },
  })
}
