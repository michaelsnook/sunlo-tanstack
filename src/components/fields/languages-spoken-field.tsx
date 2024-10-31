import { Label } from '@/components/ui/label'
import { useController } from 'react-hook-form'
import { ErrorLabel, ControlledFieldProps } from '.'
import SelectMultipleLanguagesInput from '@/components/select-multiple-languages'

export default function LanguagesSpokenField({
	control,
	error,
	primary,
}: ControlledFieldProps & { primary?: string }) {
	const {
		field: { value, onChange },
	} = useController({ name: 'languages_spoken', control })
	return (
		<div className="flex flex-col gap-1">
			<Label
				htmlFor="languages_spoken"
				className={error ? 'text-destructive' : ''}
			>
				Do you know other languages?
			</Label>
			<SelectMultipleLanguagesInput
				selectedLanguages={value}
				setSelectedLanguages={(v) => {
					console.log(`Setting language`, v)
					onChange(v)
				}}
				except={primary}
				// hasError={!!error}
			/>
			<ErrorLabel {...error} />
		</div>
	)
}
