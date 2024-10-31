import { useController } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { ErrorLabel, type ControlledFieldProps } from '.'
import { AvatarEditor } from '@/components/profile'

export default function AvatarEditorField({
	control,
	error,
}: ControlledFieldProps) {
	const {
		field: { value, onChange },
	} = useController({ name: 'avatar_url', control })
	return (
		<div className="flex flex-col gap-1">
			<Label className={error ? 'text-destructive' : ''}>Profile picture</Label>
			<AvatarEditor url={value} onUpload={onChange} />
			<ErrorLabel {...error} />
		</div>
	)
}
