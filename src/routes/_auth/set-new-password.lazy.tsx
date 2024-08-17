import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/set-new-password')({
  component: () => <div>Hello /_auth/set-new-password!</div>,
})
