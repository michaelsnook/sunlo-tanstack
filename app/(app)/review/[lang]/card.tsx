'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import supabase from 'lib/supabase-client'
import ShowError from 'components/show-error'
import Loading from 'components/loading'
import { toast } from 'react-hot-toast'
import { cn } from 'lib/utils'
import { Tables, TablesInsert } from 'types/supabase'
import { uuid } from 'types/main'
import { useCard } from 'lib/preload-deck'
import { usePhrase } from 'lib/preload-language'

const postReview = async ({
  card_id,
  score,
  prevId,
}): Promise<Tables<'user_card_review'>> => {
  if (!card_id || !score) throw new Error('Invalid review; cannot log')

  let submitData: TablesInsert<'user_card_review'> = {
    score,
    card_id,
  }
  if (prevId) submitData['id'] = prevId

  // console.log(`About to post the review,`, submitData, prevId)

  const { data } = await supabase
    .from('user_card_review')
    .upsert(submitData)
    .select()
    .throwOnError()

  // console.log(`We posted the review,`, data, error)
  return data[0]
}

export default function CardInner({ pid, nextCard, addReview, hidden }) {
  const [isRevealed, setIsRevealed] = useState(false)
  const reveal = () => {
    setIsRevealed(true)
  }
  const phrase = usePhrase(pid)?.data
  const card_id = useCard(pid)?.data?.id

  const { data, error, mutate, isPending } = useMutation({
    mutationFn: ({ score, prevId }: { score: number; prevId?: string }) =>
      postReview({ score, card_id, prevId: data?.id }),
    onSuccess: (result: Tables<'user_card_review'>) => {
      // console.log(`onSuccess firing with`, result)
      addReview(result)
      if (result.score === -2)
        toast('got it', { icon: '👍️', position: 'bottom-center' })
      if (result.score === -1)
        toast('got it', { icon: '👍️', position: 'bottom-center' })
      if (result.score === 1)
        toast('got it', { icon: '👍️', position: 'bottom-center' })
      if (result.score === 2)
        toast.success('got it', { position: 'bottom-center' })
      setTimeout(nextCard, 1500)
    },
  })

  const prevId: uuid = data?.id || ''
  const btnClasses = `grow basis-44`

  return hidden ? null : (
      <div className="card-white">
        <div className="flex flex-col justify-center gap-8 text-center">
          <h2 className="h2 text-center">{phrase?.text}</h2>
          {isPending ?
            <div className="absolute bottom-0 left-0 right-0 top-0 content-center bg-base-100/70">
              <Loading />
            </div>
          : null}
          {error ?
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-base-100/50">
              <ShowError>{error.message}</ShowError>
            </div>
          : null}
          {!isRevealed ?
            <div className="flex justify-center gap-4">
              <button className="btn btn-success" onClick={reveal}>
                Show answer
              </button>
            </div>
          : <>
              <div>
                {phrase?.translations.map((t) => (
                  <p key={t.id}>&ldquo;{t.text}&rdquo;</p>
                ))}
              </div>
              <div className="flex flex-row flex-wrap justify-center gap-2">
                <button
                  className={cn(
                    btnClasses,
                    'btn btn-success',
                    data ? 'btn-outline' : ''
                  )}
                  onClick={() => mutate({ score: 2, prevId })}
                  disabled={data?.score === 2}
                >
                  Nailed it!
                </button>
                <button
                  className={cn(
                    btnClasses,
                    'btn btn-info',
                    data ? 'btn-outline' : ''
                  )}
                  onClick={() => mutate({ score: 1, prevId })}
                  disabled={data?.score === 1}
                >
                  Got it
                </button>
                <button
                  className={cn(
                    btnClasses,
                    'btn btn-warning',
                    data ? 'btn-outline' : ''
                  )}
                  onClick={() => mutate({ score: -1, prevId })}
                  disabled={data?.score === -1}
                >
                  It was hard
                </button>
                <button
                  className={cn(
                    btnClasses,
                    'btn btn-error',
                    data ? 'btn-outline' : ''
                  )}
                  onClick={() => mutate({ score: -2, prevId })}
                  disabled={data?.score === -2}
                >
                  Didn&apos;t get it
                </button>
              </div>
            </>
          }
        </div>
      </div>
    )
}
