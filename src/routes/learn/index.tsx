import { createFileRoute, Link } from '@tanstack/react-router'
import { Star, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { NavbarData } from '@/types/main'
import { profileQuery, useProfile } from '@/lib/use-profile'
import { ago } from '@/lib/dayjs'
import Loading from '@/components/loading'

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
						to: '/learn/add-deck',
						icon: 'folder-plus',
					},
					{
						name: 'Quick search',
						to: '/learn/quick-search',
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
		<main className="grid gap-4 @lg:grid-cols-2">
			{isPending ?
				<Loading />
			:	Object.entries(profile?.decksMap).map(([key, deck]) => (
					<Link
						key={key}
						to="/learn/$lang"
						params={{ lang: key }}
						className="block transition-transform rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						<Card
							key={deck.language}
							className="overflow-hidden h-full hover:border-primary"
						>
							<CardHeader className="bg-primary text-white">
								<CardTitle>
									{deck.language}{' '}
									<span className="text-xs text-white/50">{key}</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 space-y-2">
								<div>
									<p className="text-sm text-base-content/70">
										{deck.cards_active} active cards
									</p>
									<p className="text-sm text-base-content/70">
										Last studied:{' '}
										{deck.most_recent_review_at ?
											ago(deck.most_recent_review_at)
										:	'never'}
									</p>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-1">
										<Users className="h-4 w-4 text-info" />
										<span className="text-sm">{0} friends studying</span>
									</div>
									<div className="flex items-center space-x-1">
										<Star className="h-4 w-4 text-warning" />
										<span className="text-sm">{4.5}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</Link>
				))
			}
		</main>
	)
}
