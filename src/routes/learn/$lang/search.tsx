import type { NavbarData } from 'types/main'
import { createFileRoute } from '@tanstack/react-router'
import languages from 'lib/languages'

export const Route = createFileRoute('/learn/$lang/search')({
	loader: ({ params: { lang } }) => ({
		navbar: {
			title: `Search ${languages[lang]}`,
		} as NavbarData,
	}),
	component: () => <div>Hello /_app/learn/$lang/search!</div>,
})
