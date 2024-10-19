import { useState } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { Plus, Search } from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'components/ui/card'
import { Label } from 'components/ui/label'
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button'
import languages from 'lib/languages'

interface SearchParams {
	q: string
}

export const Route = createFileRoute('/learn/$lang/_tabs/search')({
	validateSearch: (search: Record<string, unknown>): SearchParams => {
		return {
			q: search.q as string | undefined,
		}
	},
	component: SearchTab,
})

const SearchPhraseSchema = z.object({
	phrase: z.string().min(1, 'Please enter a phrase to search or add'),
})

type SearchFormInputs = z.infer<typeof SearchPhraseSchema>

const AddCardSchema = z.object({
	phrase_id: z.string().uuid(),
	deck_id: z.string().uuid(),
})

type AddCardSubmission = z.infer<typeof AddCardSchema>

const samplePhrases = [
	{ phrase: 'Hola', translation: 'Hello' },
	{ phrase: 'Gracias', translation: 'Thank you' },
	{ phrase: 'Por favor', translation: 'Please' },
	{ phrase: '¿Cómo estás?', translation: 'How are you?' },
	{ phrase: 'Adiós', translation: 'Goodbye' },
	{ phrase: 'Buenos días', translation: 'Good morning' },
	{ phrase: 'Buenas noches', translation: 'Good night' },
	{ phrase: 'Mucho gusto', translation: 'Nice to meet you' },
]

function SearchTab() {
	const { navigate } = useRouter()
	const { lang } = Route.useParams()
	const { q } = Route.useSearch()

	const searchQuery = q || ''

	const { control, handleSubmit } = useForm<SearchFormInputs>({
		resolver: zodResolver(SearchPhraseSchema),
		defaultValues: { phrase: searchQuery },
	})

	const searchResults = useQuery({
		queryKey: ['user', lang, 'search', searchQuery],
		queryFn: async () => null,
		gcTime: 120_000,
		refetchOnWindowFocus: false,
	})

	const addCardMutation = useMutation({
		mutationFn: async (data: AddCardSubmission) => {
			return new Promise((resolve) => setTimeout(() => resolve(data), 200))
		},
		onSuccess: () => toast.success('Your phrase has been added to your deck.'),
		onError: (error) => toast.error(error.message),
	})
	const onSearchSubmit = (values: SearchFormInputs) =>
		console.log(`Submitting search...`, values)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Search {languages[lang]}</CardTitle>
				<CardDescription>Search for a phrases to learn</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSearchSubmit)} className="space-y-4">
					<div>
						<Label htmlFor="phrase">Phrase</Label>
						<Controller
							name="phrase"
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									placeholder="Enter a phrase to search or add"
									onChange={(e) => {
										field.onChange(e)
										navigate({
											to: '.',
											search: (search: SearchParams) => ({
												...search,
												q: e.target.value,
											}),
										})
									}}
								/>
							)}
						/>
					</div>
					<div className="flex flex-row gap-2">
						<Button type="submit">Search Phrase</Button>
						<Button variant="link" asChild>
							<Link
								to="/learn/$lang/add-phrase"
								from={Route.fullPath}
								search={{ phrase: q }}
							>
								Add New Phrase
							</Link>
						</Button>
					</div>
				</form>

				{searchResults.data?.length > 0 ?
					<ul className="space-y-2 mt-4">
						{searchResults.data.map((result, index) => (
							<li
								key={index}
								className="flex justify-between items-center bg-secondary p-2 rounded"
							>
								<span>
									<strong>{result.phrase}</strong> - {result.translation}
								</span>
								<Button
									size="sm"
									variant="ghost"
									onClick={() => addPhraseMutation.mutate(result)}
								>
									<Plus className="h-4 w-4" />
									<span className="sr-only">Add to deck</span>
								</Button>
							</li>
						))}
					</ul>
				:	<p className="text-center text-muted-foreground mt-4">
						No results found. Try searching for a phrase or add a new one.
					</p>
				}
			</CardContent>
		</Card>
	)
}
