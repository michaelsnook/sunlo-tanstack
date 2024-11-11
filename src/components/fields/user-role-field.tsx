import { Book, Handshake, LifeBuoy } from 'lucide-react'
import { type FieldProps, ErrorLabel } from '.'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'

const outer = 'flex flex-row gap-2 items-center',
	inner = 'flex flex-row gap-1 items-center mb-0'

export default function UserRoleField({ register, error }: FieldProps) {
	return (
		<div className="space-y-2">
			<p>Are you learning for yourself, or helping a friend?</p>
			<RadioGroup {...register('user_role')}>
				<div className={outer}>
					<RadioGroupItem value="learner" id="learner" />
					<Label htmlFor="learner" className={inner}>
						Learning
						<Book size="16" />
					</Label>
				</div>
				<div className={outer}>
					<RadioGroupItem value="helper" id="helper" />
					<Label htmlFor="helper" className={inner}>
						Helping
						<LifeBuoy size="16" />
					</Label>
				</div>
				<div className={outer}>
					<RadioGroupItem value="both" id="both" />
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
