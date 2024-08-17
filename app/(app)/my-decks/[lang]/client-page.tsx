'use client'

import { useState } from 'react'
import Loading from 'components/loading'
import ShowError from 'components/show-error'
import { usePidsByStatus } from 'app/data/hooks'
import { Garlic } from 'components/garlic'
import Card from 'components/card'
import Browse from './browse'
// nextjs: import Link from 'next/link'
import { cn } from 'lib/utils'
import { useLanguagePhrases } from 'lib/preload-language'
import { uuid } from 'types/main'
import { useDeckQuery } from 'lib/preload-deck'

const Empty = () => (
  <p className="my-4 text-base-content/70">🧄 No cards here 🥦 (yet)</p>
)
const BrandNew = () => {
  return (
    <div>
      <div className="flex flex-row">
        <Garlic className="mx-4" />
        <h2 className="h2">It looks like this is a brand new deck!</h2>
      </div>

      <p className="my-4">
        You can get started by browsing the phrases we already have in the
        library...
      </p>

      <Browse />
    </div>
  )
}
export default function ClientPage({ lang }) {
  const [tab, setTab] = useState('active')
  const { data: phrases, isPending: isPendingC } = useLanguagePhrases()
  const { data: deck, isPending: isPendingB } = useDeckQuery(lang)
  // the only reason we need this old query is for the pids-by-status
  const {
    data: pidsByStatus,
    error,
    isPending: isPendingA,
  } = usePidsByStatus(lang)

  if (error) return <ShowError>{error.message}</ShowError>
  if (isPendingA || isPendingB || isPendingC) return <Loading />
  if (deck.pids.length === 0) return <BrandNew />

  // console.log(`deck data client page`, deckData)
  // at this point data is loaded, the deck is present, there are
  // one or more cards in it.

  return (
    <div>
      <div className="tabs tabs-bordered">
        <a
          className={cn('tab', tab === 'active' ? 'tab-active' : '')}
          onClick={() => setTab('active')}
        >
          Active cards
        </a>
        <a
          className={cn('tab', tab === 'learned' ? 'tab-active' : '')}
          onClick={() => setTab('learned')}
        >
          Learned phrases
        </a>
        <a
          className={cn('tab', tab === 'skipped' ? 'tab-active' : '')}
          onClick={() => setTab('skipped')}
        >
          Skipped
        </a>
        <a
          className={cn('tab', tab === 'browse' ? 'tab-active' : '')}
          onClick={() => setTab('browse')}
        >
          Browse phrases...
        </a>
      </div>
      <div>
        {tab === 'browse' ?
          <Browse disable={deck.pids} />
        : !(pidsByStatus[tab]?.length > 0) ?
          <Empty />
        : pidsByStatus[tab].map((pid: uuid) => (
            <Link
              href={`/my-decks/${lang}/phrase/${pid}`}
              key={pid}
              className="my-2"
            >
              <Card status={deck.cards[pid]?.status} phrase={phrases[pid]} />
            </Link>
          ))
        }
      </div>
    </div>
  )
}
