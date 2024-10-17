import { createFileRoute, useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'components/ui/card'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Label } from 'components/ui/label'
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button'
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs'
import { PhraseSearchParams } from 'types/main'
import { langInfoLoader } from 'lib/reuse-loaders'

export const Route = createFileRoute('/learn/$lang/_tabs/add-phrase')({
	validateSearch: (search: Record<string, unknown>): PhraseSearchParams => {
		return {
			phrase: search.phrase as string | undefined,
		}
	},
	component: AddPhraseTab,
	loader: ({ params: { lang } }) => langInfoLoader(lang),
})

const searchPhraseSchema = z.object({
	phrase: z.string().min(1, 'Please enter a phrase to search or add'),
})

const addPhraseSchema = z.object({
	phrase: z.string().min(1, 'Please enter a phrase'),
	translation: z.string().min(1, 'Please enter the translation'),
})

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

function AddPhraseTab() {
	const { navigate } = useRouter()
	const { phrase } = Route.useSearch()
	const [searchResults, setSearchResults] = useState<typeof samplePhrases>([])
	const [phraseMode, setPhraseMode] = useState<'search' | 'new'>('search')

	const searchPhrase = phrase || ''

	const { control, handleSubmit } = useForm<z.infer<typeof searchPhraseSchema>>(
		{
			resolver: zodResolver(searchPhraseSchema),
			defaultValues: { phrase: searchPhrase },
		}
	)

	const { control: addPhraseControl, handleSubmit: handleAddPhraseSubmit } =
		useForm<z.infer<typeof addPhraseSchema>>({
			resolver: zodResolver(addPhraseSchema),
			defaultValues: { phrase: searchPhrase, translation: '' },
		})

	useEffect(() => {
		if (searchPhrase) {
			searchPhraseMutation.mutate(searchPhrase)
		}
	}, [searchPhrase])

	const searchPhraseMutation = useMutation(
		(phrase: string) => {
			return new Promise<typeof samplePhrases>((resolve) =>
				setTimeout(
					() =>
						resolve(
							samplePhrases.filter(
								(p) =>
									p.phrase.toLowerCase().includes(phrase.toLowerCase()) ||
									p.translation.toLowerCase().includes(phrase.toLowerCase())
							)
						),
					300
				)
			)
		},
		{
			onSuccess: (data) => {
				setSearchResults(data)
			},
		}
	)

	const addPhraseMutation = useMutation(
		(data: z.infer<typeof addPhraseSchema>) => {
			return new Promise((resolve) => setTimeout(() => resolve(data), 1000))
		},
		{
			onSuccess: () => {
				toast.success('Your phrase has been added to your deck.')
				navigate({ to: './add-phrase/', search: { phrase: '' } })
				setPhraseMode('search')
			},
		}
	)

	const onSearchSubmit = handleSubmit((data) => {
		// navigate({ to: '/add-phrase', search: { phrase: data.phrase } })
		console.log(`onSearchSubmit:`, data)
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
				<form onSubmit={onSearchSubmit} className="space-y-4">
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
											to: '/add-phrase',
											from: Route.fullPath,
											search: { phrase: e.target.value },
										})
									}}
								/>
							)}
						/>
					</div>
					<Button type="submit">Search Phrase</Button>
				</form>

				<Tabs
					value={phraseMode}
					onValueChange={(value) => setPhraseMode(value as 'search' | 'new')}
					className="mt-6"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="search">🔍️ Search for Phrase</TabsTrigger>
						<TabsTrigger value="new">➕ New Phrase</TabsTrigger>
					</TabsList>
					<TabsContent value="search">
						{searchResults.length > 0 ?
							<ul className="space-y-2 mt-4">
								{searchResults.map((result, index) => (
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
					</TabsContent>
					<TabsContent value="new">
						<form onSubmit={onAddPhraseSubmit} className="space-y-4 mt-4">
							<div>
								<Label htmlFor="newPhrase">New Phrase</Label>
								<Controller
									name="phrase"
									control={addPhraseControl}
									render={({ field }) => <Input {...field} />}
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
							<Button type="submit">Add New Phrase</Button>
						</form>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
