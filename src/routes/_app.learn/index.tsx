import { createFileRoute, Link } from '@tanstack/react-router'
import { profileQuery } from 'lib/hooks'
import languages from 'lib/languages'
import Loading from 'components/loading'
import { useQuery } from '@tanstack/react-query'
import Navbar from 'components/navbar'
import { LinkType } from 'types/main'

export const Route = createFileRoute('/_app/learn/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(profileQuery),
  component: Page,
})

export default function Page() {
  const { data: profile, isPending } = useQuery(profileQuery)

  const contextMenu: Array<LinkType> = [
    {
      name: 'New Deck',
      // TODO: Definitely don't keep using this built-in type; use the Router's link opts type
      href: '/learn/add-deck',
      // TODO: passing these props from here is wrong; the Navbar or Menu components should handle this
      icon: 'folder-plus',
    },
  ]

  return (
    <>
      <Navbar
        title={`Your Language Decks`}
        subtitle={
          profile?.decks?.length ?
            `${profile?.decks?.length} active decks`
          : null
        }
        contextMenu={contextMenu}
      />
      <main className="flex flex-col gap-4 p-2">
        {isPending ?
          <Loading />
        : <ol>
            {profile?.decks?.map((deck) => (
              <li
                key={deck.lang}
                className="glass my-2 rounded p-2 text-center"
              >
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
    </>
  )
}
