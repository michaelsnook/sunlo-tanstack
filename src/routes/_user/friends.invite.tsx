import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Mail, Phone, Search, Send, Share } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShowError } from '@/components/errors'
import supabase from '@/lib/supabase-client'
import { useProfile } from '@/lib/use-profile'

export const Route = createFileRoute('/_user/friends/invite')({
	component: InviteFriendPage,
})

function InviteFriendPage() {
	return (
		<main className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>
						<div className="flex flex-row justify-between items-center">
							<span>Invite a Friend</span>
							<Link
								to="/friends/request"
								aria-disabled="true"
								className={buttonVariants({
									size: 'badge',
									variant: 'outline',
								})}
							>
								<Search className="h-3 w-3" />
								<span className="me-1">Search </span>
							</Link>
						</div>
					</CardTitle>
					<CardDescription>
						Invite a friend to learn with you or to help you learn.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ShareButtons />
				</CardContent>
			</Card>
		</main>
	)
}

function ShareButtons() {
	const canShare = typeof navigator?.share === 'function'
	const [error, setError] = useState<null | DOMException | TypeError>(null)
	const { data: profile } = useProfile()
	const shareData = {
		// url: 'https://sunlo.app/signup',
		text: `Hello friend, I'm learning a language with Sunlo, a social language learning app. Will you join me? https://sunlo.app/signup`,
		title: `Invitation! ${profile?.username} on Sunlo.app`,
	}
	const onClick = (): void => {
		// console.log('sharing...', navigator, navigator?.canShare())
		if (navigator?.share)
			navigator
				.share(shareData)
				.then(() => setError(null))
				.catch((error: DOMException | TypeError) => {
					console.log(
						`Some error has occurred while sharing. It could just be they cancelled the share.`,
						error
					)
					// setError(error)
				})
		else console.log(`not sharing bc not possible`)
	}
	return (
		<div>
			<div className="flex flex-col @md:flex-row gap-2">
				{canShare ?
					<Button size="lg" onClick={onClick}>
						Share <Share />
					</Button>
				:	null}
				<a
					className={buttonVariants({ size: 'lg', variant: 'secondary' })}
					href={`mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text)}`}
				>
					Email <Mail />
				</a>
				<a
					className={buttonVariants({ size: 'lg', variant: 'secondary' })}
					href={`whatsapp://send?text=${encodeURIComponent(shareData.text)}`}
				>
					WhatsApp <Phone className="outline outline-1 rounded-full p-px" />
				</a>
			</div>
			<ShowError>{error?.message}</ShowError>
		</div>
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
	// const queryClient = useQueryClient()

	const invite = useMutation({
		mutationKey: ['user', 'invite_friend'],
		mutationFn: async (values: z.infer<typeof inviteFriendSchema>) => {
			const { data, error } = await supabase.auth.admin.inviteUserByEmail(
				values.email
			)
			if (error) throw error
			return data
		},
		onSuccess: (_, values) => {
			toast.success(`Invitation sent to ${values.email}.`)
			/*void queryClient.invalidateQueries({
				queryKey: ['user', 'friend_invited'],
			})*/
		},
	})

	const onSubmit = handleSubmit((data) => {
		invite.mutate(data)
	})

	return (
		<form onSubmit={onSubmit}>
			<fieldset
				className="flex flex-row gap-2 items-end"
				disabled={invite.isPending}
			>
				<div className="w-full">
					<Label htmlFor="email">Friend's email</Label>
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
			<ShowError className="mt-4">{invite.error?.message}</ShowError>
		</form>
	)
}
