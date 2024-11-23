import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
} from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { useDebounce, usePrevious } from '@uidotdev/usehooks'
import { Contact, Loader2, Mail, Search } from 'lucide-react'

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

import { useRelations } from '@/lib/friends'
import type { PublicProfile } from '@/types/main'
import supabase from '@/lib/supabase-client'
import { ShowError } from '@/components/errors'
import { Garlic } from '@/components/garlic'
import { Label } from '@/components/ui/label'
import { ProfileWithRelationship } from '@/components/profile-with-relationship'

const SearchSchema = z.object({
	query: z.string().optional(),
	lang: z.string().optional(),
})

export const Route = createFileRoute('/_user/friends/request')({
	component: FriendRequestPage,
	validateSearch: (search) => SearchSchema.parse(search),
})

function FriendRequestPage() {
	return (
		<main className="flex flex-col gap-6">
			<Outlet />
			<PendingInvitationsSection />
			<SearchProfiles />
		</main>
	)
}

function PendingInvitationsSection() {
	const { data, isPending, error } = useRelations()

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex flex-row justify-between items-center">
						<span>Invitations to connect</span>
						<Link
							to="/friends"
							aria-disabled="true"
							className={buttonVariants({ size: 'badge', variant: 'outline' })}
						>
							<Contact className="h-3 w-3" />{' '}
							<span className="me-1">Friends list</span>
						</Link>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{isPending ?
					<Loader2 />
				: error ?
					<ShowError>{error.message}</ShowError>
				: !(data?.uids.invitations?.length > 0) ?
					<p>You don't have any pending invitations at this time.</p>
				:	data?.uids.invitations.map((uid) => (
						<ProfileWithRelationship
							key={uid}
							uid={uid}
							profile={data?.relationsMap[uid].profile}
						/>
					))
				}
			</CardContent>
		</Card>
	)
}

const searchAsync = async (query: string): Promise<PublicProfile[]> => {
	if (!query) return null
	const { data } = await supabase
		.from('public_profile')
		.select('uid, username, avatar_url')
		.ilike('username', `%${query}%`)
		.limit(10)
		.throwOnError()
	return data || []
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

	const {
		data: searchResults,
		error,
		isFetching,
	} = useQuery({
		queryKey: ['public_profile', 'search', debouncedQuery],
		queryFn: async ({ queryKey }) => searchAsync(queryKey[2]),
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
							to="/friends/invite"
							aria-disabled="true"
							className={buttonVariants({ size: 'badge', variant: 'outline' })}
						>
							<Mail className="h-3 w-3" /> <span className="me-1">Invite</span>
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
												to="/friends/invite"
												from={Route.fullPath}
											>
												Invite a friend to Sunlo
											</Link>
										</p>
									</div>
								</Callout>
							:	resultsToShow.map((profile) => (
									<ProfileWithRelationship
										key={profile.uid}
										uid={profile.uid}
										profile={profile}
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
