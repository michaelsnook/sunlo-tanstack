import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group'
import { Label } from 'components/ui/label'
import { Users, GraduationCap, Briefcase } from 'lucide-react'
import { ControlledFieldProps } from '.'
import { useController } from 'react-hook-form'
import { ShowError } from 'components/errors'

export function LearningGoalField({ control, error }: ControlledFieldProps) {
	const {
		field: { value, onChange },
	} = useController({ name: 'learning_goal', control })
	return (
		<div>
			<RadioGroup
				defaultValue="family"
				onValueChange={onChange}
				className="gap-0"
			>
				<div>
					<RadioGroupItem value="moving" id="moving" className="hidden" />
					<Label
						htmlFor="moving"
						className={`flex items-center cursor-pointer w-full p-4 transition-colors ${value === 'moving' ? 'bg-primary/20' : 'hover:bg-primary/10'} rounded border-input`}
					>
						<GraduationCap
							className={`h-5 w-5 mr-3 transition-color ${value === 'moving' ? 'text-primary' : ''}`}
						/>
						<div className="space-y-1">
							<div className="">Moving or learning for friends</div>
							<div className="font-medium text-sm opacity-60">
								I'll be getting help from friends or colleagues
							</div>
						</div>
					</Label>
				</div>
				<div>
					<RadioGroupItem value="family" id="family" className="hidden" />
					<Label
						htmlFor="family"
						className={`flex items-center cursor-pointer w-full p-4 transition-colors ${value === 'family' ? 'bg-primary/20' : 'hover:bg-primary/10'} rounded border-input`}
					>
						<Users
							className={`h-5 w-5 mr-3 transition-color ${value === 'family' ? 'text-primary' : ''}`}
						/>
						<div>
							<div className="">Family connection</div>
							<div className="font-medium text-sm opacity-60">
								I want to connect with relatives by learning a family or
								ancestral language
							</div>
						</div>
					</Label>
				</div>
				<div>
					<RadioGroupItem value="visiting" id="visiting" className="hidden" />
					<Label
						htmlFor="visiting"
						className={`flex items-center cursor-pointer w-full p-4 transition-colors ${value === 'visiting' ? 'bg-primary/20' : 'hover:bg-primary/10'} rounded border-input`}
					>
						<Briefcase
							className={`h-5 w-5 mr-3 transition-color ${value === 'visiting' ? 'text-primary' : ''}`}
						/>
						<div>
							<div className="">Just visiting</div>
							<div className="font-medium text-sm opacity-60">
								I'm learning the basics for an upcoming trip
							</div>
						</div>
					</Label>
				</div>
			</RadioGroup>
			<ShowError>{error?.message}</ShowError>
		</div>
	)
}
