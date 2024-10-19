import { createFileRoute, Outlet } from '@tanstack/react-router'
import { NavbarData } from 'types/main'
import languages from 'lib/languages'

export const Route = createFileRoute('/learn/$lang')({
	component: LanguageLayout,
	loader: ({ params: { lang } }) => ({
		navbar: {
			title: `Learning ${languages[lang]}`,
			icon: 'book-heart',
			contextMenu: [
				{
					name: 'Start a review',
					to: '/learn/$lang/review',
					params: { lang },
					icon: 'rocket',
				},
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
					name: 'Browse your cards',
					to: '/learn/$lang/browse',
					params: { lang },
					icon: 'wallet-cards',
				},
				{
					name: 'Deck settings',
					to: '/learn/$lang/deck-settings',
					params: { lang },
					icon: 'settings',
				},
			],
		} as NavbarData,
	}),
})

function LanguageLayout() {
	return (
		<main className="container mx-auto">
			<Outlet />
		</main>
	)
}
