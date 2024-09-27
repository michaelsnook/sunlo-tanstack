import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from 'lib/utils'
import { Button } from 'components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from 'components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover'
import { allLanguageOptions } from 'lib/languages'

interface SelectOneLanguageProps {
	value: string
	setValue: (value: string) => void
}

export function SelectOneLanguage({ value, setValue }: SelectOneLanguageProps) {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild className="w-full">
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="justify-between text-base"
				>
					{value ?
						allLanguageOptions.find((language) => language.value === value)
							?.label
					:	'Select language...'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0">
				<Command>
					<CommandInput placeholder="Search language..." className="my-1" />
					<CommandList>
						<CommandEmpty>No language found.</CommandEmpty>
						<CommandGroup>
							{allLanguageOptions.map((language) => (
								<CommandItem
									key={language.value}
									value={language.value}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? '' : currentValue)
										setOpen(false)
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === language.value ? 'opacity-100' : 'opacity-0'
										)}
									/>
									{language.label} ({language.value})
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}