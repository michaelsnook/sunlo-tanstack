import { ProfileWithRelationship } from '@/components/profile-with-relationship'
import Callout from '@/components/ui/callout'
import { useRelationsQuery } from '@/lib/friends'
import { useProfile, usePublicProfile } from '@/lib/use-profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/friends/request/$uid')({
	component: FriendRequestWithUIDPage,
})

function FriendRequestWithUIDPage() {
	const { data: profile } = useProfile()
	const { uid } = Route.useParams()
	const { data: otherProfile } = usePublicProfile(uid)
	const { data } = useRelationsQuery()

	return !otherProfile || !profile ?
			null
		:	<Callout className="dark">
				<div className="w-full space-y-4">
					<p>
						<strong>Welcome {profile.username}!</strong> You were invited by
						user <em>{otherProfile.username}</em>. Now that you've joined, you
						can send them an invitation to connect.
					</p>
					<Callout>
						<ProfileWithRelationship
							otherPerson={otherProfile}
							relationship={data?.relationsMap?.[uid].friend_summary}
						/>
					</Callout>
					<p>
						Or, use this page to search for friends and get started learning
						together.
					</p>
				</div>
			</Callout>
}
