import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	useFriendRequestAction,
	useOneRelation,
	useRelations,
} from '@/lib/friends'
import { useAuth } from '@/lib/hooks'
import { usePublicProfile } from '@/lib/use-profile'
import { uuid } from '@/types/main'
import { createFileRoute } from '@tanstack/react-router'
import { Check, Loader2, ThumbsUp } from 'lucide-react'

export const Route = createFileRoute('/_user/profiles/$uid')({
	component: ProfilePage,
})

function ProfilePage() {
	const { uid } = Route.useParams()
	const { data: profile, isPending: isPending1 } = usePublicProfile(uid)
	const { data: relations, isPending: isPending2 } = useRelations()
	const relationship = !relations || !uid ? null : relations.relationsMap[uid]
	return (
		<main className="px-2 py-10 max-w-sm mx-auto">
			{isPending1 || isPending2 ?
				<Loader2 className="my-10 mx-auto" />
			:	<Card>
					<CardHeader>
						<CardTitle className="mx-auto">
							{profile?.username}
							<span className="opacity-70">'s public profile</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-center">
						<div className="w-32 h-32 rounded-full bg-foreground/40 mx-auto flex items-center justify-center text-4xl">
							{profile?.avatar_url ?
								<img src={profile.avatar_url} className="rounded-full" />
							:	profile.username[0].toUpperCase()}
						</div>
						<h2 className="text-xl font-semibold">{profile.username}</h2>
						<div>
							<p className="capitalize">
								{relationship?.status ?? 'unconnected'}
							</p>
							<RelationshipActions uid_for={uid} />
						</div>
					</CardContent>
				</Card>
			}
		</main>
	)
}

function RelationshipActions({ uid_for }: { uid_for: uuid }) {
	const { userId } = useAuth()
	const action = useFriendRequestAction(uid_for)
	const { data: relationship } = useOneRelation(uid_for)
	return (
		!userId ? null
		: !relationship?.status || relationship.status === 'unconnected' ?
			<Button onClick={() => action.mutate('invite')}>
				Add friend{' '}
				{action.isPending ?
					<Loader2 />
				:	<ThumbsUp />}
			</Button>
		: relationship.status === 'friends' ?
			<Button>
				Connected <Check /> (unfriend?)
			</Button>
		: relationship.status === 'pending' && !relationship.isMostRecentByMe ?
			<Button onClick={() => action.mutate('accept')}>
				Confirm friends{' '}
				{action.isPending ?
					<Loader2 />
				:	<ThumbsUp />}
			</Button>
		: relationship.status === 'pending' && relationship.isMostRecentByMe ?
			<Button>Awaiting response (cancel?)</Button>
		:	null
	)
}
