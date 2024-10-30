import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import Callout from '@/components/ui/callout'
import { AvatarIconRow } from '@/components/ui/avatar-icon'
import { useFriendsInvited } from 'lib/friends'
import Loading from 'components/loading'
import { Loader2, PlusIcon, Search, X } from 'lucide-react'
import {
	FriendRequestAction,
	FriendRequestActionInsert,
	PublicProfile,
	uuid,
} from 'types/main'
import supabase from 'lib/supabase-client'
import { useAuth } from '@/lib/hooks'
import { useDebounce } from '@/lib/use-debounce'

const SearchSchema = z.object({
	query: z.string().optional(),
	lang: z.string().optional(),
})

export const Route = createFileRoute('/_user/profile/invite-friend')({
	component: InviteFriendPage,
	validateSearch: SearchSchema.parse,
})

function InviteFriendPage() {
	return (
		<main className="flex flex-col gap-6">
			<SearchProfiles />
			<InviteFriendForm />
			<PendingRequestsSection />
		</main>
	)
}

export default function SearchProfiles() {
	const navigate = useNavigate({ from: Route.fullPath })
	const { query } = Route.useSearch()
	const { userId } = useAuth()
	const debouncedSearchTerm = useDebounce(query, 300)

	const {
		data: searchResults,
		isFetching,
		error,
	} = useQuery({
		queryKey: ['searchProfiles', debouncedSearchTerm],
		queryFn: async (): Promise<PublicProfile[]> => {
			if (!debouncedSearchTerm) return []
			const { data, error } = await supabase
				.from('public_profile')
				.select('uid, username, avatar_url')
				.ilike('username', `%${debouncedSearchTerm}%`)
				.limit(10)

			if (error) throw error
			return data || []
		},
		enabled: debouncedSearchTerm?.length > 0,
	})

	const handleInputChange = (value: string) => {
		navigate({
			to: '.',
			search: (prev) => ({ ...prev, query: value }),
			replace: true,
		})
	}

	const requestFriend = async (friendId: string) => {
		const {
			data: { user },
		} = await supabase.auth.getUser()
		if (!user) throw new Error('User not authenticated')

		const { error } = await supabase
			.from('friend_request_action')
			.insert({ uid_from: userId, uid_to: friendId, status: 'requested' })

		if (error) throw error
		toast.success('Friend request sent successfully')
	}

	if (error) {
		toast.error('Failed to search profiles')
	}
	const showLoader: boolean =
		isFetching && (!searchResults || !searchResults.length)

	return (
		<Card className="min-h-64">
			<CardHeader>
				<CardTitle>Search Profiles</CardTitle>
			</CardHeader>
			<CardContent>
				{showLoader ?
					<div className="flex justify-center mt-4">
						<Loader2 className="h-6 w-6 animate-spin" />
					</div>
				:	<div>
						<form className="flex flex-row gap-2">
							<Input
								placeholder="Search by username"
								value={query}
								onChange={(event) => {
									handleInputChange(event.target.value)
								}}
								autoFocus
							/>
							<Button>
								<Search />
								<span className="hidden @md:block">Search</span>
							</Button>
						</form>
						<div className="mt-4 space-y-2">
							{!(searchResults?.length > 0) ?
								<p>
									No users match that search. (You can invite them using the
									form below.)
								</p>
							:	searchResults.map((profile) => (
									<Callout>
										<AvatarIconRow key={profile.uid} {...profile}>
											<Button
												onClick={() => requestFriend(profile.uid)}
												size="icon"
												className="p-1 h-8 w-8"
												variant="secondary"
											>
												<PlusIcon />
											</Button>
										</AvatarIconRow>
									</Callout>
								))
							}
						</div>
					</div>
				}
			</CardContent>
		</Card>
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
							:	<AvatarIconRow {...invite.friend} key={invite.uid_to}>
									<Button
										variant="secondary"
										className="w-8 h-8"
										size="icon"
										title="Cancel pending invitation"
										onClick={() => onClickCancelInvite(invite)}
									>
										<X className="w-6 h-6 p-0" />
									</Button>
								</AvatarIconRow>
					})
				}
			</CardContent>
		</Card>
	)
}
