import type { pids } from 'types/main'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import Loading from '../src/components/loading'
import { ErrorShow } from '../src/components/errors'
import { postNewCard } from 'app/(app)/my-decks/[lang]/new-card/add-card'
import EditCardStatusButtons from './edit-status-buttons'
import SectionTranslations from './translations-section'
import TinyPhrase from '../src/components/tiny-phrase'
// nextjs: import Link from 'next/link'
import { cn, links } from 'lib/utils'
import { useLang } from 'lib/hooks'
import { useDeckCards, useDeckMeta } from 'lib/preload-deck'
import { useLanguagePhrases, usePhrase } from 'lib/preload-language'

export const AddCardButtonsSection = ({ pid, onClose }) => {
  const queryClient = useQueryClient()
  const lang = useLang()
  const user_deck_id = useDeckMeta(lang)?.data?.id
  const makeNewCard = useMutation({
    mutationFn: (status: string) =>
      postNewCard({
        status,
        phrase_id: pid,
        user_deck_id,
      }),
    onSuccess: (data) => {
      setTimeout(async () => {
        onClose()
      }, 5000)
      toast.success(`Card successfully added with status: "${data.status}"`)
      queryClient.invalidateQueries()
    },
  })
  return (
    <div className="my-6 flex gap-8 text-2xl">
      {makeNewCard.isPending ?
        <Loading />
      : makeNewCard.error ?
        <ErrorShow>{makeNewCard.error.message}</ErrorShow>
      : makeNewCard.isSuccess ?
        <p className="text-lg">
          This phrase is in your deck with status: &ldquo;
          {makeNewCard.data?.status}
          &rdquo;.&nbsp;
          <a className="s-link text-primary" onClick={onClose}>
            Keep browsing.
          </a>
        </p>
      : <>
          <button
            className={`btn btn-success btn-lg ${
              makeNewCard.isPending ? 'loading' : ''
            }`}
            role="button"
            onClick={() => makeNewCard.mutate('active')}
          >
            📖 Learn it!
          </button>
          <button
            className={`btn btn-error btn-lg ${
              makeNewCard.isPending ? 'loading' : ''
            }`}
            role="button"
            onClick={() => makeNewCard.mutate('skipped')}
          >
            ❌ Skip it
          </button>
        </>
      }
    </div>
  )
}

export default function BigPhrase({ phrase_id: pid, onClose, noBox = false }) {
  if (!pid) throw new Error('no phrase info provided')

  // all this work to fetch a phrase and whether it's in my deck.
  // and still in a child component we have to fetch the deck-id.
  // this complexity is due to a few things:
  // 1. no separate hooks to fetch just a card or phrase
  // 1b. could use a single hook to fetch both together somehow
  // 2. should remove card_id in favor of (user_id, phrase_id)
  // 3. should remove deck_id in favor of (user_id, lang)
  const phrase = usePhrase(pid)?.data
  // true, false, or null for not-loaded. assumes deck.cards = [] when empty
  const cards = useDeckCards()?.data
  const hasCard: null | true | false = !cards ? null : !!cards[pid]

  if (phrase === null) throw new Error('no phrase info provided')
  if (phrase === null) return <Loading />

  const relations: pids = phrase?.relation_pids

  // if (phraseError) return <ErrorShow>{phraseError.message}</ErrorShow>

  return (
    <div
      className={cn(
        noBox ? '' : `card inline-block p-6 shadow-lg`,
        'mb-4 w-full'
      )}
    >
      {phrase && hasCard !== null ?
        <>
          <h2 lang={phrase.lang} className="h3 font-bold">
            <TinyPhrase text={phrase.text} />
          </h2>
          <SectionTranslations phrase={phrase} />
          <SectionSeeAlsos relations={relations} />
          {hasCard ?
            <EditCardStatusButtons pid={pid} />
          : <AddCardButtonsSection pid={pid} onClose={onClose} />}
        </>
      : <>could not load this phrase</>}
    </div>
  )
}

export function SectionSeeAlsos({ relations }: { relations: pids }) {
  const phrases = useLanguagePhrases()?.data
  return phrases === undefined ?
      <Loading />
    : <>
        <p className="mt-6 text-sm font-bold text-base-content/70">
          Related phrases
        </p>
        {relations?.length ?
          <ul className="text-xl/9">
            {relations.map((pid) => {
              // more extraneous null-guarding
              const p = phrases[pid] ?? null
              return (
                p && (
                  <li key={pid}>
                    <Link
                      className="group rounded p-2 hover:bg-primary hover:text-white"
                      href={links.deckPhrase(phrases[pid].lang, pid)}
                    >
                      <TinyPhrase {...phrases[pid]} />
                    </Link>
                  </li>
                )
              )
            })}
          </ul>
        : <p className="mt-6">none. Add one?</p>}
      </>
}
