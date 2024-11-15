import { useCallback } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useDebounce, usePrevious } from '@uidotdev/usehooks'
import { Check, Loader2, Search, Send, ThumbsUp, X } from 'lucide-react'

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
import { useFriendInvitations, useFriendsInvited } from '@/lib/friends'
import Loading from '@/components/loading'
import type {
	PublicProfileFull,
	FriendRequestActionInsert,
	PublicProfile,
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
			<PendingInvitationsSection />
			<PendingRequestsSection />
			<SearchProfiles />
		</main>
	)
}

// we'll use uid_by and uid_for
// uid_by is always the current user

function ViewProfileWithRelationship({
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
				{inviteResponseMutation.isSuccess ?
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

function PendingInvitationsSection() {
	const { data, isPending, error } = useFriendInvitations()

	return (
		<Card>
			<CardHeader>
				<CardTitle>Invitations from friends</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{isPending ?
					<Loading />
				: error ?
					<ShowError>{error.message}</ShowError>
				: !(data?.length > 0) ?
					<p>You don't have any pending invitations at this time.</p>
				:	data.map((person) => (
						<ViewProfileWithRelationship
							key={person.uid}
							otherPerson={person}
						/>
					))
				}
			</CardContent>
		</Card>
	)
}

function PendingRequestsSection() {
	const { data, isPending, error } = useFriendsInvited()

	return (
		<Card>
			<CardHeader>
				<CardTitle>Pending requests</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{isPending ?
					<Loading />
				: error ?
					<ShowError>{error.message}</ShowError>
				: !(data?.length > 0) ?
					<p>You don't have any requests pending at this time.</p>
				:	data.map((person) => (
						<ViewProfileWithRelationship
							key={person.uid}
							otherPerson={person}
						/>
					))
				}
			</CardContent>
		</Card>
	)
}

export default function SearchProfiles() {
	const { query } = Route.useSearch()
	const debouncedQuery = useDebounce(query, 500)
	const navigate = useNavigate({ from: Route.fullPath })
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
							:	resultsToShow.map((person) => (
									<ViewProfileWithRelationship
										key={person.uid}
										otherPerson={person}
									/>
								))
							}
						</div>
					}
				</div>
			</CardContent>
		</Card>
	)
}
