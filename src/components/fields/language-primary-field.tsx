import { SelectOneLanguage } from '@/components/select-one-language'
import { Label } from '@/components/ui/label'
import { useController } from 'react-hook-form'
import { ErrorLabel, ControlledFieldProps } from '.'

export default function LanguagePrimaryField({
	control,
	error,
}: ControlledFieldProps) {
	const controller = useController({ name: 'language_primary', control })
	// console.log(`Controller is: `, controller)

	return (
		<div className="flex flex-col gap-1">
			<Label
				htmlFor="language_primary"
				className={error ? 'text-destructive' : ''}
			>
				Primary language
			</Label>
			<SelectOneLanguage
				value={controller.field.value}
				setValue={controller.field.onChange}
				hasError={!!error}
			/>
			<ErrorLabel {...error} />
		</div>
	)
}
