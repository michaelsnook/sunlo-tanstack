import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/learn/$lang/settings')({
  component: () => (
    <div>
      Hello /learn/$lang/settings! are you in travel mode or family mode or
      what?
    </div>
  ),
})
