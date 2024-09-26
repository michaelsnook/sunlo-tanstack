import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import type { NavbarData } from 'types/main'
import { profileQuery, useProfile } from 'lib/use-profile'
import languages from 'lib/languages'
import Loading from 'components/loading'

export const Route = createFileRoute('/learn/')({
	loader: async ({ context: { queryClient, auth } }) => {
		if (auth.userId)
			// this line is making sure the entire route tree awaits till we have the profile
			await queryClient.ensureQueryData(profileQuery(auth.userId))
		return {
			navbar: {
				title: `Learning Home`,
				subtitle: `Which deck are we studying today?`,
				icon: 'home',
				contextMenu: [
					{
						name: 'New Deck',
						href: '/learn/add-deck',
						icon: 'folder-plus',
					},
					{
						name: 'Quick search',
						href: '/learn/quick-search',
						icon: 'search',
					},
				],
			} as NavbarData,
		}
	},
	component: Page,
})

export default function Page() {
	const { data: profile, isPending } = useProfile()

	return (
		<main className="flex flex-col gap-4 px-4">
			{isPending ?
				<Loading />
			:	<ol>
					{profile?.deckLanguages.map((lang: string) => (
						<li key={lang} className="glass my-2 rounded p-2 text-center">
							<Link from={Route.fullPath} to="/learn/$lang" params={{ lang }}>
								<p className="py-2 text-xl">{languages[lang]}</p>
							</Link>
						</li>
					))}
				</ol>
			}
		</main>
	)
}
