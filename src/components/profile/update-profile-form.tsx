import type { uuid } from 'types/main'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import supabase from 'lib/supabase-client'
import { ShowError } from 'components/errors'
import SelectMultipleLanguagesInput from 'components/select-multiple-languages'
import Loading from 'components/loading'
import { useProfile } from 'lib/use-profile'
import AvatarEditor from './avatar-editor'
import { SelectOneLanguage } from 'components/select-one-language'
import Form from 'react-formal'
import * as yup from 'yup'
import { Button } from 'components/ui/button'

const ProfileEditableSchema = yup.object().shape({
	username: yup
		.string()
		.required('Username is required')
		.min(3, 'Username must be at least 3 characters'),
	language_primary: yup.string().required('Primary language is required'),
	languages_spoken: yup
		.array()
		.of(yup.string())
		.min(1, 'Select at least one language'),
	avatar_url: yup.string().url('Invalid URL for avatar'),
})

export default function UpdateProfileForm() {
	const { data, isPending, error } = useProfile()
	if (error) return <ShowError>{error.message}</ShowError>
	if (isPending) return <Loading className="mt-0" />

	return data?.uid ?
			<PrefilledForm
				initialData={{
					avatar_url: data.avatar_url,
					username: data.username,
					language_primary: data.language_primary,
					languages_spoken: data.languages_spoken,
				}}
				uid={data.uid}
			/>
		:	null
}

type ProfileEditable = yup.InferType<typeof ProfileEditableSchema>

interface PrefilledFormProps {
	initialData: ProfileEditable
	uid: uuid
}

function PrefilledForm({ initialData, uid }: PrefilledFormProps) {
	const queryClient = useQueryClient()

	const updateProfile = useMutation<ProfileEditable, Error>({
		mutationFn: async (updatedData: ProfileEditable) => {
			const { data, error } = await supabase
				.from('user_profile')
				.update(updatedData)
				.match({ uid })
				.select()
			if (error) throw error
			return data[0]
		},
		onSuccess: () => {
			toast.success(`Successfully updated your profile`)
			queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
		},
	})

	return (
		<Form
			schema={ProfileEditableSchema}
			defaultValue={initialData}
			onSubmit={updateProfile.mutate}
			className="space-y-4"
		>
			<fieldset
				className="grid grid-cols-1 gap-4 sm:grid-cols-2"
				disabled={updateProfile.isPending}
			>
				<div className="flex flex-col">
					<label htmlFor="username" className="px-3 font-bold">
						Your nickname
					</label>
					<Form.Field name="username" className="s-input" tabIndex={1} />
					<Form.Message for="username" className="text-red-500 text-sm mt-1" />
				</div>
				<div className="flex flex-col">
					<label htmlFor="language_primary" className="px-3 font-bold">
						Primary language
					</label>
					<Form.Field name="language_primary">
						{({ value, onChange }) => (
							<SelectOneLanguage value={value} setValue={onChange} />
						)}
					</Form.Field>
					<Form.Message
						for="language_primary"
						className="text-red-500 text-sm mt-1"
					/>
				</div>
				<div className="flex flex-col">
					<Form.Field name="languages_spoken">
						{({ value, onChange }) => (
							<SelectMultipleLanguagesInput
								selectedLanguages={value}
								setSelectedLanguages={onChange}
								except={initialData.language_primary}
							/>
						)}
					</Form.Field>
					<Form.Message
						for="languages_spoken"
						className="text-red-500 text-sm mt-1"
					/>
				</div>
				<div className="flex flex-col">
					<label className="px-3 font-bold">Profile picture</label>
					<Form.Field name="avatar_url">
						{({ value, onChange }) => (
							<AvatarEditor url={value} onUpload={onChange} />
						)}
					</Form.Field>
					<Form.Message
						for="avatar_url"
						className="text-red-500 text-sm mt-1"
					/>
				</div>
				<div className="flex flex-col-reverse">
					<Form.Submit
						type="submit"
						as={() => (
							<Button variant="default" disabled={updateProfile.isPending}>
								Save changes
							</Button>
						)}
					></Form.Submit>
				</div>
				<ShowError show={!!updateProfile.error}>
					Problem updating profile: {updateProfile.error?.message}
				</ShowError>
			</fieldset>
		</Form>
	)
}
