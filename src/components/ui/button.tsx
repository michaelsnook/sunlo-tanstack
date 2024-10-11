import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from 'lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-white hover:opacity-70 aria-expanded:bg-primary',
				secondary:
					'bg-foreground/10 dark:bg-background/10 hover:bg-primary/30 dark:hover:bg-primary/40',
				destructive:
					'bg-destructive text-white hover:opacity-70 aria-expanded:bg-primary',
				ghost:
					'hover:bg-foreground/10 dark:hover:bg-background/20 text-muted-foreground',
				outline:
					'border-primary border focus-within:ring active:ring text-primary dark:text-white hover:bg-primary/30',
				white:
					'bg-white hover:bg-primary text-primary hover:text-white border-primary border-2',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-10 rounded px-3 text-sm',
				lg: 'rounded-md px-8 py-4 text-xl font-medium',
				icon: 'h-6 w-6 rounded-full',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		)
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }
