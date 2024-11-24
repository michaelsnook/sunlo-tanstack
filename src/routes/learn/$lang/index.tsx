import { createFileRoute, Link } from '@tanstack/react-router'

import { buttonVariants } from '@/components/ui/button'
import type { FriendshipRow, LangOnlyComponentProps } from '@/types/main'
import { useDeck, useDeckMeta } from '@/lib/use-deck'
import { useLanguage } from '@/lib/use-language'
import { useProfile } from '@/lib/use-profile'
import ModalWithOpener from '@/components/modal-with-opener'
import { LanguagePhrasesAccordionComponent } from '@/components/language-phrases-accordion'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Book, Loader2, NotebookPen, Search } from 'lucide-react'

export const Route = createFileRoute('/learn/$lang/')({
	component: WelcomePage,
})

function WelcomePage() {
	const { lang } = Route.useParams()
	const deckIsNew = false
	return deckIsNew ?
			<Empty lang={lang} />
		:	<div className="space-y-4 px-2">
				<div className="flex gap-2 flex-row flex-wrap dark">
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
				<FriendsSection lang={lang} />
				<DeckSettings lang={lang} />
				<DeckFullContents lang={lang} />
			</div>
}

// TODO the database doesn't have friendships yet so this is all mockup-y
// and the type is also mocked
function FriendsSection({ lang }: LangOnlyComponentProps) {
	const profileQuery = useProfile()
	if (profileQuery.data === null) return null

	const friendsThisLanguage =
		profileQuery.data?.friendships?.filter(
			(f: FriendshipRow) => f.helping_with.indexOf(lang) !== -1
		) || []

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Friends</CardTitle>
				<CardDescription>
					NB: This "your friends" section is mock content for wireframe purposes
					only. The list below is not pulling from the database and doesn't
					reflect your actual friends list or their activities.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Recent activity in this deck</p>
				<ul className="list-disc ml-4 mb-4">
					<li>mahesh (see recent activity or whatever)</li>
					<li>a-money (you have a new phrase from them)</li>
					<li>j-bhai (nothing special actually)</li>
				</ul>
				<Link
					to="/friends/search"
					search={{ lang }}
					from={Route.fullPath}
					className={buttonVariants({ variant: 'secondary' })}
				>
					Invite friends
				</Link>
			</CardContent>
		</Card>
	)
}

function DeckSettings({ lang }: LangOnlyComponentProps) {
	const { data, isPending } = useDeckMeta(lang)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Deck Settings</CardTitle>
				<CardDescription>
					Set your deck preferences and learning mode, activate or de-activate.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{isPending ?
					<Loader2 />
				:	<ul className="list-disc ms-4">
						<li>
							Your deck is currently:{' '}
							<strong>{data?.archived ? 'Inactive' : 'Active'}</strong>
						</li>
						<li>
							Your learning motivation is:{' '}
							<strong>
								{data?.learning_goal === 'family' ?
									'To connect with family'
								: data?.learning_goal === 'visiting' ?
									'Preparing to visit'
								:	'Living in a new place'}
							</strong>
						</li>
						<li>
							Your learning goals are: <strong>lorem upside downum</strong>
						</li>
					</ul>
				}
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

function DeckFullContents({ lang }: LangOnlyComponentProps) {
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

function Empty({ lang }: LangOnlyComponentProps) {
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
							to="/learn/$lang/friend-request"
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
