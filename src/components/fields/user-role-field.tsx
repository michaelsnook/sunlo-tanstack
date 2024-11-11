import { BookOpen, Handshake, LifeBuoy } from 'lucide-react'
import { type FieldProps, ErrorLabel } from '.'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'

const outer = 'flex flex-row gap-2 items-center',
	inner =
		'transition-colors flex flex-col items-center justify-center h-20 gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20 w-full'

export default function UserRoleField({ register, error }: FieldProps) {
	return (
		<div className="space-y-2">
			<p>Are you learning for yourself, or helping a friend?</p>
			<RadioGroup {...register('user_role')} className="grid grid-cols-3 gap-3">
				<div className={outer}>
					<RadioGroupItem
						value="learner"
						id="learner"
						className="peer sr-only"
					/>
					<Label htmlFor="learner" className={inner}>
						Learning
						<BookOpen size="16" />
					</Label>
				</div>
				<div className={outer}>
					<RadioGroupItem value="helper" id="helper" className="peer sr-only" />
					<Label htmlFor="helper" className={inner}>
						Helping
						<LifeBuoy size="16" />
					</Label>
				</div>
				<div className={outer}>
					<RadioGroupItem value="both" id="both" className="peer sr-only" />
					<Label htmlFor="both" className={inner}>
						Both
						<Handshake size="16" />
					</Label>
				</div>
			</RadioGroup>
			<ErrorLabel {...error} />
		</div>
	)
}
