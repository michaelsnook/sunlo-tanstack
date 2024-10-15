import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { FieldError, UseFormRegister, FieldValues } from 'react-hook-form'

type FieldSetProps = {
	register: UseFormRegister<FieldValues>
	error: FieldError
}

export default function PasswordField({ register, error }: FieldSetProps) {
	return (
		<div>
			<Label className={error ? 'text-destructive' : ''} htmlFor="password">
				Password
			</Label>
			<Input
				{...register('password')}
				inputMode="text"
				aria-invalid={!!error}
				className={error ? 'bg-destructive/20' : ''}
				tabIndex={2}
				type="password"
				placeholder="* * * * * * * *"
			/>
			{!error ? null : (
				<p className="text-sm text-destructive mt-2">{error.message}</p>
			)}
		</div>
	)
}
