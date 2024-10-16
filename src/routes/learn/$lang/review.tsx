import { createFileRoute } from '@tanstack/react-router'
import { FlashCardReviewSession } from 'components/flash-card-review-session'
import Loading from 'components/loading'
import languages from 'lib/languages'
import { useDeck } from 'lib/use-deck'
import { NavbarData } from 'types/main'

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
						href: '../search',
						icon: 'search',
					},
					{
						name: 'Add a phrase',
						href: './add-phrase',
						icon: 'square-plus',
					},
					{
						name: 'Deck settings',
						href: './settings',
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
	return isPending ? <Loading /> : <FlashCardReviewSession />
}
