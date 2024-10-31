import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from 'lib/supabase-client'
import toast from 'react-hot-toast'
import { DeckRow } from 'types/main'
import languages from './languages'
import { useNavigate } from '@tanstack/react-router'

async function postNewDeck(lang: string) {
	// console.log(`postNewDeck ${lang}`)
	if (typeof lang !== 'string' || lang.length !== 3)
		throw new Error('Form not right. Maybe refresh. Or tell the devs.')
	const { data, error } = await supabase
		.from('user_deck')
		.insert({ lang })
		.select()
	// console.log(`postNewDeck`, data, error)
	if (error) throw error
	return data[0] as DeckRow
}

export const useNewDeckMutation = () => {
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const mutation = useMutation({
		mutationFn: async (variables: { lang: string }) => {
			return await postNewDeck(variables.lang)
		},
		mutationKey: ['new-deck'],
		onSuccess: (_, variables) => {
			void queryClient.invalidateQueries({ queryKey: ['user'] })
			toast.success(`Created a new deck to learn ${languages[variables.lang]}`)
			void navigate({ to: `/learn/$lang`, params: { lang: variables.lang } })
		},
		onError: (error) => {
			console.log(`Error creating deck:`, error)
			toast.error(`Error creating deck: ${error.message}`)
		},
	})

	return mutation
}
