import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Check, Loader2, Send, ThumbsUp, X } from 'lucide-react'

import type { PublicProfileFull, FriendRequestActionInsert } from '@/types/main'
import { Button } from '@/components/ui/button'
import { AvatarIconRow } from '@/components/ui/avatar-icon'
import supabase from '@/lib/supabase-client'
import { useAuth } from '@/lib/hooks'

export function ProfileWithRelationship({
	otherPerson,
}: {
	otherPerson: PublicProfileFull
}) {
	const { userId } = useAuth()
	const [uid_less, uid_more] = [userId, otherPerson.uid].sort()
	const queryClient = useQueryClient()
	const inviteResponseMutation = useMutation({
		mutationKey: ['user', 'friend_request_action'],
		mutationFn: async (action_type: string) => {
			await supabase
				.from('friend_request_action')
				.insert({
					uid_less,
					uid_more,
					uid_by: userId,
					uid_for: otherPerson.uid,
					action_type,
				} as FriendRequestActionInsert)
				.throwOnError()
		},
		onSuccess: (_, variable) => {
			if (variable === 'invite') toast.success('Friend request sent 👍')
			if (variable === 'accept')
				toast.success('Accepted invitation. You are now connected 👍')
			if (variable === 'decline') toast('Declined this invitation')
			if (variable === 'cancel') toast('Cancelled this invitation')
			if (variable === 'remove') toast('You are no longer friends')
			void queryClient.invalidateQueries({
				queryKey: ['user', 'friends', 'summaries'],
			})
		},
		onError: (error, variables) => {
			console.log(
				`Something went wrong trying to modify your relationship:`,
				error,
				variables
			)
			toast.error(`Something went wrong with this interaction`)
		},
	})

	return (
		<AvatarIconRow {...otherPerson}>
			<div className="flex flex-row gap-2">
				{inviteResponseMutation.isPending ?
					<span className="h-8 w-8 rounded-full p-1">
						<Loader2 className="w-6 h-6" />
					</span>
				: inviteResponseMutation.isSuccess ?
					<span className="bg-green-600 h-8 w-8 rounded-full p-1">
						<Check className="text-white w-6 h-6" />
					</span>
				: (
					!otherPerson.friend_summary ||
					otherPerson.friend_summary.status === 'unconnected'
				) ?
					<Button
						variant="default"
						className="w-8 h-8"
						size="icon"
						title="Send friend request"
						onClick={() => inviteResponseMutation.mutate('invite')}
					>
						<Send className="w-6 h-6 mr-[0.1rem] mt-[0.1rem]" />
					</Button>
				: (
					otherPerson.friend_summary?.status === 'pending' &&
					userId === otherPerson.friend_summary?.most_recent_uid_for
				) ?
					<>
						<Button
							variant="default"
							className="w-8 h-8"
							size="icon"
							title="Accept pending invitation"
							onClick={() => inviteResponseMutation.mutate('accept')}
						>
							<ThumbsUp />
						</Button>
						<Button
							variant="secondary"
							className="w-8 h-8"
							size="icon"
							title="Decline pending invitation"
							onClick={() => inviteResponseMutation.mutate('decline')}
						>
							<X className="w-6 h-6 p-0" />
						</Button>
					</>
				: (
					otherPerson.friend_summary?.status === 'pending' &&
					userId === otherPerson.friend_summary?.most_recent_uid_by
				) ?
					<Button
						variant="secondary"
						className="w-8 h-8"
						size="icon"
						title="Cancel friend request"
						onClick={() => inviteResponseMutation.mutate('cancel')}
					>
						<X className="w-6 h-6 p-0" />
					</Button>
				: otherPerson.friend_summary.status === 'friends' ?
					<Button
						variant="secondary"
						className="w-8 h-8"
						size="icon"
						title="Disconnect from this person (you will lose access to each other's decks)"
						onClick={() => inviteResponseMutation.mutate('remove')}
					>
						<X className="w-6 h-6 p-0" />
					</Button>
				:	<> status is null for some reason</>}
			</div>
		</AvatarIconRow>
	)
}
