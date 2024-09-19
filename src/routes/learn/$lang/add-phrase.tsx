import { createFileRoute } from '@tanstack/react-router'
import languages from 'lib/languages'
import { NavbarData } from 'types/main'

export const Route = createFileRoute('/learn/$lang/add-phrase')({
	loader: ({ params: { lang } }) => ({
		navbar: {
			title: `Add a new ${languages[lang]} phrase`,
		} as NavbarData,
	}),
	component: () => <div>Hello /_app/learn/$lang/add-phrase!</div>,
})
