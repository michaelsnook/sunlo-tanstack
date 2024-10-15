import { CircleX } from 'lucide-react'
import type { PropsWithChildren } from 'react'

/*
  If the error message passed as `children` is nullable, we can simply use:

    <ShowError>{some nullable message}</ShowError>

  But when we want to put some text directly in the template, like `Error: ${message}` it will mean
  that `children` is never null, so we add the `show` prop:

    <ShowError show={!!error}>Error submitting form: {error.message}</ShowError>
*/

export function ShowError({
	show = null,
	children = null,
}: PropsWithChildren<{ show?: boolean | null }>) {
	// if show is "false", don't show. if show is true, show it.
	// if show us not set, then show if there's content to show.
	if (show === false) return null
	if (show === null && !children) return null
	return (
		<div className="card bg-destructive/20 flex flex-row gap-4 items-center border-destructive/50">
			<CircleX className="text-destructive/50" aria-hidden={true} />
			<div>{children || `An unknown error has occurred (sorry)`}</div>
		</div>
	)
}
