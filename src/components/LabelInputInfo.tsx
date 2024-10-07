import type { FieldApi } from '@tanstack/react-form'
import { Label } from 'components/ui/label'

interface LabelInputInfoProps {
	field: FieldApi<any, any, any, any, any>
	label: string
	children: React.ReactNode
}

export const LabelInputInfo = ({
	field,
	label,
	children,
}: LabelInputInfoProps) => {
	const error = field.state.meta.errors.join(', ')
	return (
		<div>
			<Label className={error ? 'text-error' : ''} htmlFor={field.name}>
				{label}
			</Label>
			{children}
			{!error ? null : <p className="text-sm text-error">{error}</p>}
		</div>
	)
}
