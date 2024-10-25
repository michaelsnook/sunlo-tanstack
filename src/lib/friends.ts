import { useMutation } from '@tanstack/react-query'
import supabase from './supabase-client'
import { PublicProfile, uuid } from '@/types/main'
import { TablesInsert } from '@/types/supabase'
import { useAuth } from './hooks'
import { z } from 'zod'

export const usePublicProfileSearch = useMutation({
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

const actionsFrom = z.enum(['requested', 'cancelled', 'ended'])
const actionsTo = z.enum(['rejected', 'accepted', 'ended'])

const FriendRequestActionGeneric = z.object({
	uid_from: z.string().uuid(),
	uid_to: z.string().uuid(),
})

type FriendRequestActionGenericFormInputs = z.infer<
	typeof FriendRequestActionGeneric
>

export const useFriendRequestSend = () => {
	const { userId: uid_from } = useAuth()
	return useMutation({
		mutationKey: ['user', 'friends', 'request_action'],
		mutationFn: async (values: FriendRequestFormFrom) => {
			const { data } = await supabase
				.from('friend_request_action')
				.insert(values)
		},
	})
}
