import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/set-new-password')({
  component: () => <div>Hello /_auth/set-new-password!</div>,
})
