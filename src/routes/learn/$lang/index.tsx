import { createFileRoute, Link } from '@tanstack/react-router'
import Loading from 'components/loading'
import languages from 'lib/languages'
import SectionTranslations from 'components/translations-section'
import TinyPhrase from 'components/tiny-phrase'
import { FriendshipRow, NavbarData, uuid } from 'types/main'
import { useDeck, useDeckMeta } from 'lib/use-deck'
import { useLanguage, useLanguageMeta } from 'lib/use-language'
import { useProfile } from 'lib/hooks'
import MyModal from 'components/modal'
import { useState } from 'react'

export const Route = createFileRoute('/learn/$lang/')({
  component: Page,
  loader: ({ params: { lang } }) => {
    return {
      navbar: {
        title: `Learning ${languages[lang]}`,
        icon: 'book-marked',
        contextMenu: [
          {
            name: 'Add a phrase',
            href: './add-phrase',
            icon: 'square-plus',
          },
          {
            name: `Search ${languages[lang]}`,
            href: './search',
            icon: 'search',
          },
          {
            name: 'Your cards',
            href: './browse',
            icon: 'wallet-cards',
          },
          {
            name: 'Deck settings',
            href: './settings',
            icon: 'settings',
          },
        ],
      } as NavbarData,
    }
  },
})

function Page() {
  const { lang } = Route.useParams()
  return (
    <main className="page-card my-4">
      <p>
        This is way meant as a place to just get started. We are really just
        trying to push you toward starting a "review" session. Time on task is
        one of the most important factors.
      </p>

      <div className="space-y-4">
        {!lang ?
          <Loading />
        : <>
            <FriendsSection lang={lang} />
            <DeckFullContents lang={lang} />
          </>
        }
      </div>
    </main>
  )
}

export default function DeckFullContents({ lang }) {
  const deck = useDeck(lang)
  const language = useLanguage(lang)
  return (
    <div className="space-y-4">
      <div>
        <div>
          deck is{' '}
          <PlusDetailModal>
            {JSON.stringify(deck.data?.meta, null, 2)}
          </PlusDetailModal>
        </div>
        <div>
          language is{' '}
          <PlusDetailModal>
            {JSON.stringify(language.data?.meta, null, 2)}
          </PlusDetailModal>
        </div>
      </div>
      <div className="flex-basis-[20rem] flex flex-shrink flex-row flex-wrap gap-4">
        {deck.data?.pids.map((pid: uuid) => {
          return (
            <div
              key={pid}
              tabIndex={0}
              className="collapse collapse-arrow border border-base-300 bg-base-200"
            >
              <div className="collapse-title text-xl font-medium">
                <div className="inline flex-grow">
                  {deck.data?.cardsMap[pid].status.substring(0, 2)}
                  {'  '}
                  <TinyPhrase {...language.data?.phrasesMap[pid]} />
                </div>
              </div>
              <div className="collapse-content">
                <SectionTranslations phrase={language.data?.phrasesMap[pid]} />
                {/*
                  <SectionSeeAlsos seeAlsos={langItems[pid].relation_pids} />

                  This won't work (yet) bc the structure of this data has changed.
                  We will copy this component, modify it for the new structure, and
                  delete the old one when the pages using it are migrated or retired.
                */}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PlusDetailModal({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)
  const open = () => setIsOpen(true)
  return (
    <>
      <a role="button" onClick={open} className="s-link">
        [see details]
      </a>

      <MyModal isOpen={isOpen} onRequestClose={close}>
        {children}
      </MyModal>
    </>
  )
}

// TODO the database doesn't have friendships yet so this is all mockup-y
// and the type is also mocked
function FriendsSection({ lang }) {
  const profileQuery = useProfile()
  if (profileQuery.data === null) return null

  const friendsThisLanguage =
    profileQuery.data?.friendships?.filter(
      (f: FriendshipRow) => f.helping_with.indexOf(lang) !== -1
    ) || []

  return (
    <div className="card border-dashed border rounded my-4">
      <div>
        <h2 className="h3">Your Friends</h2>
        <p className="opacity-60 -mt-2 text-sm">
          (ppl helping the user learn this language):
        </p>
      </div>
      <ul className="list-disc ml-4">
        <li>mahesh (see recent activity or whatever)</li>
        <li>a-money (you have a new phrase from them)</li>
        <li>j-bhai (nothing special actually)</li>
      </ul>
    </div>
  )
}
