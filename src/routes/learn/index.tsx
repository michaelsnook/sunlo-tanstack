import { createFileRoute, Link } from '@tanstack/react-router'
import { profileQuery } from 'lib/hooks'
import languages from 'lib/languages'
import Loading from 'components/loading'
import { useQuery } from '@tanstack/react-query'
import { NavbarData } from 'types/main'

export const Route = createFileRoute('/learn/')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(profileQuery)
    return {
      navbar: {
        title: `Learning Home`,
        subtitle: `Which deck are we studying today?`,
        icon: 'home',
        contextMenu: [
          {
            name: 'New Deck',
            href: '/learn/add-deck',
            icon: 'folder-plus',
          },
          {
            name: 'Quick search',
            href: '/learn/quick-search',
            icon: 'search',
          },
        ],
      } as NavbarData,
    }
  },
  component: Page,
})

export default function Page() {
  const { data: profile, isPending } = useQuery(profileQuery)

  return (
    <main className="flex flex-col gap-4 px-4">
      {isPending ?
        <Loading />
      : <ol>
          {profile?.decks?.map((deck) => (
            <li key={deck.lang} className="glass my-2 rounded p-2 text-center">
              <Link
                from={Route.fullPath}
                to="./$lang"
                params={{ lang: deck.lang }}
              >
                <p className="py-2 text-xl">{languages[deck.lang]}</p>
              </Link>
            </li>
          ))}
        </ol>
      }
    </main>
  )
}
