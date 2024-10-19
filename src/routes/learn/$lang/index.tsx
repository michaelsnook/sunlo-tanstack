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

export const Route = createFileRoute('/learn/$lang/')({
	component: WelcomePage,
})

function WelcomePage() {
	const { lang } = Route.useParams()
	const deckIsNew = false
	return deckIsNew ?
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
							want to start by browsing the public deck of flash cards, or
							invite a friend to help you out?
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
		:	<main className="card-page my-4">
				<p className="italic opacity-80">
					This is meant as a place to just get the user going. They need to feel
					comfortable and be reminded of the resources they have to lean on and
					their motivations, but time on task is one of the most important
					factors, so we are really just trying to push them toward starting a
					"review" session.
				</p>

				<Link
					to="/learn/$lang/review"
					params={{ lang }}
					from={Route.fullPath}
					className={buttonVariants({ variant: 'default' })}
				>
					Time To Start Today&apos;s Deck
				</Link>

				<div className="space-y-4">
					{!lang ?
						<Loading />
					:	<>
							<FriendsSection />
							<DeckSettings />
							<DeckFullContents />
						</>
					}
				</div>
			</main>
}

// TODO: these inputs don't do anything.
// use https://v0.dev/chat/PNg3tT-DSoC for deck mode
function DeckSettings() {
	const { lang } = Route.useParams()
	const deck = useDeckMeta(lang)

	return (
		<div className="border-dashed border rounded my-4 space-y-4">
			<div>
				<h2 className="h3">Deck Settings</h2>
				<p className="opacity-60 -mt-2 text-sm">
					Delete your deck? Pause it? Change modes? Set goals? Travel dates
					coming up?
				</p>
			</div>
			<div>
				<p>What mode are you in? tavel? friends?</p>
				<div>
					<div className="flex flex-row gap-2 items-center">
						<input type="radio" value="1" />
						<label>Friends & Coworkers</label>
					</div>
					<div className="flex flex-row gap-2 items-center">
						<input type="radio" value="2" defaultChecked={true} />
						<label>Family Connections</label>
					</div>
					<div className="flex flex-row gap-2 items-center">
						<input type="radio" value="3" />
						<label>Upcoming Visit</label>
					</div>
				</div>
			</div>
			<div>
				<p>Pause your deck maybe</p>
				<div className="flex flex-row gap-2 items-center">
					<input type="radio" value="2" defaultChecked={true} />
					<label>This deck is active</label>
				</div>
				<div className="flex flex-row gap-2 items-center">
					<input type="radio" value="3" />
					<label>Deactivate it</label>
				</div>
			</div>
		</div>
	)
}

function DeckFullContents() {
	const { lang } = Route.useParams()
	const deck = useDeck(lang)
	const language = useLanguage(lang)
	return (
		<div className="border-dashed border rounded my-4 space-y-4">
			<div>
				<h2 className="h3">Deck Details</h2>
				<p className="opacity-60 -mt-2 text-sm">
					(an excrutiating level of detail actually)
				</p>
			</div>
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
		</div>
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
				<CardTitle>Your Friends</CardTitle>
				<CardDescription>
					(ppl helping the user learn this language)
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ul className="list-disc ml-4">
					<li>mahesh (see recent activity or whatever)</li>
					<li>a-money (you have a new phrase from them)</li>
					<li>j-bhai (nothing special actually)</li>
				</ul>
				<Link className={buttonVariants({ variant: 'secondary' })}>
					See full friend activity
				</Link>
			</CardContent>
		</Card>
	)
}
