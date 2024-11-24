import { createFileRoute, Link } from '@tanstack/react-router'

import { Mail, Phone, Search } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useProfile } from '@/lib/use-profile'
import { NativeShareButton } from '@/components/native-share-button'

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
								to="/friends/search"
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
	const { data: profile } = useProfile()
	const shareData = {
		text: `Hello friend, I'm learning a language with Sunlo, a social language learning app. Will you join me? https://sunlo.app/signup`,
		title: `Invitation! ${profile?.username || 'Join your friend'} on Sunlo.app`,
	}

	return (
		<div>
			<div className="flex flex-col @md:flex-row gap-2">
				<NativeShareButton shareData={shareData} />
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
		</div>
	)
}
