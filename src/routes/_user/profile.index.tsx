import { buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useProfile } from '@/lib/use-profile'
import { FriendshipRow, LangOnlyComponentProps } from '@/types/main'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
	AvatarSection,
	UpdateProfileForm,
	UserAuthCard,
} from 'components/profile'
import { ArrowRightIcon, Plus } from 'lucide-react'

export const Route = createFileRoute('/_user/profile/')({
	component: ProfilePage,
})

function ProfilePage() {
	return (
		<>
			<AvatarSection />
			<div className="w-full text-center">
				<Link to="/getting-started" className="s-link text-xl" tabIndex={-1}>
					Get Started <ArrowRightIcon className="inline-block w-4 h-4 ml-1" />
				</Link>
			</div>
			<div className="card-page">
				<div className="h3">
					<h3>Edit Profile</h3>
					<p>Update your profile information.</p>
				</div>

				<UpdateProfileForm />
			</div>
			<FriendsSection />
			<div className="card-page">
				<div className="h3">
					<h3>Login Credentials</h3>
					<p>Update your email or password (or signin method)</p>
				</div>
				<UserAuthCard />
			</div>
		</>
	)
}

// TODO the database doesn't have friendships yet so this is all mockup-y
// and the type is also mocked
function FriendsSection({ lang }: LangOnlyComponentProps) {
	const profileQuery = useProfile()
	if (profileQuery.data === null) return null

	const friendsThisLanguage =
		profileQuery.data?.friendships?.filter(
			(f: FriendshipRow) => f.helping_with.indexOf(lang) !== -1
		) || []

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Friends</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<ul className="list-disc ml-4">
					<li>mahesh (see recent activity or whatever)</li>
					<li>a-money (you have a new phrase from them)</li>
					<li>j-bhai (nothing special actually)</li>
				</ul>
				<Link
					to="/profile/friend-request"
					from={Route.fullPath}
					className={buttonVariants({ variant: 'secondary' })}
				>
					Invite friends
				</Link>
			</CardContent>
		</Card>
	)
}
