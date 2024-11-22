import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShowError } from '@/components/errors'
import supabase from '@/lib/supabase-client'

const inviteFriendSchema = z.object({
	email: z.string().email('Please enter a valid email'),
})

export function InviteFriendForm() {
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
