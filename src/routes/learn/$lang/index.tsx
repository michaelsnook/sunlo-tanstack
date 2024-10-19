import { createFileRoute, Link } from '@tanstack/react-router'

import { buttonVariants } from 'components/ui/button'
import type { FriendshipRow } from 'types/main'
import Loading from 'components/loading'
import { useDeck, useDeckMeta } from 'lib/use-deck'
import { useLanguage } from 'lib/use-language'
import { useProfile } from 'lib/use-profile'
import ModalWithOpener from 'components/modal-with-opener'
import { LanguagePhrasesAccordionComponent } from 'components/language-phrases-accordion'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'components/ui/card'
import { Book, Notebook, NotebookPen, Plus, Search } from 'lucide-react'
import languages from 'lib/languages'
import { cn } from 'lib/utils'

export const Route = createFileRoute('/learn/$lang/')({
	component: WelcomePage,
})

function WelcomePage() {
	const { lang } = Route.useParams()
	const deckIsNew = false
	return deckIsNew ?
			<Empty />
		:	<Card>
				<CardHeader>
					<CardTitle>Learn! {languages[lang]}!</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex gap-2 flex-row flex-wrap">
						<Link
							to="/learn/$lang/review"
							params={{ lang }}
							from={Route.fullPath}
							className={buttonVariants({ variant: 'default' })}
						>
							<Book /> Today&apos;s Deck Review
						</Link>
						<Link
							to="/learn/$lang/search"
							params={{ lang }}
							from={Route.fullPath}
							className={buttonVariants({ variant: 'secondary' })}
						>
							<Search /> Quick search
						</Link>
						<Link
							to="/learn/$lang/add-phrase"
							params={{ lang }}
							from={Route.fullPath}
							className={buttonVariants({ variant: 'secondary' })}
						>
							<NotebookPen /> Add a phrase
						</Link>
					</div>
					<FriendsSection />
					<DeckSettings />
					<DeckFullContents />
				</CardContent>
			</Card>
}

// TODO: these inputs don't do anything.
// use https://v0.dev/chat/PNg3tT-DSoC for deck mode
function DeckSettings() {
	const { lang } = Route.useParams()
	const deck = useDeckMeta(lang)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Deck Settings</CardTitle>
				<CardDescription>
					Delete your deck? Pause it? Change modes? Set goals? Travel dates
					coming up?
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<ul className="list-disc ms-4">
					<li>Your deck is currently: Active</li>
					<li>Your learning mode is: Family</li>
					<li>Your learning goals are: lorem upside downum</li>
				</ul>
				<Link
					to="/learn/$lang/deck-settings"
					params={{ lang }}
					from={Route.fullPath}
					className={buttonVariants({ variant: 'secondary' })}
				>
					Manage Deck
				</Link>
			</CardContent>
		</Card>
	)
}

function DeckFullContents() {
	const { lang } = Route.useParams()
	const deck = useDeck(lang)
	const language = useLanguage(lang)
	return (
		<Card>
			<CardHeader>
				<CardTitle>Deck Details</CardTitle>
				<CardDescription>
					(an excrutiating level of detail actually)
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div>
					<div>
						deck is{' '}
						<ModalWithOpener
							title="Deck Details"
							description="A bunch of JSON actually, not really good for humans."
						>
							{JSON.stringify(deck.data?.meta, null, 2)}
						</ModalWithOpener>
					</div>
					<div>
						language is{' '}
						<ModalWithOpener
							title="Language Details"
							description="A bunch of JSON actually, not really good for humans."
						>
							{JSON.stringify(language.data?.meta, null, 2)}
						</ModalWithOpener>
					</div>
				</div>
				{deck.data?.pids.length > 0 ?
					<div className="flex-basis-[20rem] flex flex-shrink flex-row flex-wrap gap-4">
						<LanguagePhrasesAccordionComponent
							lang={lang}
							pids={deck.data?.pids}
							phrasesMap={language.data?.phrasesMap}
						/>
					</div>
				:	null}
			</CardContent>
		</Card>
	)
}

// TODO the database doesn't have friendships yet so this is all mockup-y
// and the type is also mocked
function FriendsSection() {
	const { lang } = Route.useParams()
	const profileQuery = useProfile()
	if (profileQuery.data === null) return null

	const friendsThisLanguage =
		profileQuery.data?.friendships?.filter(
			(f: FriendshipRow) => f.helping_with.indexOf(lang) !== -1
		) || []

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Your Friends{' '}
					<span className="text-xs text-white/50">
						<Link
							to="/learn/$lang/invite-friend"
							params={{ lang }}
							from={Route.fullPath}
							className={buttonVariants({ variant: 'ghost' })}
						>
							<Plus /> Add friends
						</Link>
					</span>
				</CardTitle>
				<CardDescription>
					(ppl helping the user learn this language)
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<ul className="list-disc ml-4">
					<li>mahesh (see recent activity or whatever)</li>
					<li>a-money (you have a new phrase from them)</li>
					<li>j-bhai (nothing special actually)</li>
				</ul>

				<Link
					to="/learn/$lang/invite-friend"
					params={{ lang }}
					from={Route.fullPath}
					className={buttonVariants({ variant: 'secondary' })}
				>
					See All Friends Activity
				</Link>
				<Link
					to="/learn/$lang/invite-friend"
					params={{ lang }}
					from={Route.fullPath}
					className={cn(buttonVariants({ variant: 'secondary' }), 'ms-2')}
				>
					Invite / Manage Friends
				</Link>
			</CardContent>
		</Card>
	)
}

function Empty() {
	return (
		<Card className="py-10">
			<CardHeader>
				<CardTitle>
					<h1 className="text-3xl font-bold mb-6">
						Welcome to Your New Language Journey!
					</h1>
				</CardTitle>
				<CardContent>
					<p className="text-lg mb-8">
						Let's get started by setting up your learning experience. Do you
						want to start by browsing the public deck of flash cards, or invite
						a friend to help you out?
					</p>
					<div className="flex flex-col gap-2 @lg:flex-row">
						<Link
							to="/learn/$lang/search"
							params={{ lang }}
							className={buttonVariants({ variant: 'secondary' })}
						>
							Search Cards
						</Link>

						<Link
							to="/learn/$lang/invite-friend"
							params={{ lang }}
							className={buttonVariants({ variant: 'secondary' })}
						>
							Invite a friend
						</Link>
					</div>
				</CardContent>
			</CardHeader>
		</Card>
	)
}
