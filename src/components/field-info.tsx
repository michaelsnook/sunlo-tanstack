import type { FieldApi } from '@tanstack/react-form'
export function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
	// console.log(`Field info:`, field.state.meta)
	return field.state.meta.errors.length ?
			<em className="text-error text-sm py-1">
				{field.state.meta.errors.join(',')}
			</em>
		:	null
}
