import { Check, Handshake, Loader2, Send, ThumbsUp, X } from 'lucide-react'

import type { PublicProfile, PublicProfileFull, uuid } from '@/types/main'
import { Button } from '@/components/ui/button'
import { AvatarIconRow } from '@/components/ui/avatar-icon'
import { ConfirmDestructiveActionDialog } from './confirm-destructive-action-dialog'
import { useFriendRequestAction, useOneRelation } from '@/lib/friends'

export function ProfileWithRelationship({
	uid,
	profile,
}: {
	uid: uuid
	profile: PublicProfile | PublicProfileFull
}) {
	const inviteResponseMutation = useFriendRequestAction(uid)
	const { data: relationship } = useOneRelation(uid)

	return (
		<AvatarIconRow {...profile}>
			<div className="flex flex-row gap-2">
				{inviteResponseMutation.isPending ?
					<span className="h-8 w-8 rounded-full p-1">
						<Loader2 className="w-6 h-6" />
					</span>
				: inviteResponseMutation.isSuccess ?
					<span className="bg-green-600 h-8 w-8 rounded-full p-1">
						<Check className="text-white w-6 h-6" />
					</span>
				: !relationship || relationship.status === 'unconnected' ?
					<Button
						variant="default"
						className="w-8 h-8"
						size="icon"
						title="Send friend request"
						onClick={() => inviteResponseMutation.mutate('invite')}
					>
						<Send className="w-6 h-6 mr-[0.1rem] mt-[0.1rem]" />
					</Button>
				: relationship.status === 'pending' && !relationship.isMostRecentByMe ?
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
						<ConfirmDestructiveActionDialog
							title="Decline this invitation"
							description="Please confirm whether you'd like to decline this invitation"
						>
							<Button
								variant="secondary"
								className="w-8 h-8"
								size="icon"
								title="Decline pending invitation"
							>
								<X className="w-6 h-6 p-0" />
							</Button>
							<Button
								variant="destructive"
								title="Confirm: Cancel friend request"
								onClick={() => inviteResponseMutation.mutate('decline')}
							>
								{inviteResponseMutation.isPending ?
									<Loader2 />
								: inviteResponseMutation.isSuccess ?
									<Check className="text-white w-6 h-6" />
								:	<>Confirm</>}
							</Button>
						</ConfirmDestructiveActionDialog>
					</>
				: relationship?.status === 'pending' && relationship.isMostRecentByMe ?
					<ConfirmDestructiveActionDialog
						title={`Cancel this request`}
						description={`Please confirm whether you'd like to cancel this friend request`}
					>
						<Button
							variant="secondary"
							className="w-8 h-8"
							size="icon"
							title="Cancel friend request"
						>
							<X className="w-6 h-6 p-0" />
						</Button>
						<Button
							variant="destructive"
							title="Confirm: Cancel friend request"
							onClick={() => inviteResponseMutation.mutate('cancel')}
						>
							{inviteResponseMutation.isPending ?
								<Loader2 />
							: inviteResponseMutation.isSuccess ?
								<Check className="text-white w-6 h-6" />
							:	<>Confirm</>}
						</Button>
					</ConfirmDestructiveActionDialog>
				: relationship.status === 'friends' ?
					<Handshake className="w-6 h-6 p-0" />
				:	<> status is null for some reason</>}
			</div>
		</AvatarIconRow>
	)
}
