import { createFileRoute } from '@tanstack/react-router'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'components/ui/card'
import { PhraseSearchParams } from 'types/main'

export const Route = createFileRoute('/learn/$lang/_tabs/public-library')({
	validateSearch: (search: Record<string, unknown>): PhraseSearchParams => {
		return {
			phrase: search.phrase as string | undefined,
		}
	},
	component: PublicLibraryTab,
})

function PublicLibraryTab() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Select from Public Library</CardTitle>
				<CardDescription>
					Choose from our curated list of popular phrases.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Coming soon: Browse and select phrases from our public library.</p>
			</CardContent>
		</Card>
	)
}
