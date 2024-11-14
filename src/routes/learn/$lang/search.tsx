import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { NotebookPen, Plus, Search } from 'lucide-react'
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
import languages from '@/lib/languages'
import { PhraseFull, UserCardInsert } from '@/types/main'

interface SearchParams {
	text?: string
}

export const Route = createFileRoute('/learn/$lang/search')({
	validateSearch: (search: Record<string, unknown>): SearchParams => {
		return {
			text: (search.text as string) || '',
		}
	},
	component: SearchTab,
})

const SearchPhraseSchema = z.object({
	text: z.string().min(1, 'Please enter a phrase to search or add'),
})

type SearchFormInputs = z.infer<typeof SearchPhraseSchema>

function SearchTab() {
	const { navigate } = useRouter()
	const { lang } = Route.useParams()
	const { text } = Route.useSearch()

	const { control, handleSubmit } = useForm<SearchFormInputs>({
		resolver: zodResolver(SearchPhraseSchema),
		defaultValues: { text },
	})

	const searchResults = useQuery({
		queryKey: ['user', lang, 'search', text],
		queryFn: (): PhraseFull[] => {
			return []
		},
		gcTime: 120_000,
		refetchOnWindowFocus: false,
	})

	const addCardMutation = useMutation({
		mutationFn: async (data: UserCardInsert) => {
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
				<form
					onSubmit={handleSubmit((values) => onSearchSubmit(values))}
					className="space-y-4"
				>
					<div>
						<Label htmlFor="phrase">Phrase</Label>
						<Controller
							name="text"
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									placeholder="Enter a phrase to search or add"
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
					<div className="flex flex-row gap-2">
						<Button type="submit">
							<Search /> Search Phrase
						</Button>
						<Button variant="link" asChild>
							<Link
								to="/learn/$lang/add-phrase"
								from={Route.fullPath}
								search={(search: SearchParams) => ({ ...search, text })}
							>
								<NotebookPen />
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
									<strong>{result.text}</strong> - {result.translations[0].text}
								</span>
								<Button
									size="sm"
									variant="ghost"
									onClick={() =>
										addCardMutation.mutate({ phrase_id: result.id })
									}
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
