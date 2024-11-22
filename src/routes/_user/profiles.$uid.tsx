import { ProfileWithRelationship } from '@/components/profile-with-relationship'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useRelationsQuery } from '@/lib/friends'
import { usePublicProfile } from '@/lib/use-profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/profiles/$uid')({
	component: ProfilePage,
})

function ProfilePage() {
	const { uid } = Route.useParams()
	const { data: profile } = usePublicProfile(uid)
	const { data: relations } = useRelationsQuery()
	const relationship =
		!relations || !uid ? null : relations.relationsMap?.[uid].friend_summary
	return (
		<main className="px-2 py-10">
			<Card>
				<CardHeader>
					<CardTitle>
						{profile.username}
						<span className="opacity-70">'s public profile</span>
					</CardTitle>
					<CardDescription>
						Your friendship status is: {relationship.status || 'unconnected.'}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<ProfileWithRelationship
						otherPerson={profile}
						relationship={relationship}
					/>
					{profile?.avatar_url ?
						<img src={profile.avatar_url} className="rounded" />
					:	null}
				</CardContent>
			</Card>
		</main>
	)
}
