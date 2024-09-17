import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/learn/$lang/review')({
  component: () => <div>Hello /learn/$lang/review!</div>,
})
