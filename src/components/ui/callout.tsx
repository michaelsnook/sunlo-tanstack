import { cn } from 'lib/utils'
import type { HTMLAttributes, PropsWithChildren } from 'react'

type CalloutProps = PropsWithChildren & {
	variant?: 'default' | 'problem' | 'ghost'
	className?: string
	alert?: boolean
}

const variants = {
	default: 'bg-primary/20 border-primary/50',
	problem: 'bg-destructive/20 border-destructive/50',
	ghost: 'bg-primary/20 border-primary text-muted-foreground bg-muted',
}

export default function Callout({
	variant = 'default',
	alert = false,
	className,
	children,
}: CalloutProps) {
	let props: HTMLAttributes<any> = {}
	if (alert) props.role = 'alert'
	return (
		<div
			{...props}
			className={cn(
				'card flex flex-row gap-4 items-center',
				variants[variant],
				className
			)}
		>
			{children}
		</div>
	)
}
