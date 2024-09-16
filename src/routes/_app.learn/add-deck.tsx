import { createFileRoute } from '@tanstack/react-router'
import { NavbarData } from 'types/main'

export const Route = createFileRoute('/_app/learn/add-deck')({
  loader: () => ({
    navbar: {
      title: `Learn a New Language`,
    } as NavbarData,
  }),
  component: () => <div>Hello /_app/learn/add-deck!</div>,
})
