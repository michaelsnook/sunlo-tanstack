import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
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

export const Route = createFileRoute('/learn/$lang/invite-friend')({
	component: InviteFriendTab,
})

const inviteFriendSchema = z.object({
	email: z.string().email('Please enter a valid email'),
})

function InviteFriendTab() {
	const { control, handleSubmit } = useForm<z.infer<typeof inviteFriendSchema>>(
		{
			resolver: zodResolver(inviteFriendSchema),
		}
	)

	const inviteFriendMutation = useMutation({
		mutationFn: async (data: z.infer<typeof inviteFriendSchema>) => {
			return new Promise((resolve) => setTimeout(() => resolve(data), 1000))
		},
		onSuccess: () => {
			toast.success('Your friend has been invited to help you learn.')
		},
	})

	const onSubmit = handleSubmit((data) => {
		inviteFriendMutation.mutate(data)
	})

	return (
		<main className="flex flex-col gap-6">
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
			<PendingRequestsSection />
		</main>
	)
}

function PendingRequestsSection() {
	const { data, isPending } = useFriendsInvited()
	return (
		<Card>
			<CardHeader>
				<CardTitle>Pending invites</CardTitle>
			</CardHeader>
			<CardContent>
				{isPending ?
					<Loading />
				:	data.map((invite) => {
						return (
							<div className="flex flex-row justify-between items-center gap-2">
								{invite.friend.avatar_url ?
									<img
										src={invite.friend.avatar_url}
										aria-disabled="true"
										alt={`${invite.friend.username}'s avatar`}
									/>
								:	<User className="bg-foreground/20 rounded-full w-8 h-8 p-1" />}
								<p className="me-auto">{invite.friend.username}</p>
								<Button
									variant="secondary"
									className="w-8 h-8"
									size="icon"
									title="Cancel pending invitation"
								>
									<X className="w-6 h-6 p-0" />
								</Button>
							</div>
						)
					})
				}
			</CardContent>
		</Card>
	)
}
