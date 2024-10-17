import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
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
import { langInfoLoader } from 'lib/reuse-loaders'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { PhraseSearchParams } from 'types/main'
import { z } from 'zod'

export const Route = createFileRoute('/learn/$lang/_tabs/invite-friend')({
	validateSearch: (search: Record<string, unknown>): PhraseSearchParams => {
		return {
			phrase: search.phrase as string | undefined,
		}
	},
	component: InviteFriendTab,
	loader: ({ params: { lang } }) => langInfoLoader(lang),
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

	const inviteFriendMutation = useMutation(
		(data: z.infer<typeof inviteFriendSchema>) => {
			return new Promise((resolve) => setTimeout(() => resolve(data), 1000))
		},
		{
			onSuccess: () => {
				toast.success('Your friend has been invited to help you learn.')
			},
		}
	)

	const onSubmit = handleSubmit((data) => {
		inviteFriendMutation.mutate(data)
	})

	return (
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
	)
}
