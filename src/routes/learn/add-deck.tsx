import { createFileRoute } from '@tanstack/react-router'
import { ShowError } from 'components/errors'
import { SelectOneLanguage } from 'components/select-one-language'
import { useNewDeckMutation } from 'lib/mutate-deck'
import { useProfile } from 'lib/use-profile'
import { useState } from 'react'
import { NavbarData } from 'types/main'

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
		<main className="w-app space-y-4 py-6 px-2">
			<form name="new-deck" onSubmit={handleSubmit}>
				<h2 className="h3">What language would you like to learn?</h2>
				<SelectOneLanguage
					value={lang}
					setValue={setLang}
					disabled={deckLanguages}
				/>

				<button
					type="submit"
					className="btn btn-primary my-6 rounded"
					disabled={createNewDeck.isPending}
				>
					{createNewDeck.isPending ? 'Starting...' : 'Start learning'}
				</button>
			</form>
			<ShowError>{createNewDeck.error?.message}</ShowError>
		</main>
	)
}
