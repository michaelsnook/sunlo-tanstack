import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/learn/quick-search')({
  component: () => <div>Hello /_app/learn/quick-search!</div>,
})
