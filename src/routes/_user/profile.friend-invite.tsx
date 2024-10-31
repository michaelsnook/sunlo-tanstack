import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button, buttonVariants } from 'components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'components/ui/card'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { Search, Send } from 'lucide-react'
import { ShowError } from '@/components/errors'

export const Route = createFileRoute('/_user/profile/friend-invite')({
	component: InviteFriendPage,
})

function InviteFriendPage() {
	return (
		<main className="flex flex-col gap-6">
			<InviteFriendForm />
		</main>
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

	const invite = useMutation({
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
		invite.mutate(data)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex flex-row justify-between items-center">
						<span>Invite a Friend</span>
						<Link
							to="/profile/friend-request"
							aria-disabled="true"
							className={buttonVariants({ size: 'badge', variant: 'outline' })}
						>
							<Search className="h-3 w-3" />
							<span className="me-1">Search </span>
						</Link>
					</div>
				</CardTitle>
				<CardDescription>Send an invitation by email.</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit}>
					<fieldset
						className="flex flex-row gap-2 items-end"
						disabled={invite.isPending}
					>
						<div className="w-full">
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
						<Button disabled={invite.isPending}>
							<Send />
							<span className="hidden @md:block">Send</span>
						</Button>
					</fieldset>
				</form>
				<ShowError className="mt-4">{invite.error?.message}</ShowError>
			</CardContent>
		</Card>
	)
}
