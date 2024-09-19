import { createFileRoute } from '@tanstack/react-router'
import languages from 'lib/languages'
import { NavbarData } from 'types/main'

export const Route = createFileRoute('/learn/$lang/browse')({
	loader: ({ params: { lang } }) => ({
		navbar: {
			title: `Browse ${languages[lang]}`,
		} as NavbarData,
	}),
	component: () => <div>Hello /_app/learn/$lang/browse!</div>,
})
