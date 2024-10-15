import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { FieldError, UseFormRegister, FieldValues } from 'react-hook-form'

type FieldSetProps = {
	register: UseFormRegister<FieldValues>
	error: FieldError
}

export default function EmailField({ register, error }: FieldSetProps) {
	return (
		<div>
			<Label htmlFor="email" className={error ? 'text-destructive' : ''}>
				Email
			</Label>
			<Input
				{...register('email')}
				inputMode="email"
				aria-invalid={!!error}
				tabIndex={1}
				type="email"
				className={error ? 'bg-destructive/20' : ''}
				placeholder="email@domain"
			/>
			{!error ? null : (
				<p className="text-sm text-destructive mt-2">{error.message}</p>
			)}
		</div>
	)
}
