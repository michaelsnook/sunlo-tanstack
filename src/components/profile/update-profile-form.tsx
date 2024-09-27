import type { ChangeEvent, FormEvent } from 'react'
import type { QueryError } from '@supabase/supabase-js'
import type { ProfileInsert, ProfileRow, uuid } from 'types/main'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import supabase from 'lib/supabase-client'
import { ShowError } from 'components/errors'
import SelectMultipleLanguagesInput from 'components/select-multiple-languages'
import Loading from 'components/loading'
import { useProfile } from 'lib/use-profile'

import AvatarEditor from './avatar-editor'
import { SelectOneLanguage } from 'components/select-one-language'

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
	initialData: ProfileInsert
	uid: uuid
}

function PrefilledForm({ initialData, uid }: PrefilledFormProps) {
	const queryClient = useQueryClient()

	const [formData, setFormData] = useState<ProfileInsert>(initialData)

	const updateProfile = useMutation<ProfileRow, QueryError>({
		mutationFn: async () => {
			const { data } = await supabase
				.from('user_profile')
				.update(formData)
				.match({ uid })
				.select()
				.throwOnError()
			return data[0]
		},
		onSuccess: () => {
			toast.success(`Successfully updated your profile`)
			queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
		},
	})

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		updateProfile.mutate()
	}

	const setNewAvatarUrl = (val: string) =>
		setFormData({ ...formData, avatar_url: val })
	const setSelectedLanguages = (val: Array<string>) =>
		setFormData({ ...formData, languages_spoken: val })
	const setLanguagePrimary = (val: string) =>
		setFormData({ ...formData, language_primary: val })
	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		})
	}

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<fieldset
				className="grid grid-cols-1 gap-4 sm:grid-cols-2"
				disabled={updateProfile.isPending}
			>
				<div className="flex flex-col">
					<label htmlFor="username" className="px-3 font-bold">
						Your nickname
					</label>
					<input
						id="username"
						name="username"
						type="text"
						className="s-input"
						tabIndex={1}
						defaultValue={formData.username}
						onChange={handleInputChange}
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="language_primary" className="px-3 font-bold">
						Primary language
					</label>
					<SelectOneLanguage
						value={formData.language_primary}
						setValue={setLanguagePrimary}
					/>
				</div>
				<div className="flex flex-col">
					<SelectMultipleLanguagesInput
						selectedLanguages={formData.languages_spoken}
						setSelectedLanguages={setSelectedLanguages}
						except={formData.language_primary}
					/>
				</div>
				<div className="flex flex-col">
					<label className="px-3 font-bold">Profile picture</label>
					<AvatarEditor url={formData.avatar_url} onUpload={setNewAvatarUrl} />
				</div>
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
