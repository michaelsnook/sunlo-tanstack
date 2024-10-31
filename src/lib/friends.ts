import { useMutation, useQuery } from '@tanstack/react-query'
import supabase from './supabase-client'
import { PublicProfile } from '@/types/main'
import { useAuth } from './hooks'
import { z } from 'zod'

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

export const useFriendsInvited = () => {
	const { userId } = useAuth()
	return useQuery({
		queryKey: ['user', 'friend_invited', userId],
		queryFn: async () => {
			const { data } = await supabase
				.from('friend_request_action_recent')
				.select('*, friend:public_profile!friend_request_action_uid_to_fkey(*)')
				.eq('action_type', 'requested')
				.throwOnError()
			return data
		},
	})
}

// const actionsFrom = z.enum(['requested', 'cancelled', 'ended'])
// const actionsTo = z.enum(['rejected', 'accepted', 'ended'])

const GenericActionSchema = z.object({
	uid_from: z.string().uuid(),
	uid_to: z.string().uuid(),
	// lang: z.string().length(3).optional(),
	// user_deck_id: z.string().uuid(),
	action_type: z.string(),
})

const FriendRequestActionSchema = GenericActionSchema.extend({
	action_type: z.literal('requested'),
})

type FriendRequestSubmission = z.infer<typeof FriendRequestActionSchema>

export const useFriendRequestSend = () => {
	const { userId: uid_from } = useAuth()
	return useMutation({
		mutationKey: ['user', 'friends', 'request_action'],
		mutationFn: async (values: FriendRequestSubmission) => {
			const { data } = await supabase
				.from('friend_request_action') // this instead needs to be some RPC function
				.insert({ ...values, uid_from })
				.select()
				.throwOnError()
			return data[0]
		},
	})
}
