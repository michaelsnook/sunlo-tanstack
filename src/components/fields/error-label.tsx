import type { FieldError } from 'react-hook-form'

export default function ErrorLabel(error: FieldError) {
	return !error ? null : (
			<p className="text-sm text-destructive mt-2">{error.message}</p>
		)
}
