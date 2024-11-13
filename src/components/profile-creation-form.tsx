import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { ProfileFull, ProfileInsert } from '@/types/main'
import { LanguagePrimaryField, UsernameField } from './fields'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/lib/supabase-client'
import toast from 'react-hot-toast'

const formSchema = z.object({
	username: z
		.string()
		.min(3, 'Username should be at least 3 characters')
		.max(20, 'Username should be at most 20 characters'),
	language_primary: z
		.string()
		.length(3, { message: 'Please select a language' }),
})

type FormData = z.infer<typeof formSchema>

export default function ProfileCreationForm({
	userId,
	profile,
	proceed,
}: {
	userId: string
	profile: ProfileFull
	proceed: () => Promise<void>
}) {
	const queryClient = useQueryClient()

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: profile.username || '',
			language_primary: profile.language_primary || '',
		},
	})

	const mainForm = useMutation({
		mutationKey: ['user', 'profile'],
		mutationFn: async (values: ProfileInsert) => {
			const { data } = await supabase
				.from('user_profile')
				.upsert(values)
				.match({ uid: userId })
				.throwOnError()
				.select()
			return data
		},
		onSuccess: async (data) => {
			console.log(`Success! deck, profile`, data)
			toast.success('Success!')
			await queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
			void proceed()
		},
		onError: (error) => {
			console.log(`Error:`, error)
			toast.error(`there was some error: ${error.message}`)
		},
	})

	return (
		<div className="max-w-xl space-y-8 mx-auto">
			<form onSubmit={handleSubmit(mainForm.mutate)} className="space-y-6">
				<UsernameField register={register} error={errors.username} />
				<LanguagePrimaryField
					control={control}
					error={errors.language_primary}
				/>
				<div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
					<Button type="submit" className="w-full sm:w-auto">
						Confirm and get started!
					</Button>
					{profile.uid === '' ? null : (
						<Button
							type="button"
							variant="outline"
							className="w-full sm:w-auto"
							onClick={() => reset()}
						>
							Reset form
						</Button>
					)}
				</div>
			</form>
		</div>
	)
}
