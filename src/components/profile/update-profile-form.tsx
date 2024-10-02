import type { uuid } from 'types/main'

import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'

import { toast } from 'react-hot-toast'
import supabase from 'lib/supabase-client'
import { ShowError } from 'components/errors'
import Loading from 'components/loading'
import { useProfile } from 'lib/use-profile'

import AvatarEditor from './avatar-editor'
import SelectMultipleLanguagesInput from 'components/select-multiple-languages'
import { SelectOneLanguage } from 'components/select-one-language'
import { FieldInfo } from 'components/field-info'
import { cn } from 'lib/utils'

const profileEditFormSchema = z.object({
	username: z
		.string()
		.min(3, { message: 'Username must be 3 letters or more' }),
	language_primary: z
		.string()
		.length(1, { message: 'A primary language is required' }),
	languages_spoken: z.array(z.string()),
	avatar_url: z.string().optional(),
})

type ProfileEditForm = z.infer<typeof profileEditFormSchema>

export default function UpdateProfileForm() {
	const { data, isPending, error } = useProfile()
	if (error) return <ShowError>{error.message}</ShowError>
	if (isPending) return <Loading className="mt-0" />

	return data.uid ?
			<PrefilledForm
				initialData={{
					avatar_url: data.avatar_url,
					username: data.username,
					language_primary: data.language_primary,
					languages_spoken: data.languages_spoken,
				}}
				uid={data.uid}
			/>
		:	<></>
}

interface PrefilledFormProps {
	initialData: ProfileEditForm
	uid: uuid
}

function PrefilledForm({ initialData, uid }: PrefilledFormProps) {
	const queryClient = useQueryClient()

	const updateProfile = useMutation({
		mutationFn: async (value: ProfileEditForm) => {
			const { data } = await supabase
				.from('user_profile')
				.update(value)
				.eq('uid', uid)
				.select()
				.throwOnError()
			return data
		},
		onSuccess: () => {
			toast.success(`Successfully updated your profile`)
			queryClient.invalidateQueries({ queryKey: ['user'] })
		},
	})

	const form = useForm({
		defaultValues: initialData,
		onSubmit: ({ value }) => {
			// Do something with form data
			console.log(`submitting`, value)
			updateProfile.mutate(value)
		},
		// Add a validator to support Zod usage in Form and Field
		validatorAdapter: zodValidator(),
		validators: { onSubmit: profileEditFormSchema },
	})

	return (
		<form
			className="space-y-4"
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
				form.handleSubmit()
			}}
		>
			<fieldset
				className="grid grid-cols-1 gap-4 sm:grid-cols-2"
				disabled={updateProfile.isPending}
			>
				<form.Field
					name="username"
					children={(field) => (
						<div className="flex flex-col">
							<label htmlFor="username" className="font-bold">
								Your nickname
							</label>
							<input
								type="text"
								tabIndex={1}
								className={cn(
									's-input',
									!!field.state.meta.errors.length &&
										'border-error outline-error ring-error forcus:ring-error'
								)}
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							<FieldInfo field={field} />
						</div>
					)}
				/>
				<form.Field
					name="language_primary"
					children={(field) => (
						<div className="flex flex-col">
							<label htmlFor="language_primary" className="font-bold">
								Primary language
							</label>
							<SelectOneLanguage
								tabIndex={2}
								value={field.state.value}
								setValue={field.handleChange}
								hasError={!!field.state.meta.errors.length}
							/>
							<FieldInfo field={field} />
						</div>
					)}
				/>
				<form.Field
					name="languages_spoken"
					children={(field) => (
						<div className="flex flex-col">
							<SelectMultipleLanguagesInput
								selectedLanguages={field.state.value}
								setSelectedLanguages={field.handleChange}
								except={field.state.value}
								hasError={!!field.state.meta.errors.length}
							/>
							<FieldInfo field={field} />
						</div>
					)}
				/>
				<form.Field
					name="avatar_url"
					children={(field) => (
						<div className="flex flex-col">
							<label className="font-bold">Profile picture</label>
							<AvatarEditor
								url={field.state.value}
								onUpload={field.handleChange}
							/>
							<FieldInfo field={field} />
						</div>
					)}
				/>
				<div className="flex flex-col-reverse">
					<button
						className="btn btn-primary"
						disabled={updateProfile.isPending}
					>
						Save changes
					</button>
				</div>
				<ShowError show={!!updateProfile.error}>
					Problem updating profile: {updateProfile.error?.message}
				</ShowError>
			</fieldset>
		</form>
	)
}
