import { createFileRoute } from '@tanstack/react-router'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'components/ui/card'

export const Route = createFileRoute('/learn/$lang/public-library')({
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
