import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ShowError } from '@/components/errors'
import { SelectOneLanguage } from '@/components/select-one-language'
import { Button } from '@/components/ui/button'
import { useNewDeckMutation } from '@/lib/mutate-deck'
import { useProfile } from '@/lib/use-profile'
import { useState } from 'react'
import { NavbarData } from '@/types/main'

export const Route = createFileRoute('/learn/add-deck')({
	loader: () => ({
		navbar: {
			title: `StartLearning a New Language`,
		} as NavbarData,
	}),
	component: NewDeckForm,
})

function NewDeckForm() {
	const [lang, setLang] = useState('')
	const createNewDeck = useNewDeckMutation()
	const {
		data: { deckLanguages },
	} = useProfile()

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		createNewDeck.mutate({ lang })
	}

	return (
		<main className="w-app px-3 @sm:px-[6%] space-y-4 py-6">
			<form name="new-deck" onSubmit={handleSubmit} className="max-w-[30rem]">
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
			</form>
			<ShowError>{createNewDeck.error?.message}</ShowError>
		</main>
	)
}
