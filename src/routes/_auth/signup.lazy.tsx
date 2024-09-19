import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/signup')({
	component: () => <div>Hello /_auth/signup!</div>,
})
