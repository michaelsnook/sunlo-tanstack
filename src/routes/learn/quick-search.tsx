import { createFileRoute } from '@tanstack/react-router'
import { NavbarData } from '@/types/main'

export const Route = createFileRoute('/learn/quick-search')({
	loader: () => ({
		navbar: {
			title: `Quick Search for a Phrase`,
		} as NavbarData,
	}),
	component: () => <div>Hello /_app/learn/quick-search!</div>,
})
