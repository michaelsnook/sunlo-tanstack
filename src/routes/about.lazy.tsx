import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import supabase from '../lib/supabase-client'
import { Tables } from 'types/supabase'

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  const { data, isPending, error } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () =>
      supabase.from('public_profile').select().throwOnError(),
    select: (data) => data.data,
  }) as UseQueryResult<Array<Tables<'public_profile'>>>

  return (
    <div className="p-2">
      <h2 className="h2">Hello from About!</h2>
      {isPending ?
        'loading...'
      : `${data.length} entries: ${JSON.stringify(data, null, 2)}`}
    </div>
  )
}
