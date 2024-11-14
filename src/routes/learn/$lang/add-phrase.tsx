import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { NotebookPen, Search } from 'lucide-react'

interface SearchParams {
	text?: string
}

export const Route = createFileRoute('/learn/$lang/add-phrase')({
	validateSearch: (search: Record<string, unknown>): SearchParams => {
		return {
			text: (search?.text as string) ?? '',
		}
	},
	component: AddPhraseTab,
})

const addPhraseSchema = z.object({
	phrase: z.string().min(1, 'Please enter a phrase'),
	translation: z.string().min(1, 'Please enter the translation'),
})

function AddPhraseTab() {
	const navigate = Route.useNavigate()
	const { lang } = Route.useParams()
	const { text } = Route.useSearch()

	const searchPhrase = text || ''
	const { control: addPhraseControl, handleSubmit: handleAddPhraseSubmit } =
		useForm<z.infer<typeof addPhraseSchema>>({
			resolver: zodResolver(addPhraseSchema),
			defaultValues: { phrase: searchPhrase, translation: '' },
		})

	const addPhraseMutation = useMutation({
		mutationFn: (data: z.infer<typeof addPhraseSchema>) => {
			return new Promise((resolve) => setTimeout(() => resolve(data), 1000))
		},
		onSuccess: () => {
			toast.success('Your phrase has been added to your deck.')
			void navigate({
				to: '/learn/$lang/add-phrase',
				params: { lang },
				search: { text: '' },
			})
		},
	})

	const onAddPhraseSubmit = handleAddPhraseSubmit((data) => {
		addPhraseMutation.mutate(data)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add A Phrase</CardTitle>
				<CardDescription>
					Search for a phrase or add a new one to your deck.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={onAddPhraseSubmit} className="space-y-4 mt-4">
					<div>
						<Label htmlFor="newPhrase">New Phrase</Label>
						<Controller
							name="phrase"
							control={addPhraseControl}
							render={({ field }) => (
								<Input
									{...field}
									placeholder="The text of the phrase to learn"
									onChange={(e) => {
										field.onChange(e)
										void navigate({
											to: '.',
											replace: true,
											search: (search: SearchParams) => ({
												...search,
												text: e.target.value,
											}),
										})
									}}
								/>
							)}
						/>
					</div>
					<div>
						<Label htmlFor="translation">Translation</Label>
						<Controller
							name="translation"
							control={addPhraseControl}
							render={({ field }) => (
								<Textarea
									{...field}
									placeholder="Enter the translation in your native language"
								/>
							)}
						/>
					</div>
					<div className="flex flex-row gap-2">
						<Button type="submit">
							<NotebookPen />
							Add New Phrase
						</Button>
						<Button variant="link" asChild>
							<Link
								to="/learn/$lang/search"
								from={Route.fullPath}
								search={(search: SearchParams) => ({ ...search, text })}
							>
								<Search />
								Search for sumilar phrases
							</Link>
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
