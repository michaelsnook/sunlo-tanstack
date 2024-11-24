import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { NavbarData } from '@/types/main'
import { FlashCardReviewSession } from '@/components/flash-card-review-session'
import languages from '@/lib/languages'
import { useDeck } from '@/lib/use-deck'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/learn/$lang/review')({
	component: ReviewPage,
	loader: ({ params: { lang } }) => {
		return {
			navbar: {
				title: `Review ${languages[lang]} cards`,
				icon: 'book-heart',
				contextMenu: [
					{
						name: `Search ${languages[lang]}`,
						to: '/learn/$lang/search',
						params: { lang },
						icon: 'search',
					},
					{
						name: 'Add a phrase',
						to: '/learn/$lang/add-phrase',
						params: { lang },
						icon: 'square-plus',
					},
					{
						name: 'Deck settings',
						to: '/learn/$lang/settings',
						params: { lang },
						icon: 'settings',
					},
				],
			} as NavbarData,
		}
	},
})

function ReviewPage() {
	const { lang } = Route.useParams()
	const { data, isPending } = useDeck(lang)
	if (isPending) return <Loader2 />
	const pidsForReview = shuffle(data.pids)
	return pidsForReview.length === 0 ?
			<Empty lang={lang} />
		:	<FlashCardReviewSession pids={pidsForReview} cardsMap={data.cardsMap} />
}

function shuffle<T>(array: Array<T> | null | undefined): Array<T> {
	if (!(array?.length > 0)) return []
	for (let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
		const randomIndex = Math.floor(Math.random() * (currentIndex + 1))
		let temp = array[currentIndex]
		array[currentIndex] = array[randomIndex]
		array[randomIndex] = temp
	}
	return array
}

const Empty = ({ lang }: { lang: string }) => (
	<Card className="py-6 px-[5%]">
		<CardHeader className="my-6 opacity-70">
			<CardTitle>No cards to review</CardTitle>
		</CardHeader>
		<CardContent className="space-y-4 mb-6">
			<p>
				This is empty because there are no active cards in your{' '}
				{languages[lang]} deck.
			</p>
			<p>
				You can go to the{' '}
				<Link
					className="s-link"
					to="/learn/$lang/search"
					params={{ lang }}
					from={Route.fullPath}
				>
					search page
				</Link>{' '}
				to find new phrases to learn, or{' '}
				<Link
					className="s-link"
					to="/learn/$lang/add-phrase"
					params={{ lang }}
					from={Route.fullPath}
				>
					add your own
				</Link>
				!
			</p>
		</CardContent>
	</Card>
)
