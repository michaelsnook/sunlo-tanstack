import { createFileRoute, Link } from '@tanstack/react-router'

import { buttonVariants } from 'components/ui/button'
import type { FriendshipRow, PhraseSearchParams } from 'types/main'
import Loading from 'components/loading'
import { useDeck, useDeckMeta } from 'lib/use-deck'
import { useLanguage } from 'lib/use-language'
import { useProfile } from 'lib/use-profile'
import ModalWithOpener from 'components/modal-with-opener'
import { LanguagePhrasesAccordionComponent } from 'components/language-phrases-accordion'

export const Route = createFileRoute('/learn/$lang/_tabs/')({
	validateSearch: (search: Record<string, unknown>): PhraseSearchParams => {
		return {
			phrase: search.phrase as string | undefined,
		}
	},
	component: WelcomePage,
})

function WelcomePage() {
	const { lang } = Route.useParams()
	return (
		<main className="card-page my-4">
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
	)
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
		<div className="border-dashed border rounded my-4">
			<div className="mb-4">
				<h2 className="h3">Your Friends</h2>
				<p className="opacity-60 -mt-2 text-sm">
					(ppl helping the user learn this language)
				</p>
			</div>
			<ul className="list-disc ml-4">
				<li>mahesh (see recent activity or whatever)</li>
				<li>a-money (you have a new phrase from them)</li>
				<li>j-bhai (nothing special actually)</li>
			</ul>
		</div>
	)
}
