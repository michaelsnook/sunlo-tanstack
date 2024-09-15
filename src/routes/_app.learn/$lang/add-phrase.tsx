import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/learn/$lang/add-phrase')({
  component: () => <div>Hello /_app/learn/$lang/add-phrase!</div>,
})
