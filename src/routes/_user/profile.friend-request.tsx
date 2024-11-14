import { useCallback, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useDebounce, usePrevious } from '@uidotdev/usehooks'
import { Loader2, PlusIcon, Search, Send, X } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Callout from '@/components/ui/callout'
import { AvatarIconRow } from '@/components/ui/avatar-icon'
import { useFriendsInvited } from '@/lib/friends'
import Loading from '@/components/loading'
import {
	FriendRequestAction,
	FriendRequestActionInsert,
	PublicProfile,
	uuid,
} from '@/types/main'
import supabase from '@/lib/supabase-client'
import { useAuth } from '@/lib/hooks'
import { ShowError } from '@/components/errors'
import { Garlic } from '@/components/garlic'
import { Label } from '@/components/ui/label'

const SearchSchema = z.object({
	query: z.string().optional(),
	lang: z.string().optional(),
})

export const Route = createFileRoute('/_user/profile/friend-request')({
	component: FriendRequestPage,
	validateSearch: (search) => SearchSchema.parse(search),
})

function FriendRequestPage() {
	return (
		<main className="flex flex-col gap-6">
			<PendingRequestsSection />
			<SearchProfiles />
		</main>
	)
}

export default function SearchProfiles() {
	const { query } = Route.useSearch()
	const debouncedQuery = useDebounce(query, 500)
	const queryClient = useQueryClient()
	const navigate = useNavigate({ from: Route.fullPath })
	const { userId } = useAuth()
	const setQueryInputValue = (val: string) =>
		navigate({
			search: (old) => ({
				...old,
				query: val ? val : undefined,
			}),
			replace: true,
			params: true,
		})

	const searchAsync = useCallback(async (): Promise<PublicProfile[]> => {
		if (!debouncedQuery) return null
		const { data } = await supabase
			.from('public_profile')
			.select('uid, username, avatar_url')
			.ilike('username', `%${debouncedQuery}%`)
			.limit(10)
			.throwOnError()
		return data || []
	}, [debouncedQuery])
	console.log(`debouncedQuery`, debouncedQuery)

	const {
		data: searchResults,
		error,
		isFetching,
	} = useQuery({
		queryKey: ['public_profile', 'search', debouncedQuery],
		queryFn: searchAsync,
		enabled: debouncedQuery?.length > 0,
	})

	const prevResults = usePrevious(searchResults)
	const resultsToShow =
		!debouncedQuery ? [] : (searchResults ?? prevResults ?? [])
	const showLoader = resultsToShow.length === 0 && isFetching ? true : false

	const invite = useMutation({
		mutationFn: async (friendId: string) => {
			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (!user) throw new Error('User not authenticated')

			const { data } = await supabase
				.from('friend_request_action')
				.insert({
					uid_from: userId,
					uid_to: friendId,
					action_type: 'requested',
				})
				.throwOnError()
			return data
		},
		onSuccess: () => {
			toast.success('Friend request sent successfully')
			void queryClient.invalidateQueries({
				queryKey: ['user', 'friend_invited'],
			})
		},
		onError: (error) => {
			toast.error('Failed to send friend request')
			console.log(`Error requesting friendship`, error)
		},
	})

	return (
		<Card className="min-h-[21rem]">
			<CardHeader>
				<CardTitle>
					<div className="flex flex-row justify-between items-center">
						<span>Search for friends</span>
						<Link
							to="/profile/friend-invite"
							aria-disabled="true"
							className={buttonVariants({ size: 'badge', variant: 'outline' })}
						>
							<Send className="h-3 w-3" /> <span className="me-1">Invite</span>
						</Link>
					</div>
				</CardTitle>
				<CardDescription>
					Search to find friends on Sunlo, and connect.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<form
						className="flex flex-row gap-2 items-end"
						onSubmit={(e) => {
							e.preventDefault()
							e.stopPropagation()
						}}
					>
						<div className="w-full">
							<Label>Username</Label>
							<Input
								placeholder="Search by username"
								value={query || ''}
								onChange={(event) => {
									void setQueryInputValue(event.target.value)
								}}
								autoFocus
							/>
						</div>
						<Button disabled={isFetching}>
							<Search />
							<span className="hidden @md:block">Search</span>
						</Button>
					</form>

					{debouncedQuery === undefined ?
						<p className="italic opacity-60 py-[1.75rem]">Search results...</p>
					:	<div className="space-y-2">
							<ShowError>{error?.message}</ShowError>
							{showLoader ?
								<div className="h-20 flex justify-center items-center opacity-50">
									<Loader2 />
								</div>
							: !(resultsToShow?.length > 0) ?
								<Callout variant="ghost">
									<Garlic size={32} />
									<div className="ms-4 space-y-4">
										<p>No users match that search.</p>
										<p>
											<Link
												className={buttonVariants({ variant: 'secondary' })}
												to="/profile/friend-invite"
												from={Route.fullPath}
											>
												Invite a friend to Sunlo
											</Link>
										</p>
									</div>
								</Callout>
							:	resultsToShow.map((profile) => (
									<Callout key={profile.uid}>
										<AvatarIconRow {...profile}>
											<Button
												onClick={() => invite.mutate(profile.uid)}
												size="icon"
												className="p-1 h-8 w-8"
												variant={invite.isError ? 'destructive' : 'secondary'}
												disabled={invite.isError}
											>
												{invite.isPending ?
													<Loader2 className="opacity-50" />
												:	<PlusIcon />}
											</Button>
										</AvatarIconRow>
									</Callout>
								))
							}
						</div>
					}
				</div>
			</CardContent>
		</Card>
	)
}

function PendingRequestsSection() {
	const queryClient = useQueryClient()
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
			void queryClient.invalidateQueries({
				queryKey: ['user', 'friend_invited'],
			})
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
				<CardTitle>Pending requests</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{isPending ?
					<Loading />
				: data.length === 0 ?
					<p>You don't have any requests pending at this time.</p>
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
