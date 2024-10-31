import { type FormEvent, SyntheticEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import supabase from '@/lib/supabase-client'
import { useAuth } from '@/lib/hooks'
import { useProfile } from '@/lib/use-profile'
import { ShowError } from '@/components/errors'
import languages from '@/lib/languages'
import SuccessCheckmark from '@/components/SuccessCheckmark'
import { Card, CardContent } from '@/components/ui/card'
import { ReactNode } from '@tanstack/react-router'

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
			void queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
		},
	})

	const reset = () => {
		setTempLanguagePrimary(profile.data?.language_primary)
		setTempDeckToAdd(null)
		setTempUsername(profile.data?.username)
	}

	// if (mainForm.error) console.log(`Error logging:`, mainForm)
	if (mainForm.isSuccess) return <ShowSuccess tempDeckToAdd={tempDeckToAdd} />
	const { deckLanguages } = profile.data

	const cardClass = 'mb-8 rounded px-6 py-4 border border-2'

	return (
		<main className="text-white p-4 @md:p-6 @lg:p-10 pb-10">
			<h1 className="d1 @md:text-center">Welcome to Sunlo</h1>
			<div className="w-app space-y-10">
				<p className="my-4 mb-10 text-2xl @md:text-center">
					Let&apos;s get started
				</p>
				<Card className={cardClass}>
					<SetUsernameStep
						value={tempUsernameToUse}
						setValue={setTempUsername}
					/>
				</Card>
				<Card className={cardClass}>
					<SetPrimaryLanguageStep
						value={tempLanguagePrimaryToUse}
						setValue={setTempLanguagePrimary}
					/>
				</Card>
				<Card className={cardClass}>
					<CreateFirstDeckStep
						value={tempDeckToAdd}
						setValue={setTempDeckToAdd}
					/>
				</Card>
				{(
					tempLanguagePrimaryToUse &&
					(tempDeckToAdd || deckLanguages?.length > 0) &&
					tempUsernameToUse
				) ?
					<div className="flex flex-col @md:flex-row items-center md:justify-between gap-4">
						<Button
							onClick={(event: SyntheticEvent<HTMLButtonElement>): void => {
								event.preventDefault()
								mainForm.mutate()
							}}
							size="lg"
							disabled={mainForm.isPending}
						>
							Confirm and get started!
						</Button>
						<Button
							onClick={reset}
							disabled={mainForm.isPending}
							variant="secondary"
							size="lg"
						>
							Reset page
						</Button>
					</div>
				:	<></>}
				{!profile.data?.uid ? null : (
					<div className="text-center @md:text-start">
						<Link to="/profile" className="s-link text-xl" tabIndex={-1}>
							<ArrowLeftIcon className="inline-block w-4 h-4 ml-1" />
							Back to profile page
						</Link>
					</div>
				)}
				<ShowError show={!!mainForm?.error}>
					Problem inserting profile or making deck:{' '}
					{mainForm?.error?.message || 'unknown error, sorry. call m.'}
				</ShowError>
			</div>
		</main>
	)
}

function ShowSuccess({ tempDeckToAdd }: { tempDeckToAdd?: string }) {
	return (
		<main className="p2 w-app flex min-h-[85vh] flex-col justify-center gap-12 text-white md:p-6 lg:p-10">
			<div className="flex flex-row place-items-center justify-center gap-4">
				<SuccessCheckmark />
				<h1 className="h1">You&apos;re all set!</h1>
			</div>
			<div className="space-y-4 text-center">
				{typeof tempDeckToAdd === 'string' ?
					<p>
						<Link
							to={`/learn/$lang`}
							params={{ lang: tempDeckToAdd }}
							from={Route.fullPath}
							className={buttonVariants({ variant: 'default', size: 'lg' })}
						>
							Get started learning {languages[tempDeckToAdd]}
							<ArrowRightIcon className="w-4 h-4 ml-2" />
						</Link>
					</p>
				:	null}
				<p>
					<Link
						to="/profile"
						from={Route.fullPath}
						className={buttonVariants({ variant: 'default' })}
					>
						Go to your profile
						<ArrowRightIcon className="w-4 h-4 ml-2" />
					</Link>
				</p>
			</div>
		</main>
	)
}

interface SetValueStepProps {
	value: string
	setValue: (value: string) => void
}

const SetPrimaryLanguageStep = ({ value, setValue }: SetValueStepProps) => {
	const [closed, setClosed] = useState<boolean>(true)
	return closed && value?.length > 0 ?
			<CardContent className="flex flex-row justify-between gap-x-4 pb-1">
				<p className="h4">
					Your primary language is <Highlight>{languages[value]}</Highlight>
				</p>
				<X set={() => setClosed(false)} />
			</CardContent>
		:	<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						setClosed(true)
						// @ts-expect-error -- TODO add rhf and zod
						setValue(e.target['language_primary'].value)
					}}
				>
					<h2 className="h2">Set primary language</h2>
					<div className="flex flex-col">
						<Label className="py-2 font-bold">The language you know best</Label>
						<select
							value={value || ''}
							name="language_primary"
							onChange={(e) => {
								setValue(e.target.value)
								setClosed(true)
							}}
							className="mb-6 rounded border p-3"
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
			</CardContent>
}

function CreateFirstDeckStep({ value, setValue }: SetValueStepProps) {
	const langs = useProfile()?.data?.deckLanguages

	const [closed, setClosed] = useState(true)
	return closed && langs.length ?
			<CardContent className="flex flex-row justify-between gap-x-4 pb-1">
				<p className="h4">
					{!value && langs.length ?
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
				</p>

				<X
					plus={!value && langs.length > 0}
					set={(v = '') => {
						setValue(v)
						setClosed(false)
					}}
				/>
			</CardContent>
		:	<CardContent>
				<form>
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
						<Label>The language you want to learn</Label>
						<select
							value={value || ''}
							name="language_primary"
							onChange={(e) => {
								setValue(e.target.value)
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
			</CardContent>
}

function SetUsernameStep({ value, setValue }: SetValueStepProps) {
	const [closed, setClosed] = useState(true)
	return closed && value ?
			<CardContent className="flex flex-row justify-between gap-x-4 pb-1">
				<p className="h4 block">
					Your username is <Highlight>{value}</Highlight>
				</p>
				<X set={() => setClosed(false)} />
			</CardContent>
		:	<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						// @ts-expect-error -- TODO add rhf and zod
						if (e.target['username'].value) setClosed(true)
					}}
				>
					<h2 className="h2">Pick a username</h2>
					<div className="flex flex-col">
						<Label>Username for your public profile</Label>
						<Input
							type="text"
							name="username"
							placeholder="Lernie McSanders"
							value={value || ''}
							onChange={(e) => {
								setValue(e.target.value)
							}}
						/>
					</div>
					<Button className="my-4" variant="default" type="submit">
						Continue
					</Button>
				</form>
			</CardContent>
}

interface XProps {
	set: () => void
	plus?: boolean
}

function X({ set, plus = false }: XProps) {
	return (
		<Button
			onClick={() => set()}
			size="icon"
			variant="ghost"
			asChild
			className="h-10 w-10 p-2 flex-none"
		>
			<PlusIcon className={plus ? '' : 'rotate-45'} />
		</Button>
	)
}

function Highlight({ children }: { children: ReactNode }) {
	return (
		<span className="inline bg-accent bg-opacity-60 px-1 font-bold">
			{children}
		</span>
	)
}
