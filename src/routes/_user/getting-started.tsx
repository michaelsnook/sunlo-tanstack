import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ShowError } from 'components/errors'
import Loading from 'components/loading'
import SuccessCheckmark from 'components/SuccessCheckmark'
import { useAuth } from 'lib/hooks'
import languages from 'lib/languages'
import supabase from 'lib/supabase-client'
import { useProfile } from 'lib/use-profile'
import { cn } from 'lib/utils'
import { type FormEvent, SyntheticEvent, useState } from 'react'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/_user/getting-started')({
	component: GettingStartedPage,
})

function GettingStartedPage() {
	const { userId } = useAuth()
	const profile = useProfile()
	const queryClient = useQueryClient()

	const [tempLanguagePrimary, setTempLanguagePrimary] = useState<string>()
	const [tempDeckToAdd, setTempDeckToAdd] = useState<string>(null)
	const [tempUsername, setTempUsername] = useState<string>()
	const tempLanguagePrimaryToUse =
		tempLanguagePrimary ?? profile.data?.language_primary
	const tempUsernameToUse = tempUsername ?? profile.data?.username

	const languagesSpoken = profile.data?.languages_spoken || []
	const newLanguagesSpoken = [
		tempLanguagePrimary,
		...languagesSpoken.filter((i) => i !== tempLanguagePrimary),
	]

	const mainForm = useMutation({
		mutationKey: ['user', 'profile'],
		mutationFn: async () => {
			if (typeof userId !== 'string') throw new Error('No logged in user')
			if (
				!tempUsername &&
				!tempLanguagePrimary &&
				typeof tempDeckToAdd !== 'string'
			) {
				throw new Error('Nothing to update; try again')
			}

			const profileUpsert = await supabase
				.from('user_profile')
				.upsert({
					username: tempUsernameToUse,
					language_primary: tempLanguagePrimaryToUse,
					languages_spoken: newLanguagesSpoken,
				})
				.match({ uid: userId })
				.select()

			if (profileUpsert.error) {
				console.log('Profile upsert error', profileUpsert.error)
				throw profileUpsert.error
			}

			// console.log(`the first response`, profileUpsert[0])

			if (typeof tempDeckToAdd !== 'string')
				return { deck: null, profile: profileUpsert.data }

			const deckInsert = await supabase
				.from('user_deck')
				.upsert({ lang: tempDeckToAdd, uid: userId })
				.match({ lang: tempDeckToAdd, uid: userId })
				.select()

			if (deckInsert.error) {
				console.log(`Deck insert error`, deckInsert?.error)
				toast('Profile saved! But there was an error creating your deck.')
				toast.error(deckInsert.error?.message)
				throw deckInsert.error
			}

			console.log(`the two responses`, deckInsert, profileUpsert)
			return {
				deck: deckInsert.data[0],
				profile: profileUpsert.data[0],
			}
		},
		onSuccess: (data) => {
			console.log(`Success! deck, profile`, data)
			toast.success('Success!')
			queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
		},
	})

	const reset = () => {
		setTempLanguagePrimary(profile.data?.language_primary)
		setTempDeckToAdd(null)
		setTempUsername(profile.data?.username)
	}

	// if (mainForm.error) console.log(`Error logging:`, mainForm)
	if (mainForm.isSuccess) return <ShowSuccess tempDeckToAdd={tempDeckToAdd} />
	if (profile.isPending) return <Loading />
	if (!profile.data) return <>no data; you are nicht profile-y: "{userId}"</>
	const { deckLanguages } = profile.data

	return (
		<>
			<main className="p2 text-white md:p-6 lg:p-10">
				<h1 className="d1 @md:text-center">Welcome to Sunlo</h1>
				<div className="w-app">
					<p className="my-4 mb-10 text-2xl @md:text-center">
						Let&apos;s get started
					</p>
					<SetUsernameStep value={tempUsernameToUse} set={setTempUsername} />
					<SetPrimaryLanguageStep
						value={tempLanguagePrimaryToUse}
						set={setTempLanguagePrimary}
					/>
					<CreateFirstDeckStep value={tempDeckToAdd} set={setTempDeckToAdd} />
					{tempLanguagePrimaryToUse &&
						(tempDeckToAdd || deckLanguages?.length > 0) &&
						tempUsernameToUse && (
							<div className="my-6 flex flex-row-reverse items-center justify-around"></div>
						)}
				</div>
				<ShowError show={!!mainForm?.error}>
					Problem inserting profile or making deck:{' '}
					{mainForm?.error?.message || 'unknown error, sorry. call m.'}
				</ShowError>
			</main>
		</>
	)
}

function ShowSuccess({ tempDeckToAdd }: { tempDeckToAdd?: string }) {
	return (
		<main className="p2 w-app flex min-h-[85vh] flex-col justify-center gap-12 text-white md:p-6 lg:p-10">
			<div className="flex flex-row place-items-center justify-center gap-4">
				<SuccessCheckmark />
				<h1 className="h1">You&apos;re all set!</h1>
			</div>
			<div className="flex flex-col space-y-4">
				{typeof tempDeckToAdd === 'string' ?
					<Link
						to={`/learn/$lang`}
						params={{ lang: tempDeckToAdd }}
						from={Route.fullPath}
						className="btn btn-secondary mx-auto"
					>
						Get started learning {languages[tempDeckToAdd]}
						&nbsp;&rarr;
					</Link>
				:	null}
				<Link href="/profile" className="btn btn-ghost mx-auto">
					Go to your profile&nbsp;&rarr;
				</Link>
			</div>
		</main>
	)
}

const SetPrimaryLanguageStep = ({ value, set }) => {
	const [closed, setClosed] = useState<boolean>(true)
	return closed && value?.length > 0 ?
			<Completed>
				<p className="h4">
					Your primary language is <Highlight>{languages[value]}</Highlight>
				</p>
				<X set={() => setClosed(false)} />
			</Completed>
		:	<form
				className="card-white mb-16"
				onSubmit={(e: FormEvent<HTMLFormElement>) => {
					e.preventDefault()
					setClosed(true)
					set(e.target['language_primary'].value)
				}}
			>
				<h2 className="h2">Set primary language</h2>
				<div className="flex flex-col">
					<label className="py-2 font-bold">The language you know best</label>
					<select
						value={value || ''}
						name="language_primary"
						onChange={(e) => {
							set(e.target.value)
							setClosed(true)
						}}
						className="mb-6 rounded border bg-base-100 p-3 text-base-content"
					>
						<option value="">-- select one --</option>
						<option value="eng">English</option>
						{Object.keys(languages).map((k) => {
							return k === 'eng' ? null : (
									<option key={`language-dropdown-option-${k}`} value={k}>
										{languages[k]}
									</option>
								)
						})}
					</select>
					{value ?
						<a
							className="s-link"
							onClick={() => {
								setClosed(true)
							}}
						>
							Continue with {languages[value]}
						</a>
					:	null}
				</div>
			</form>
}

const CreateFirstDeckStep = ({
	value,
	set,
}: {
	value: string
	set: (value: string) => void
}) => {
	const langs = useProfile()?.data?.deckLanguages

	const [closed, setClosed] = useState(true)
	return closed && langs.length ?
			<Completed>
				<h2 className="h4 flex-none">
					{!value && langs.length > 0 ?
						<>
							You&apos;re working on{' '}
							<Highlight>
								{langs.map((lang) => languages[lang]).join(', ')}
							</Highlight>
						</>
					: !value && !(langs.length > 0) ?
						<>Wait you have to learn something or what&apos;s the point</>
					:	<>
							Starting a deck of flash cards for{' '}
							<Highlight>{languages[value]}</Highlight> phrases
						</>
					}
				</h2>

				<X
					plus={!value && langs.length > 0}
					set={(v = '') => {
						set(v)
						setClosed(false)
					}}
				/>
			</Completed>
		:	<form className="card-white mb-16">
				<h2 className="h2">
					Create {langs.length === 0 ? 'your first deck' : 'another deck'}
				</h2>
				{langs.length > 0 ?
					<p className="py-2">
						FYI you&apos;re already learning{' '}
						{langs.map((lang) => languages[lang]).join(', ')}
					</p>
				:	null}
				<div className="flex flex-col">
					<label className="py-2 font-bold">
						The language you want to learn
					</label>
					<select
						value={value || ''}
						name="language_primary"
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
							set(e.target.value)
							setClosed(true)
						}}
						className="mb-6 rounded border bg-base-100 p-3 text-base-content"
					>
						<option value="">-- select one --</option>
						{Object.keys(languages).map((k) => {
							const isInLearningSet = langs.indexOf(k) >= 0 ? true : false
							return (
								<option
									key={`language-dropdown-option-${k}`}
									value={k}
									disabled={isInLearningSet}
									className={isInLearningSet ? 'bg-gray-500/20' : ''}
								>
									{languages[k]}
								</option>
							)
						})}
					</select>
					{langs.length > 0 && !value ?
						<a onClick={() => setClosed(true)} className="s-link">
							Skip this step
						</a>
					:	null}
				</div>
			</form>
}

const SetUsernameStep = ({
	value,
	set,
}: {
	value: string
	set: (value: string) => void
}) => {
	const [closed, setClosed] = useState(true)
	return closed && value ?
			<Completed>
				<p className="h4 block">
					Your username is <Highlight>{value}</Highlight>
				</p>
				<X set={() => setClosed(false)} />
			</Completed>
		:	<form
				className="card-white mb-16"
				onSubmit={(e: FormEvent<HTMLFormElement>) => {
					e.preventDefault()
					if (e.target['username'].value) setClosed(true)
				}}
			>
				<h2 className="h2">Pick a username</h2>
				<div className="flex flex-col">
					<label className="py-2 font-bold">
						Username for your public profile
					</label>
					<input
						type="text"
						className="s-input"
						name="username"
						placeholder="Lernie McSanders"
						value={value || ''}
						onChange={(e) => {
							set(e.target.value)
						}}
					/>
				</div>
				<button className="btn btn-ghost my-4" type="submit">
					Do the thing
				</button>
			</form>
}

const X = ({ set, plus = false }: { set: () => void; plus?: boolean }) => (
	<button
		onClick={() => set()}
		className={cn(
			'btn btn-ghost block flex-none rounded-full',
			plus ? 'rotate-45' : ''
		)}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-4 w-4 text-white"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M6 18L18 6M6 6l12 12"
			/>
		</svg>
	</button>
)

const Completed = ({ children }: { children: React.ReactNode }) => (
	<div className="glass mb-8 flex flex-row justify-between gap-x-4 rounded-xl px-6 py-4 text-white">
		<div>{children[0]}</div>
		<div className="place-self-center">{children[1]}</div>
	</div>
)

const Highlight = ({ children }: { children: React.ReactNode }) => (
	<span className="inline bg-accent bg-opacity-60 px-1 font-bold">
		{children}
	</span>
)
