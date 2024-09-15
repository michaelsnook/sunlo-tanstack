import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/learn/$lang/browse')({
  component: () => <div>Hello /_app/learn/$lang/browse!</div>,
})
