import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/hooks'
import ProfileCreationForm from '@/components/profile-creation-form'
import { useProfile } from '@/lib/use-profile'
import { Loader2 } from 'lucide-react'
import SuccessCheckmark from '@/components/SuccessCheckmark'

export const Route = createFileRoute('/_user/getting-started')({
	component: GettingStartedPage,
})

function GettingStartedPage() {
	const { userId, userRole } = useAuth()
	const { data: profile } = useProfile()

	const nextPage =
		userRole === 'learner' ? '/learn/add-deck' : '/friends/request'

	return (
		profile === undefined ? <Loader2 className="mx-auto my-10" />
		: profile !== null ? <Navigate to={nextPage} />
		: <main className="dark w-app py-10 px-[5cqw]">
				<div className="space-y-4 my-4 text-center">
					<h1 className="d1">Welcome to Sunlo</h1>
					<div className="max-w-sm flex flex-row gap-4  mx-auto items-center">
						<SuccessCheckmark className="bg-transparent" />
						<p className="text-2xl font-thin text-muted-foreground">
							Thanks&nbsp;for&nbsp;confirming your email &ndash; let&apos;s
							get&nbsp;you&nbsp;set&nbsp;up.
						</p>
					</div>
				</div>
				<ProfileCreationForm userId={userId} />
			</main>
	)
}
