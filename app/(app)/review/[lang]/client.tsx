'use client'

import { useMemo, useState } from 'react'
import languages from 'lib/languages'
import Navbar from 'app/(app)/navbar'
import { usePidsByStatus } from 'app/data/hooks'
import Loading from 'components/loading'
import SuccessCheckmark from 'components/svg-components'
import CardInner from './card'
import { ReviewInsert, pids } from 'types/main'

function shuffle(array: Array<any> | null | undefined): Array<any> {
  if (!(array?.length > 0)) return []
  for (let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1))
    let temp = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temp
  }
  return array
}

const Empty = () => (
  <p>
    This is empty. You don&apos;t have any active cards. go choose some more
    pls.
  </p>
)

export default function ClientPage({ lang }) {
  const { data, isPending } = usePidsByStatus(lang)

  // @@TODO turn these into pids with filters, e.g.
  // queryKey: ['deck', lang, 'pids', { filter }]
  // or just memoize it here...
  const reviewables: pids = useMemo(() => shuffle(data?.active), [data])
  const [cardIndex, setCardIndex] = useState(0)
  const [reviews, setReviews] = useState([])

  if (isPending) return <Loading />
  if (!reviewables.length) return <Empty />

  const canBackup: boolean = cardIndex > 0
  const canAdvance: boolean = cardIndex < reviewables.length - 1
  const gobackaCard = () => setCardIndex((i) => i - 1)
  const advanceCard = () => setCardIndex((i) => i + 1)
  // This is different from advanceCard because it only wants to move forward
  // by 1 after submitting a review, not to stack with button-clicks.
  const nextCard = () => setCardIndex(cardIndex + 1)

  const addReview = (review: ReviewInsert) => {
    const index = reviews.findIndex((r) => r.id === review.id)
    let newReviews = reviews
    if (index === -1) newReviews.push(review)
    else newReviews[index] = review
    setReviews(newReviews)
  }

  return (
    <div className="grid h-full gap-8 pt-10 @lg:pt-0">
      <Navbar
        title={`Reviewing ${languages[lang]} (${cardIndex + 1} out of ${
          reviewables.length
        })`}
      />
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4 @lg:static">
        <button
          className="btn btn-primary"
          onClick={gobackaCard}
          disabled={!canBackup}
        >
          Prev card
        </button>
        <button
          className="btn btn-primary"
          onClick={advanceCard}
          disabled={!canAdvance}
        >
          Next card
        </button>
      </div>
      {cardIndex < reviewables.length ? null : (
        <div className="mx-auto my-10 flex flex-row place-items-center gap-6">
          <SuccessCheckmark />
          <p>All done for the day, nice work!</p>
        </div>
      )}
      {reviewables.map((pid) => (
        <CardInner
          key={pid}
          pid={pid}
          nextCard={nextCard}
          addReview={addReview}
          hidden={pid !== reviewables[cardIndex]}
        />
      ))}
    </div>
  )
}
