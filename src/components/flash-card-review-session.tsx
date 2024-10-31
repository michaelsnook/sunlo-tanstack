import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, ChevronLeft, ChevronRight } from 'lucide-react'
import SuccessCheckmark from './SuccessCheckmark'
import toast from 'react-hot-toast'
import { CardsMap, uuid } from '@/types/main'

interface FlashCard {
	originalPhrase: string
	translation: string
}

const flashCards: FlashCard[] = [
	{
		originalPhrase: 'Bonjour, comment allez-vous?',
		translation: 'Hello, how are you?',
	},
	{ originalPhrase: "Je m'appelle Jean", translation: 'My name is John' },
	{
		originalPhrase: 'Où est la bibliothèque?',
		translation: 'Where is the library?',
	},
]

interface ComponentProps {
	pids: Array<uuid>
	cardsMap: CardsMap
}

export function FlashCardReviewSession({ pids, cardsMap }: ComponentProps) {
	const [currentCardIndex, setCurrentCardIndex] = useState(0)
	const [showTranslation, setShowTranslation] = useState(false)
	const [isReviewComplete, setIsReviewComplete] = useState(false)

	const playAudio = (text: string) => {
		toast(`Playing audio for: ${text}`)
		// In a real application, you would trigger audio playback here
	}

	const navigateCards = (direction: 'forward' | 'back') => {
		if (direction === 'forward' && currentCardIndex < flashCards.length) {
			if (currentCardIndex === flashCards.length - 1) setIsReviewComplete(true)
			setCurrentCardIndex(currentCardIndex + 1)
		} else if (direction === 'back' && currentCardIndex > 0) {
			if (currentCardIndex === flashCards.length) setIsReviewComplete(false)
			setCurrentCardIndex(currentCardIndex - 1)
		}
		setShowTranslation(false)
	}
	const handleDifficultySelect = (difficulty: string) => {
		console.log(
			`Selected difficulty for card ${currentCardIndex + 1}: ${difficulty}`
		)
		navigateCards('forward')
	}

	const currentCard = flashCards[currentCardIndex] ?? null

	return (
		<Card className="w-full mx-auto h-[80vh] flex flex-col justify-center">
			<CardHeader>
				<div className="flex justify-center items-center mb-4 gap-1">
					<Button
						size="icon-sm"
						variant="ghost"
						onClick={() => navigateCards('back')}
						disabled={currentCardIndex === 0}
						aria-label="Previous card"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<div className="text-sm text-center">
						Card {currentCardIndex + 1} of {flashCards.length}
					</div>
					<Button
						size="icon-sm"
						variant="ghost"
						onClick={() => navigateCards('forward')}
						disabled={currentCardIndex === flashCards.length}
						aria-label="Next card"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			{isReviewComplete ?
				<CardContent className="flex flex-grow flex-col items-center justify-center gap-4 pb-16">
					<h2 className="text-2xl font-bold">Good work!</h2>
					<p className="text-lg">You've completed your review for today.</p>
					<SuccessCheckmark />
				</CardContent>
			:	<CardContent className="flex flex-grow flex-col pt-6">
					<div className="flex-grow flex flex-col items-center justify-center">
						<div className="flex items-center justify-center mb-4">
							<div className="text-2xl font-bold text-center mr-2">
								{currentCard.originalPhrase}
							</div>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => playAudio(currentCard.originalPhrase)}
								aria-label="Play original phrase"
							>
								<Play className="h-4 w-4" />
							</Button>
						</div>
						{showTranslation && (
							<div className="flex items-center justify-center mt-4">
								<div className="text-xl text-center mr-2">
									{currentCard.translation}
								</div>
								<Button
									size="icon"
									variant="ghost"
									onClick={() => playAudio(currentCard.translation)}
									aria-label="Play translation"
								>
									<Play className="h-4 w-4" />
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			}
			{currentCard === null ? null : (
				<CardFooter className="flex flex-col">
					{!showTranslation ?
						<Button
							className="w-full mb-4"
							onClick={() => setShowTranslation(true)}
						>
							Show Translation
						</Button>
					:	<div className="w-full grid grid-cols-4 gap-2">
							<Button
								variant="destructive"
								onClick={() => handleDifficultySelect('again')}
							>
								Again
							</Button>
							<Button
								variant="secondary"
								onClick={() => handleDifficultySelect('hard')}
							>
								Hard
							</Button>
							<Button
								variant="default"
								className="bg-green-500 hover:bg-green-600"
								onClick={() => handleDifficultySelect('good')}
							>
								Good
							</Button>
							<Button
								variant="default"
								className="bg-blue-500 hover:bg-blue-600"
								onClick={() => handleDifficultySelect('easy')}
							>
								Easy
							</Button>
						</div>
					}
				</CardFooter>
			)}
		</Card>
	)
}
