import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import toast from 'react-hot-toast'

import { Button } from 'components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'components/ui/card'

import { useDeckMeta } from 'lib/use-deck'
import { PostgrestError } from '@supabase/supabase-js'
import Loading from 'components/loading'
import { DeckMeta, uuid } from 'types/main'
import { LearningGoalField } from 'components/fields/learning-goal-field'

export const Route = createFileRoute('/learn/$lang/deck-settings')({
	component: DeckSettingsPage,
})

function DeckSettingsPage() {
	const { lang } = Route.useParams()
	const { data: meta, isPending } = useDeckMeta(lang)
	return isPending ?
			<Loading />
		:	<Card>
				<CardHeader>
					<CardTitle>Deck Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<GoalForm meta={meta} />
					<ArchiveForm meta={meta} />
				</CardContent>
			</Card>
}

const DeckSettingsSchema = z.object({
	learning_goal: z.enum(['visiting', 'family', 'moving']),
	id: z.string().uuid(),
})

type DeckGoalFormInputs = z.infer<typeof DeckSettingsSchema>

function GoalForm({ meta: { learning_goal, id, lang } }: { meta: DeckMeta }) {
	const queryClient = useQueryClient()
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<DeckGoalFormInputs>({
		resolver: zodResolver(DeckSettingsSchema),
		defaultValues: { learning_goal, id },
	})

	const updateDeckGoalMutation = useMutation<
		DeckGoalFormInputs,
		PostgrestError
	>({
		mutationKey: ['user', lang, 'deck-settings'],
		mutationFn: async (data: DeckGoalFormInputs) => {
			return new Promise((resolve) => setTimeout(() => resolve(data), 1000))
		},
		onSuccess: () => {
			toast.success('Your deck settings have been updated.')
			void queryClient.invalidateQueries({ queryKey: ['user', lang] })
		},
		onError: () => {
			toast.error(
				'There was some issue and your deck settings were not updated.'
			)
		},
	})

	return (
		<Card>
			<CardHeader className="pb-0">
				<CardTitle className="h4" asChild>
					<h4>Your learning goals</h4>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={handleSubmit(updateDeckGoalMutation.mutate)}
					className="space-y-4"
				>
					<Controller
						name="learning_goal"
						control={control}
						render={() => (
							<LearningGoalField
								control={control}
								error={errors.learning_goal}
							/>
						)}
					/>
					<div className="space-x-2">
						<Button type="submit" disabled={!isDirty}>
							Update your goal
						</Button>
						<Button
							variant="secondary"
							type="button"
							onClick={() => reset()}
							disabled={!isDirty}
						>
							Reset
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}

function ArchiveForm({ meta }: { meta: DeckMeta }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Archive</CardTitle>
			</CardHeader>
			<CardContent></CardContent>
		</Card>
	)
}
