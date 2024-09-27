import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_user/profile')({
	component: () => <div>Hello /profile!</div>,
})
