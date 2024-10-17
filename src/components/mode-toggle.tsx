import { Check, Moon, Sun } from 'lucide-react'

import { Button } from 'components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from 'components/ui/dropdown-menu'
import { useTheme } from 'components/theme-provider'
import { cn } from 'lib/utils'

export function ModeToggle() {
	const { theme, setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="text-center" variant="ghost" size="icon">
					<Sun className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme('light')}>
					<Check
						className={cn(
							'mr-2 h-4 w-4',
							theme === 'light' ? 'opacity-100' : 'opacity-0'
						)}
					/>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					<Check
						className={cn(
							'mr-2 h-4 w-4',
							theme === 'dark' ? 'opacity-100' : 'opacity-0'
						)}
					/>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					<Check
						className={cn(
							'mr-2 h-4 w-4',
							theme === 'system' ? 'opacity-100' : 'opacity-0'
						)}
					/>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
