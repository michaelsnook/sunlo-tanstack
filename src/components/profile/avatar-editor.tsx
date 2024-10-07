import type { ChangeEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import supabase from 'lib/supabase-client'
import { ShowError } from 'components/errors'
import { Label } from 'components/ui/label'
import { Input } from 'components/ui/input'
import { UploadIcon } from 'lucide-react'

const avatarFullUrl = (fullPath: string): string =>
	`https://hepudeougzlgnuqvybrj.supabase.co/storage/v1/object/public/${fullPath}`

const filenameFromFile = (file: File) => {
	// returns a string like pic-of-my-cat-1a4d06.jpg

	// separate the file extension so we can re-append it at the end 'jpg'
	let nameparts = file.name.split('.')
	const ext = nameparts.pop()

	// rejoin the remaining parts in case of 'pic.of.my.cat.jpg'
	const slug = nameparts.join('.')

	// a hash like '1a4d06' from the image timestamp to track uniqueness
	const timeHash = Math.round(file.lastModified * 0.000001).toString(16)

	const path = `${slug}-${timeHash}.${ext}`
	return path
}

interface AvatarEditorProps {
	url: string
	onUpload: (url: string) => void
}

export default function AvatarEditor({ url, onUpload }: AvatarEditorProps) {
	const sendImage = useMutation({
		mutationFn: async (event: ChangeEvent<HTMLInputElement>) => {
			event.preventDefault()
			console.log(`sendImage.mutate`, event)
			if (!event.target.files || event.target.files.length === 0)
				throw new Error(`There's no file to submit`)
			const file: File = event.target.files[0]
			const filename = filenameFromFile(file)
			const { data, error } = await supabase.storage
				.from('avatars')
				.upload(`${filename}`, file, {
					cacheControl: '3600',
					upsert: true,
				})

			if (error) throw error
			// is the fullPath not working? why the ts error?
			// @@TODO fix extraneous guard
			const path = data['fullPath'] || data.path
			onUpload(avatarFullUrl(path))
			return data
		},
		onSuccess: (data) => {
			console.log(`onSuccess for uploading avatar`, data)
			toast.success(`Avatar uploaded...`)
		},
	})

	return (
		<div className="relative h-40 flex-shrink border border-dashed p-2">
			<Label
				htmlFor="avatarUploadInput"
				className="fit-content relative z-10 flex h-full flex-col rounded text-center"
			>
				{url && (
					<span className="mask mask-circle mx-auto grid h-36 w-36 place-content-center">
						<img
							src={url}
							width="144"
							height="144"
							alt={`Your profile image`}
						/>
					</span>
				)}
				<Input
					className="z-90 absolute bottom-0 left-0 right-0 top-0 opacity-0"
					type="file"
					id="avatarUploadInput"
					name="files[]"
					accept="image/*"
					onChange={sendImage.mutate}
					disabled={sendImage.isPending}
				/>
				<div className="absolute flex h-full flex-col justify-center bg-base-100/50 opacity-0 backdrop-blur hover:opacity-100">
					<p className="text-base-content place-content-center">
						{sendImage.isPending ?
							<>Uploading ...</>
						:	<>
								<UploadIcon className="mx-auto h-6 w-6 mb-2" />
								<span>
									drag & drop an image or click here to browse your files
								</span>
							</>
						}
					</p>
				</div>
			</Label>
			<ShowError show={!!sendImage.error}>
				Error uploading image: {sendImage.error?.message}
			</ShowError>
		</div>
	)
}
