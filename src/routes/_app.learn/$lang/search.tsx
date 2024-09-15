import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/learn/$lang/search')({
  component: () => <div>Hello /_app/learn/$lang/search!</div>,
})
