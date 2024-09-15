import { createFileRoute, Link } from '@tanstack/react-router'
import Loading from 'components/loading'
import Navbar from 'components/navbar'
import languages from 'lib/languages'
import { useState } from 'react'
import MyModal from 'components/modal'
import SectionTranslations from 'components/translations-section'
import TinyPhrase from 'components/tiny-phrase'
import { uuid } from 'types/main'
import { useDeck, useDeckMeta } from 'lib/use-deck'
import { useLanguage, useLanguageMeta } from 'lib/use-language'

export const Route = createFileRoute('/_app/learn/$lang/')({
  component: Page,
})

function Page() {
  const { lang } = Route.useParams()

  const deckMeta = useDeckMeta(lang)
  const languageMeta = useLanguageMeta(lang)

  const contextMenu = [
    {
      name: 'Add a phrase',
      href: './add-phrase',
      icon: 'square-plus',
    },
    {
      name: `Search ${deckMeta.data?.language}`,
      href: './search',
      icon: 'search',
    },
    {
      name: 'Your cards',
      href: './browse',
      icon: 'wallet-cards',
    },
  ]

  return (
    <>
      <Navbar title={`Learning ${languages[lang]}`} contextMenu={contextMenu} />
      <main className="page-card my-4">
        <p>
          <Link
            from={Route.fullPath}
            to="/learn/$lang"
            params={{ lang: 'hin' }}
          >
            hin
          </Link>{' '}
          |{' '}
          <Link
            from={Route.fullPath}
            to="/learn/$lang"
            params={{ lang: 'tam' }}
          >
            tam
          </Link>
        </p>
        <div>
          {deckMeta.isPending || languageMeta.isPending ?
            <Loading />
          : <ClientPage lang={lang} />}
        </div>
      </main>
    </>
  )
}

export default function ClientPage({ lang }) {
  const deck = useDeck(lang)
  const language = useLanguage(lang)
  console.log(`ALERT!`, deck, language)

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
