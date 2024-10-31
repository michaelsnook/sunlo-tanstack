import { type FieldProps, ErrorLabel } from '.'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PasswordField({ register, error }: FieldProps) {
	return (
		<div className="flex flex-col gap-1">
			<Label htmlFor="password" className={error ? 'text-destructive' : ''}>
				Password
			</Label>
			<Input
				{...register('password')}
				inputMode="text"
				aria-invalid={!!error}
				className={error ? 'bg-destructive/20' : ''}
				type="password"
				placeholder="* * * * * * * *"
			/>
			<ErrorLabel {...error} />
		</div>
	)
}
