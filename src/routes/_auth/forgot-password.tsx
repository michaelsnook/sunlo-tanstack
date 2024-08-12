import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/forgot-password')({
  component: () => <div>Hello /_auth/forgot-password!</div>,
})
