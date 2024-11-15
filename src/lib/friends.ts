import { useMutation, useQuery } from '@tanstack/react-query'
import supabase from './supabase-client'
import { PublicProfile, PublicProfileFull } from '@/types/main'
import { useAuth } from './hooks'

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

export const useFriendSummaries = (
	select: (data: Array<PublicProfileFull>) => Array<PublicProfileFull>
) => {
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

			return data.map(({ profile_less, profile_more, ...summary }) => {
				const profile =
					userId === profile_less.uid ? profile_more : profile_less
				return { ...profile, friend_summary: summary }
			})
		},
		select,
	})
}

export const useFriendsInvited = () => {
	const { userId } = useAuth()
	return useFriendSummaries((data: Array<PublicProfileFull>) =>
		data.filter(
			({ friend_summary: sum }) =>
				sum.status === 'pending' && sum.most_recent_uid_by === userId
		)
	)
}

export const useFriendInvitations = () => {
	const { userId } = useAuth()
	return useFriendSummaries((data: Array<PublicProfileFull>) =>
		data.filter(
			({ friend_summary: sum }) =>
				sum.status === 'pending' && sum.most_recent_uid_for === userId
		)
	)
}

export const useFriends = () => {
	return useFriendSummaries((data: Array<PublicProfileFull>) =>
		data.filter(({ friend_summary: sum }) => sum.status === 'friends')
	)
}
