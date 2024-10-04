import { type FormEvent, useState } from 'react'
import {
	UseMutationResult,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import ModalWithOpener from 'components/modal-with-opener'
import supabase from 'lib/supabase-client'
import SelectLanguageYouKnow from 'components/select-language-you-know'
import Loading from 'components/loading'
import toast from 'react-hot-toast'
import { ShowError } from 'components/errors'
import { TranslationRow, SelectOption, PhraseFull } from 'types/main'
import { PostgrestError, QueryResult } from '@supabase/supabase-js'
import { Button } from './ui/button'

interface ModalProps {
	phrase: PhraseFull
	close: () => void
}

export default function AddTranslationsModal({ phrase, close }: ModalProps) {
	const queryClient = useQueryClient()
	const [translationLang, setTranslationLang] = useState('')
	const addTranslation = useMutation({
		mutationFn: async (text: string) => {
			if (typeof text !== 'string' || !(text.length > 0))
				throw Error('there is no translation text')
			console.log(`Running mutation with`, text, translationLang, phrase.id)
			const { data, error } = (await supabase
				.from('phrase_translation')
				.insert({
					phrase_id: phrase.id,
					lang: translationLang,
					text,
				})
				.select()) as QueryResult<Array<TranslationRow>>
			if (error) throw error
			console.log(`The Data`, data)
			return data[0]
		},
		onSuccess: (data) => {
			console.log(`onSuccess with data`, data)
			toast.success('Added a new translation')
			void queryClient.invalidateQueries()
			close()
		},
	}) as UseMutationResult<TranslationRow, PostgrestError>

	return (
		<ModalWithOpener
			title="Add a translation"
			description={`Adding a description for the phrase "${phrase.text}"`}
			onClose={addTranslation.reset}
		>
			<form
				onSubmit={(e: FormEvent<HTMLFormElement>) => {
					e.preventDefault()
					console.log(`Submitting form with`, e)
					const val = e.target?.['translation_text']?.value ?? ''
					addTranslation.mutate(val)
				}}
			>
				<fieldset className="space-y-4" disabled={addTranslation.isPending}>
					<div className="form-control">
						<label>Into which language?</label>
						<SelectLanguageYouKnow
							disabledLang={phrase.lang}
							onChange={(val: SelectOption) => setTranslationLang(val.value)}
						/>
					</div>
					<div className="form-control">
						<label>What is the translation?</label>
						<textarea name="translation_text" />
					</div>
					{/*<div className="text-sm">
              Is there a more literal translation that might help understand the
              meaning?
            </div>*/}
					<Button
						type="submit"
						variant="default"
						disabled={addTranslation.isPending}
					>
						{addTranslation.isPending ?
							<Loading />
						:	`Submit translation`}
					</Button>
					<ShowError show={!!addTranslation.error}>
						{addTranslation.error?.['code'] === '23505' ?
							`This translation already exists for this phrase`
						:	addTranslation.error?.message}
					</ShowError>
				</fieldset>
			</form>
		</ModalWithOpener>
	)
}
