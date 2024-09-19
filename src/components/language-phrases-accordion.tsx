import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from 'components/ui/accordion'
import { useDeck } from 'lib/use-deck'
import { Zap, SkipForward, CheckCircle, PlusCircle } from 'lucide-react'
import { PhraseFull, PhrasesMap, pids, uuid } from 'types/main'
import { Button } from './ui/button'
import { useMutation } from '@tanstack/react-query'
import supabase from 'lib/supabase-client'

// TODO check if we can get this from the supabase types?
type LearningStatus = 'active' | 'skipped' | 'learned'

const getStatusIcon = (
	status: LearningStatus | undefined,
	addToDeck: () => void
) => {
	console.log(`status`, status)
	switch (status) {
		case 'active':
			return <Zap className="h-4 w-4 text-yellow-500" aria-label="Active" />
		case 'skipped':
			return (
				<SkipForward className="h-4 w-4 text-gray-500" aria-label="Skipped" />
			)
		case 'learned':
			return (
				<CheckCircle className="h-4 w-4 text-green-500" aria-label="Learned" />
			)
		case null:
			return (
				<Button
					variant="default"
					size="sm"
					onClick={addToDeck}
					className="p-0 h-auto"
					aria-label="Add to deck"
				>
					<PlusCircle className="h-4 w-4 text-gray-500" />
				</Button>
			)
	}
}

interface PhrasesWithOptionalOrder {
	phrasesMap: PhrasesMap
	pids?: pids
}

export function LanguagePhrasesAccordionComponent({
	phrasesMap,
	pids = null,
}: PhrasesWithOptionalOrder) {
	const set = pids || Object.keys(phrasesMap)
	const lang = phrasesMap[set[0]].lang

	// now do UI
	// if called in a no-auth place the statuses should simply not show

	const deckQuery = useDeck(lang)
	const deckId = deckQuery.data?.meta.id
	const cardsMap = deckQuery.data?.cardsMap

	const addToDeck = useMutation({
		mutationFn: async (pid: uuid) => {
			if (!deckId) throw new Error('No deck ID loaded')
			const { data } = await supabase
				.from('user_card')
				.insert({ user_deck_id: deckId, phrase_id: pid })
				.select()
				.throwOnError()
			return data[0]
		},
	})
	if (!set || !set.length || !phrasesMap) return null
	return (
		<Accordion type="single" collapsible className="w-full p-2">
			{set.map((pid) => {
				const phrase: PhraseFull = phrasesMap[pid]
				// if there's no deck, leave it undefined so the button doesn't even show
				const status = cardsMap[pid].status || (deckId ? null : undefined)
				console.log(`map inner`, pid, phrase, status, deckId)
				return (
					<AccordionItem key={pid} value={pid}>
						<AccordionTrigger className="flex items-center">
							<div className="flex items-center space-x-2">
								{deckId && getStatusIcon(status, () => addToDeck.mutate(pid))}
								<span className="">{phrase.text}</span>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<div className="pl-6 pt-2">
								<p className="text-sm text-gray-500 mb-1">Translations</p>
								<ul className="space-y-1">
									{phrase.translations.map((translation, index) => (
										<li key={index} className="flex items-center">
											<span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs mr-2">
												{translation.lang}
											</span>
											<span className="text-sm">{translation.text}</span>
										</li>
									))}
								</ul>
							</div>
						</AccordionContent>
					</AccordionItem>
				)
			})}
		</Accordion>
	)
}
