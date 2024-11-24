import React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ShowError } from '@/components/errors'
import { SelectOneLanguage } from '@/components/select-one-language'
import { Button, buttonVariants } from '@/components/ui/button'
import { useNewDeckMutation } from '@/lib/mutate-deck'
import { useProfile } from '@/lib/use-profile'
import { useState } from 'react'
import { NavbarData } from '@/types/main'
import { Badge } from '@/components/ui/badge'
import languages from '@/lib/languages'
import Callout from '@/components/ui/callout'

export const Route = createFileRoute('/learn/add-deck')({
	loader: () => ({
		navbar: {
			title: `Start Learning a New Language`,
		} as NavbarData,
	}),
	component: NewDeckForm,
})

function NewDeckForm() {
	const [lang, setLang] = useState('')
	const createNewDeck = useNewDeckMutation()
	const { data } = useProfile()
	const deckLanguages = data?.deckLanguages ?? []
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		createNewDeck.mutate({ lang })
	}
	const showNewUserUI = data !== undefined && deckLanguages.length === 0

	return (
		<main className="w-app px-3 @sm:px-[6%] space-y-4 py-6 dark">
			<form name="new-deck" onSubmit={handleSubmit} className="space-y-4">
				{showNewUserUI ?
					<Callout>
						<span>👋</span>
						<div className="space-y-2">
							<p>
								Welcome <em>{data?.username}</em>!
							</p>
							<p>
								Create a new deck to start learning, or go to your profile to
								check for friend requests.
							</p>
						</div>
					</Callout>
				:	<p>
						You're currently learning{' '}
						{deckLanguages.map((l) => (
							<Badge className="mx-1">{languages[l]}</Badge>
						))}
					</p>
				}
				<h2 className="h3">What language would you like to learn?</h2>
				<SelectOneLanguage
					value={lang}
					setValue={setLang}
					disabled={deckLanguages}
				/>

				<Button
					type="submit"
					variant="default"
					className="my-6"
					disabled={createNewDeck.isPending}
				>
					{createNewDeck.isPending ? 'Starting...' : 'Start learning'}
				</Button>
				{showNewUserUI ?
					<Link
						to={`/friends/search`}
						className={buttonVariants({ variant: 'link' })}
					>
						View friend requests
					</Link>
				:	null}
			</form>
			<ShowError>{createNewDeck.error?.message}</ShowError>
		</main>
	)
}
