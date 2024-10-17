import { NavbarData } from 'types/main'
import languages from './languages'

export function langInfoLoader(lang: string) {
	return {
		navbar: {
			title: `Learning ${languages[lang]}`,
			icon: 'book-heart',
			contextMenu: [
				{
					name: 'Start a review',
					href: './review',
					icon: 'rocket',
				},
				{
					name: 'Add a phrase',
					href: './add-phrase',
					icon: 'square-plus',
				},
				{
					name: `Search ${languages[lang]}`,
					href: './search',
					icon: 'search',
				},
				{
					name: 'Your cards',
					href: './browse',
					icon: 'wallet-cards',
				},
				{
					name: 'Deck settings',
					href: './settings',
					icon: 'settings',
				},
			],
		} as NavbarData,
	}
}
