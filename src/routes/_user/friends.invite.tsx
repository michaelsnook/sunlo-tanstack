import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { Mail, Phone, Search, Share } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { ShowError } from '@/components/errors'
import { useProfile } from '@/lib/use-profile'

export const Route = createFileRoute('/_user/friends/invite')({
	component: InviteFriendPage,
})

function InviteFriendPage() {
	return (
		<main className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>
						<div className="flex flex-row justify-between items-center">
							<span>Invite a Friend</span>
							<Link
								to="/friends/request"
								aria-disabled="true"
								className={buttonVariants({
									size: 'badge',
									variant: 'outline',
								})}
							>
								<Search className="h-3 w-3" />
								<span className="me-1">Search </span>
							</Link>
						</div>
					</CardTitle>
					<CardDescription>
						Invite a friend to learn with you or to help you learn.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ShareButtons />
				</CardContent>
			</Card>
		</main>
	)
}

function ShareButtons() {
	const canShare = typeof navigator?.share === 'function'
	const [error, setError] = useState<
		null | DOMException | TypeError | { message: string }
	>(null)
	const { data: profile } = useProfile()
	const shareData = {
		text: `Hello friend, I'm learning a language with Sunlo, a social language learning app. Will you join me? https://sunlo.app/signup`,
		title: `Invitation! ${profile?.username} on Sunlo.app`,
	}
	const onClick = (): void => {
		// console.log('sharing...', navigator, navigator?.canShare())
		if (navigator?.share)
			navigator
				.share(shareData)
				.then(() => setError(null))
				.catch((error: DOMException | TypeError) => {
					console.log(
						`Some error has occurred while sharing. It could just be they cancelled the share.`,
						error
					)
					// setError(error)
				})
		else {
			console.log(`not sharing bc not supported`)
			setError({
				message: `Sorry, we can't open your device's share interface. Please try one of the other options.`,
			})
		}
	}
	return (
		<div>
			<div className="flex flex-col @md:flex-row gap-2">
				{canShare ?
					<Button size="lg" onClick={onClick}>
						Share <Share />
					</Button>
				:	null}
				<a
					className={buttonVariants({ size: 'lg', variant: 'secondary' })}
					href={`mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text)}`}
				>
					Email <Mail />
				</a>
				<a
					className={buttonVariants({ size: 'lg', variant: 'secondary' })}
					href={`whatsapp://send?text=${encodeURIComponent(shareData.text)}`}
				>
					WhatsApp <Phone className="outline outline-1 rounded-full p-px" />
				</a>
			</div>
			<ShowError>{error?.message}</ShowError>
		</div>
	)
}
