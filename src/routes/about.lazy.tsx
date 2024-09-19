import { queryOptions, useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import supabase from 'lib/supabase-client'
import Loading from 'components/loading'
import { PostgrestError } from '@supabase/supabase-js'
import { PublicProfile } from 'types/main'

const publicProfilesQuery = queryOptions<Array<PublicProfile>, PostgrestError>({
	queryKey: ['profiles'],
	queryFn: async () => {
		const { data } = await supabase
			.from('public_profile')
			.select()
			.throwOnError()
		return data
	},
	staleTime: 120_000,
	gcTime: 300_000,
})

export const Route = createLazyFileRoute('/about')({
	component: About,
})

function About() {
	// Read the data from the cache and subscribe to updates
	const { data, isPending } = useQuery(publicProfilesQuery)

	return (
		<div className="p-2">
			<h2 className="h2">Hello from About!</h2>
			{isPending ?
				<Loading />
			:	<p>{data.length} people learning:</p>}
			<ul className="space-y-2 @md:w-1/2">
				{data?.map((p) => (
					<li key={p.uid} className="alert">
						{p.username}
					</li>
				))}
			</ul>
		</div>
	)
}
