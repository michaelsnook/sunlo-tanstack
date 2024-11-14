import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Loader } from 'lucide-react'

import { useAuth } from '@/lib/hooks'
import { useProfile } from '@/lib/use-profile'
import ProfileCreationForm from '@/components/profile-creation-form'

export const Route = createFileRoute('/_user/getting-started')({
	component: GettingStartedPage,
})

function GettingStartedPage() {
	const { userId, userRole } = useAuth()
	const { data: profile, isPending: profilePending } = useProfile()
	console.log(`GettingStartedPage`, userId, userRole, profile)
	const nextPage =
		userRole === 'learner' ? '/learn/add-deck' : '/profile/friend-request'
	const { navigate } = useRouter()
	const proceed = () => navigate({ to: nextPage, from: Route.fullPath })

	return profilePending ?
			<Loader />
		:	<main className="dark w-app py-10">
				<div className="space-y-4 my-4 text-center">
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						Welcome to Sunlo
					</h1>
					<p className="text-2xl text-muted-foreground">
						Let&apos;s get started
					</p>
				</div>
				<ProfileCreationForm
					userId={userId}
					profile={profile}
					proceed={proceed}
				/>
			</main>
}
