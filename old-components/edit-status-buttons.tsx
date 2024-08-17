import { useQueryClient, useMutation } from '@tanstack/react-query'
import supabase from 'lib/supabase-client'
import { toast } from 'react-hot-toast'
import { cn } from 'lib/utils'
import { useCard } from 'lib/preload-deck'

const updateCardStatus = async ({ pid, status }) => {
  console.log(`update card status (pid),`, pid, status)
  const { data, error } = await supabase
    .from('user_card')
    .update({
      status,
    })
    .eq('phrase_id', pid)
    .select()
  if (error) throw error
  return data[0]
}

export default function EditCardStatusButtons({ pid }) {
  const queryClient = useQueryClient()
  const card = useCard(pid)?.data
  const updateStatus = useMutation({
    // mutationFn: status => editExistingCard(status, card.id)
    mutationFn: updateCardStatus,
    onSuccess: (data) => {
      toast.success(`Card successfully updated with status: "${data.status}"`)
      // invalidate everything 🤷
      queryClient.invalidateQueries()
    },
  })

  if (card === undefined) return null // pending
  // null should mean 404; {} should probably throw
  if (!card || Object.keys(card)?.length === 0) return '404'

  const isLearned = card?.status === 'learned'
  const isActive = card?.status === 'active'
  const isSkipped = card?.status === 'skipped'

  return (
    <>
      <div className="mx-auto mt-6 flex max-w-80 flex-col justify-center gap-2 @md:flex-row">
        <button
          onClick={() => updateStatus.mutate({ pid, status: 'learned' })}
          className={cn('btn btn-success', isLearned ? 'btn-outline' : '')}
          disabled={updateStatus.isPending || isLearned}
        >
          {isLearned ? 'Finished learning' : 'Mark complete'}
        </button>
        <button
          onClick={() => updateStatus.mutate({ pid, status: 'active' })}
          className={cn('btn btn-info', isActive ? 'btn-outline' : '')}
          disabled={updateStatus.isPending || isActive}
        >
          {isActive ? 'Actively learning' : 'Add to my deck'}
        </button>
        <button
          onClick={() => updateStatus.mutate({ pid, status: 'skipped' })}
          className={cn('btn btn-warning', isSkipped ? 'btn-outline' : '')}
          disabled={updateStatus.isPending || isSkipped}
        >
          Skip this card
        </button>
      </div>
      <div className="mx-auto my-2 text-center text-sm text-base-content/70">
        <p>
          {isLearned && (
            <>
              You&apos;ve marked this card <code>&ldquo;learned&rdquo;</code>{' '}
              (it won&apos;t show up in your daily reviews).
            </>
          )}
          {isActive && <>This card is part of your active deck.</>}
          {isSkipped && (
            <>
              You&apos;ve marked this card <code>&ldquo;skipped&rdquo;</code> so
              you won&apos;t be asked to learn it.
            </>
          )}
          <br />
          Use these buttons to change card status.
        </p>
      </div>
    </>
  )
}
