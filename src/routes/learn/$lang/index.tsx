import { createFileRoute, Link } from '@tanstack/react-router'
import Loading from 'components/loading'
import languages from 'lib/languages'
import SectionTranslations from 'components/translations-section'
import TinyPhrase from 'components/tiny-phrase'
import { FriendshipRow, NavbarData, uuid } from 'types/main'
import { useDeck, useDeckMeta } from 'lib/use-deck'
import { useLanguage } from 'lib/use-language'
import { useProfile } from 'lib/hooks'
import ModalWithOpener from 'components/modal-with-opener'
import { Button } from 'components/ui/button'

export const Route = createFileRoute('/learn/$lang/')({
  component: Page,
  loader: ({ params: { lang } }) => {
    return {
      navbar: {
        title: `Learning ${languages[lang]}`,
        icon: 'book-heart',
        contextMenu: [
          {
            name: 'Start a review',
            href: './review',
            icon: 'rocket',
          },
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
      <p className="italic opacity-80">
        This is meant as a place to just get the user going. They need to feel
        comfortable and be reminded of the resources they have to lean on and
        their motivations, but time on task is one of the most important
        factors, so we are really just trying to push them toward starting a
        "review" session.
      </p>
      <Button variant="action" asChild>
        <Link to="./review">Time To Start Today&apos;s Deck</Link>
      </Button>

      <div className="space-y-4">
        {!lang ?
          <Loading />
        : <>
            <FriendsSection lang={lang} />
            <DeckSettings lang={lang} />
            <DeckFullContents lang={lang} />
          </>
        }
      </div>
    </main>
  )
}

// TODO: these inputs don't do anything.
// use https://v0.dev/chat/PNg3tT-DSoC for deck mode
function DeckSettings({ lang }) {
  const deck = useDeckMeta(lang)

  return (
    <div className="border-dashed border rounded my-4 space-y-4">
      <div>
        <h2 className="h3">Deck Settings</h2>
        <p className="opacity-60 -mt-2 text-sm">
          Delete your deck? Pause it? Change modes? Set goals? Travel dates
          coming up?
        </p>
      </div>
      <div>
        <p>What mode are you in? tavel? friends?</p>
        <div>
          <div className="flex flex-row gap-2 items-center">
            <input type="radio" value="1" />
            <label>Friends & Coworkers</label>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <input type="radio" value="2" defaultChecked={true} />
            <label>Family Connections</label>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <input type="radio" value="3" />
            <label>Upcoming Visit</label>
          </div>
        </div>
      </div>
      <div>
        <p>Pause your deck maybe</p>
        <div className="flex flex-row gap-2 items-center">
          <input type="radio" value="2" defaultChecked={true} />
          <label>This deck is active</label>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <input type="radio" value="3" />
          <label>Deactivate it</label>
        </div>
      </div>
    </div>
  )
}

function DeckFullContents({ lang }) {
  const deck = useDeck(lang)
  const language = useLanguage(lang)
  return (
    <div className="border-dashed border rounded my-4 space-y-4">
      <div>
        <h2 className="h3">Deck Details</h2>
        <p className="opacity-60 -mt-2 text-sm">
          (an excrutiating level of detail actually)
        </p>
      </div>
      <div>
        <div>
          deck is{' '}
          <ModalWithOpener title="Deck Details">
            {JSON.stringify(deck.data?.meta, null, 2)}
          </ModalWithOpener>
        </div>
        <div>
          language is{' '}
          <ModalWithOpener title="Language Details">
            {JSON.stringify(language.data?.meta, null, 2)}
          </ModalWithOpener>
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
    <div className="border-dashed border rounded my-4">
      <div className="mb-4">
        <h2 className="h3">Your Friends</h2>
        <p className="opacity-60 -mt-2 text-sm">
          (ppl helping the user learn this language)
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
