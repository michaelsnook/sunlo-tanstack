import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from 'components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'components/ui/card'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { useFriendsInvited } from 'lib/friends'
import Loading from 'components/loading'
import { User, X } from 'lucide-react'
import supabase from 'lib/supabase-client'
import {
	FriendRequestAction,
	FriendRequestActionInsert,
	uuid,
} from 'types/main'
import { useState } from 'react'

export const Route = createFileRoute('/_user/profile/invite-friend')({
	component: InviteFriendPage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			query: search.query ? String(search.query) : '',
			lang: search.lang ? String(search.lang) : '',
		}
	},
})

function InviteFriendPage() {
	return (
		<main className="flex flex-col gap-6">
			<InviteFriendForm />
			<PendingRequestsSection />
		</main>
	)
}

const inviteFriendSchema = z.object({
	email: z.string().email('Please enter a valid email'),
})
function InviteFriendForm() {
	const { control, handleSubmit } = useForm<z.infer<typeof inviteFriendSchema>>(
		{
			resolver: zodResolver(inviteFriendSchema),
		}
	)
	const queryClient = useQueryClient()

	const inviteRequestMutation = useMutation({
		mutationKey: ['user', 'invite_friend'],
		mutationFn: async (data: z.infer<typeof inviteFriendSchema>) => {
			return new Promise((resolve) => setTimeout(() => resolve(data), 1000))
		},
		onSuccess: () => {
			toast.success('Your friend has been invited to help you learn.')
			queryClient.invalidateQueries({
				queryKey: ['user', 'friend_invited'],
			})
		},
	})

	const onSubmit = handleSubmit((data) => {
		inviteRequestMutation.mutate(data)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Invite a Friend</CardTitle>
				<CardDescription>
					Learn together with a friend who can help you practice.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<Label htmlFor="email">Friend's Email</Label>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									type="email"
									placeholder="Enter your friend's email"
								/>
							)}
						/>
					</div>
					<Button type="submit">Send Invitation</Button>
				</form>
			</CardContent>
		</Card>
	)
}

function PendingRequestsSection() {
	const { data, isPending } = useFriendsInvited()
	const [hiddenRequests, setHiddenRequests] = useState<Array<uuid>>([])
	const addOneHiddenRequest = (uid_to: uuid) =>
		setHiddenRequests((start) => [...start, uid_to])
	const inviteCancelMutation = useMutation({
		mutationKey: ['user', 'cancel_invite_request'],
		mutationFn: async (values: FriendRequestActionInsert) => {
			await supabase.from('friend_request_action').insert(values).throwOnError()
		},
		onSuccess: (_, variables) => {
			toast('Cancelled this friend request')
			// TODO it would be really nice to slide this away, like pass a ref in
			// the mutation context and animate it away
			addOneHiddenRequest(variables.uid_to)
		},
		onError: (error, variables) => {
			console.log(
				`Something went wrong trying to cancel this friend request:`,
				error,
				variables
			)
			toast.error(`Something went wrong; maybe log out and try again`)
		},
	})

	const onClickCancelInvite = (invitate: FriendRequestAction) => {
		inviteCancelMutation.mutate({
			uid_from: invitate.uid_from,
			uid_to: invitate.uid_to,
			action_type: 'cancelled',
		})
	}
	return (
		<Card>
			<CardHeader>
				<CardTitle>Pending friend invites</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{isPending ?
					<Loading />
				: data.length === 0 ?
					<p>You don't have any invites pending at this time.</p>
				:	data.map((invite) => {
						return hiddenRequests.indexOf(invite.uid_to) > -1 ?
								null
							:	<div
									key={invite.uid_to}
									className="flex flex-row justify-between items-center gap-4"
								>
									{invite.friend.avatar_url ?
										<img
											src={invite.friend.avatar_url}
											aria-disabled="true"
											alt={`${invite.friend.username}'s avatar`}
										/>
									:	<User className="bg-foreground/20 rounded-full w-8 h-8 p-1" />
									}
									<p className="me-auto">{invite.friend.username}</p>
									<Button
										variant="secondary"
										className="w-8 h-8"
										size="icon"
										title="Cancel pending invitation"
										onClick={() => onClickCancelInvite(invite)}
									>
										<X className="w-6 h-6 p-0" />
									</Button>
								</div>
					})
				}
			</CardContent>
		</Card>
	)
}
