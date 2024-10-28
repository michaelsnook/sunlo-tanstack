import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/lib/hooks'
import languages from '@/lib/languages'
import supabase from '@/lib/supabase-client'
import { useProfile, usePublicProfile } from '@/lib/use-profile'
import { useMutation } from '@tanstack/react-query'

import { createFileRoute } from '@tanstack/react-router'
import { ArrowRightLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { z } from 'zod'

const SearchSchema = z.object({
	uid_from: z.string().uuid(),
	uid_to: z.string().uuid(),
	user_deck_id: z.string().uuid(),
	lang: z.string().length(3),
})

type SearchType = z.infer<typeof SearchSchema>

const AcceptInviteFormSubmissionSchema = SearchSchema.extend({
	action: z.enum(['rejected', 'accepted']),
})

type AcceptInviteFormSubmission = z.infer<
	typeof AcceptInviteFormSubmissionSchema
>

export const Route = createFileRoute('/_user/accept-invite')({
	validateSearch: (search: Record<string, unknown>): SearchType => ({
		uid_from: search.uid_from as string,
		uid_to: search.uid_to as string,
		user_deck_id: search.user_deck_id as string,
		lang: search.lang as string,
	}),
	component: AcceptInvitePage,
})

function AcceptInvitePage() {
	const search = Route.useSearch()
	const { data: learner, isPending } = usePublicProfile(search.uid_from)
	const { data: friend } = useProfile()
	const { userId } = useAuth()
	if (userId !== search.uid_to) console.log(`mismatched logins`)

	const acceptOrRejectMutation = useMutation({
		mutationKey: ['invite', 'accept-or-reject', search.uid_from],
		mutationFn: async ({ action }: { action: 'rejected' | 'accepted' }) => {
			const res = await supabase
				.from('friend_request_action')
				.insert({
					uid_from: search.uid_from,
					uid_to: userId,
					user_deck_id: search.user_deck_id,
					action_type: action,
				})
				.select()
		},
		onSuccess: () => toast.success('Response successful'), // now redirect somewhere?,
		onError: (error) => {
			toast.error('An error has occurred')
			console.log(`The error accepting the friend invite:`, error)
		},
	})
	return (
		<main className="p-2 w-app flex flex-col justify-center h-screen pb-20">
			{isPending ?
				<Loading />
			:	<Card>
					<CardHeader>
						<CardTitle>Accept invite from {learner.username}?</CardTitle>
						<CardDescription>
							You'll be able to see some details about their journey learning{' '}
							{languages[search.lang]}; they won't have any access to your
							private data (unless you invite them to a deck you're working on).
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{learner.avatar_url ?
							<div className="relative flex flex-row h-44 justify-around items-center gap-4 max-w-[400px] mx-auto">
								<img
									src={learner.avatar_url}
									width=""
									className="mx-auto rounded-xl max-w-32 flex-shrink"
									alt={`${learner.username}'s profile picture`}
								/>
								{friend.avatar_url ?
									<>
										<ArrowRightLeft className="opacity-70 mx-auto" />
										<img
											src={learner.avatar_url}
											width=""
											className="mx-auto rounded-xl flex-shrink max-w-32"
											alt={`${learner.username}'s profile picture`}
										/>
									</>
								:	null}
							</div>
						:	null}
						<div className="flex gap-4 flex-row justify-center">
							<Button
								size="lg"
								onClick={() =>
									acceptOrRejectMutation.mutate({ action: 'accepted' })
								}
								disabled={acceptOrRejectMutation.isPending}
							>
								Accept invitation
							</Button>
							<Button
								size="lg"
								variant="secondary"
								onClick={() =>
									acceptOrRejectMutation.mutate({ action: 'rejected' })
								}
								disabled={acceptOrRejectMutation.isPending}
							>
								Ignore
							</Button>
						</div>
					</CardContent>
				</Card>
			}
		</main>
	)
}
