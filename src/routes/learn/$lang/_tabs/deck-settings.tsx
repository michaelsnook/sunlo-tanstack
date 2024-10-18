import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import toast from 'react-hot-toast'

import { PhraseSearchParams } from 'types/main'

import { Button } from 'components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'components/ui/card'
import { Label } from 'components/ui/label'
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group'

export const Route = createFileRoute('/learn/$lang/_tabs/deck-settings')({
	validateSearch: (search: Record<string, unknown>): PhraseSearchParams => {
		return {
			phrase: search.phrase as string | undefined,
		}
	},
	component: DeckSettingsTab,
})

const deckSettingsSchema = z.object({
	intent: z.enum(['visiting', 'family', 'friends']),
})

function DeckSettingsTab() {
	const { control, handleSubmit } = useForm<z.infer<typeof deckSettingsSchema>>(
		{
			resolver: zodResolver(deckSettingsSchema),
		}
	)

	const updateDeckSettingsMutation = useMutation(
		(data: z.infer<typeof deckSettingsSchema>) => {
			return new Promise((resolve) => setTimeout(() => resolve(data), 1000))
		},
		{
			onSuccess: () => {
				toast.success('Your deck settings have been updated.')
			},
		}
	)

	const onSubmit = handleSubmit((data) => {
		updateDeckSettingsMutation.mutate(data)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Deck Settings</CardTitle>
				<CardDescription>
					Set your learning intent for this language.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit} className="space-y-4">
					<Controller
						name="intent"
						control={control}
						render={({ field }) => (
							<RadioGroup
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="visiting" id="visiting" />
									<Label htmlFor="visiting">Visiting</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="family" id="family" />
									<Label htmlFor="family">Family</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="friends" id="friends" />
									<Label htmlFor="friends">Friends</Label>
								</div>
							</RadioGroup>
						)}
					/>
					<Button type="submit">Save Settings</Button>
				</form>
			</CardContent>
		</Card>
	)
}
