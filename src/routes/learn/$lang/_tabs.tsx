import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs'
import { NavbarData, PhraseSearchParams } from 'types/main'
import languages from 'lib/languages'

export const Route = createFileRoute('/learn/$lang/_tabs')({
	validateSearch: (search: Record<string, unknown>): PhraseSearchParams => {
		return {
			phrase: search.phrase as string | undefined,
		}
	},
	component: LanguageTabs,
	loader: ({ params: { lang } }) => ({
		navbar: {
			title: `Learning ${languages[lang]}`,
			icon: 'book-heart',
			contextMenu: [
				{
					name: 'Start a review',
					href: './review',
					icon: 'rocket',
				},
				{
					name: `Search ${languages[lang]}`,
					href: './search',
					icon: 'search',
				},
				{
					name: 'Add a phrase',
					href: './add-phrase',
					icon: 'square-plus',
				},
				{
					name: 'Your cards',
					href: './browse',
					icon: 'wallet-cards',
				},
				{
					name: 'Deck settings',
					href: './settings',
					icon: 'settings',
				},
			],
		} as NavbarData,
	}),
})

interface TabItem {
	label: string
	to: string
}

const LinkedTab = ({ label, to }: TabItem) => {
	const match = Route.useMatch({ to })
	const { lang } = Route.useParams()

	return (
		<TabsTrigger value={to} asChild>
			<Link
				to={to}
				params={{ lang }}
				from={Route.fullPath}
				className={
					match ? 'data-[state=active]:bg-background border-primary/50' : ''
				}
			>
				{label}
			</Link>
		</TabsTrigger>
	)
}

function LanguageTabs() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">
				Welcome to Your New Language Journey!
			</h1>
			<p className="text-lg mb-8">
				Let's get started by setting up your learning experience.
			</p>

			<Tabs
				value={Route.fullPath}
				// onValueChange={setActiveTab}
				className="space-y-4"
			>
				<TabsList>
					<LinkedTab to="/learn/$lang" label="Welcome" />
					<LinkedTab to="/learn/$lang/search" label="Search" />
					<LinkedTab to="/learn/$lang/add-phrase" label="Add a Phrase" />
					<LinkedTab to="/learn/$lang/public-library" label="Public Library" />
					<LinkedTab to="/learn/$lang/invite-friend" label="Invite a Friend" />
					<LinkedTab to="/learn/$lang/deck-settings" label="Deck Settings" />
				</TabsList>
				<div>
					<Outlet />
				</div>
			</Tabs>
		</div>
	)
}
