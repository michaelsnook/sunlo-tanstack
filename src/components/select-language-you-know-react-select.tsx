import { useProfile } from '@/lib/use-profile'
import { opts } from '@/lib/languages'
import { SelectOption } from '@/types/main'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface SelectProps {
	onChange: (value: string) => void
	disabledLang: string
}

export default function SelectLanguageYouKnow({
	onChange,
	disabledLang,
}: SelectProps) {
	const { data } = useProfile()
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState('')

	if (!data) return <Loader2 />
	const languages_spoken = data?.languages_spoken || []
	const selectOptions: SelectOption[] = opts(languages_spoken)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="default"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value ?
						selectOptions.find((option) => option.value === value)?.label
					:	'Select a language...'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search languages..." />
					<CommandList>
						<CommandEmpty>No options.</CommandEmpty>
						<CommandGroup>
							{selectOptions.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={(currentValue) => {
										const newValue = currentValue === value ? '' : currentValue
										setValue(newValue)
										onChange(newValue)
										setOpen(false)
									}}
									disabled={option.value === disabledLang}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === option.value ? 'opacity-100' : 'opacity-0'
										)}
									/>
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
