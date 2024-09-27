import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/profile/change-email')({
	component: () => <div>Hello /_user/profile/change-email!</div>,
})
