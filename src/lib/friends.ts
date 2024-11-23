import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import supabase from './supabase-client'
import { FriendRequestActionInsert, PublicProfileFull, uuid } from '@/types/main'
import { useAuth } from './hooks'
import { mapArray } from './utils'
import toast from 'react-hot-toast'

type FriendSummariesFull = {
	// @@TODO: we should not use PublicProfileFull for this; we should invert the shape to
	// more like { ...relation, profile: publicProfile } or possibly { relation, profile }
	relationsMap: { [key: string]: PublicProfileFull }
	uids: {
		all: Array<string>
		friends: Array<string>
		invited: Array<string>
		invitations: Array<string>
	}
}

export const useRelationsQuery = () => {
	const { userId } = useAuth()
	return useQuery({
		queryKey: ['user', 'friends', 'summaries'],
		queryFn: async () => {
			const { data } = await supabase
				.from('friend_summary')
				.select(
					'*, profile_less:public_profile!friend_request_action_uid_less_fkey(*), profile_more:public_profile!friend_request_action_uid_more_fkey(*)'
				)
				.throwOnError()

			const cleanArray = data.map(
				({ profile_less, profile_more, ...summary }) => {
					const profile =
						userId === profile_less.uid ? profile_more : profile_less
					return { ...profile, friend_summary: summary }
				}
			)
			return {
				relationsMap: mapArray(cleanArray, 'uid'),
				uids: {
					all: cleanArray.map((d) => d.uid),
					friends: cleanArray
						.filter((d) => d.friend_summary.status === 'friends')
						.map((d) => d.uid),
					invited: cleanArray
						.filter(
							({ friend_summary: sum }) =>
								sum.status === 'pending' && sum.most_recent_uid_by === userId
						)
						.map((d) => d.uid),
					invitations: cleanArray
						.filter(
							({ friend_summary: sum }) =>
								sum.status === 'pending' && sum.most_recent_uid_for === userId
						)
						.map((d) => d.uid),
				},
			} as FriendSummariesFull
		},
	})
}

export const useFriendRequestAction = (uid_for: uuid) => {
	const { userId: uid_by } = useAuth()
	const [uid_less, uid_more] = [uid_by, uid_for].sort()
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['user', 'friend_request_action', uid_for],
		mutationFn: async (action_type: string) => {
			await supabase
				.from('friend_request_action')
				.insert({
					uid_less,
					uid_more,
					uid_by,
					uid_for,
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
			void queryClient.invalidateQueries({
				queryKey: ['public_profile', 'search'],
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
}
