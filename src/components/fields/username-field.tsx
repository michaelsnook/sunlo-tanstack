import { type FieldProps, ErrorLabel } from '.'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function UsernameField({ register, error }: FieldProps) {
	return (
		<div className="flex flex-col gap-1">
			<Label htmlFor="username" className={error ? 'text-destructive' : ''}>
				Your nickname
			</Label>
			<Input
				type="text"
				{...register('username')}
				inputMode="text"
				aria-invalid={!!error}
				className={error ? 'bg-destructive/20' : ''}
			/>
			<ErrorLabel {...error} />
		</div>
	)
}
