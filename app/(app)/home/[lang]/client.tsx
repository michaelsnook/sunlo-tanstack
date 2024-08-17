'use client'

import ShowError from 'components/show-error'
import { notFound } from 'next/navigation'
import { useProfile } from 'app/data/hooks'
import { useRecentReviews } from 'app/data/reviews'
import Loading from 'components/loading'
import languages from 'lib/languages'
// nextjs: import Link from 'next/link'

const RecentReviewsSummary = ({ deck }) => {
  const count_reviews_7d = deck.count_reviews_7d
  const count_reviews_7d_positive = deck.count_reviews_7d_positive

  return (
    <div className="card-body bg-base-200 text-base-content">
      <div className="card-title">Review flash cards</div>
      {count_reviews_7d > 5 &&
        `You've been studying ${count_reviews_7d > 40 ? 'a lot!' : ' – '}`}{' '}
      I see {count_reviews_7d} cards reviewed in the last week
      {count_reviews_7d_positive > 0 &&
        ` and you remembered ${count_reviews_7d_positive} of them`}
      . Keep at it!
    </div>
  )
}

const CardsSummary = ({ deck }) => {
  const { cards_active, cards_learned } = deck
  const cardsInDeck = cards_active + cards_learned
  const beHappy = cards_learned > 5
  return (
    <div className="card-body bg-base-200 text-base-content">
      <div className="card-title">Manage your deck</div>
      You have:
      <ul className="ml-2 block">
        <li>🎴 {cardsInDeck} cards in your deck</li>
        <li>🤓 studying {cards_active} currently</li>
        <li>
          🎊 and you&apos;ve learned {cards_learned + ' '}
          of them{beHappy ? '!' : '.'}
        </li>
      </ul>
    </div>
  )
}

export default function Client({ lang }) {
  const { data, error, isPending } = useProfile()
  const language = languages[lang]
  if (typeof language !== 'string') notFound()

  if (isPending) return <Loading />
  if (error) return <ShowError>{error.message}</ShowError>

  const deck = data?.deck_stubs?.find((d) => d.lang === lang) || null

  return (
    <>
      {deck === null ?
        <p>
          Are you sure you&apos;re learning this language? To create a deck and{' '}
          <Link className="s-link" href="/my-decks/new">
            start learning {language}, click here
          </Link>
          .
        </p>
      : <div className="grid max-w-[44rem] gap-6">
          <div className="card glass">
            <figure>
              <RecentReviewsSummary deck={deck} />
            </figure>
            <div className="card-body">
              <Link href={`/review/${lang}`} className="btn btn-lg">
                Start a review session
              </Link>
            </div>
          </div>

          <div className="card glass">
            <figure>
              <CardsSummary deck={deck} />
            </figure>
            <div className="card-body">
              <Link href={`/my-decks/${lang}`} className="btn btn-lg">
                Browse/manage your deck
              </Link>
            </div>
          </div>
        </div>
      }
    </>
  )
}
