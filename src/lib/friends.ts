import { useMutation, useQuery } from '@tanstack/react-query'
import supabase from './supabase-client'
import { PublicProfile, PublicProfileFull } from '@/types/main'
import { useAuth } from './hooks'
import { mapArray } from './utils'

export const usePublicProfileSearch = () =>
	useMutation({
		mutationKey: ['profiles', 'search'],
		mutationFn: async (terms: string) => {
			const { data } = await supabase
				.from('public_profile')
				.select()
				.ilike('username', terms)
				.throwOnError()
			return data as Array<PublicProfile>
		},
	})

type FriendSummariesFull = {
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
