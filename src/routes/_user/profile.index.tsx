import { buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
	AvatarSection,
	UpdateProfileForm,
	UserAuthCard,
} from '@/components/profile'
import { Loader2 } from 'lucide-react'
import { useRelations } from '@/lib/friends'

export const Route = createFileRoute('/_user/profile/')({
	component: ProfilePage,
})

function ProfilePage() {
	return (
		<main className="px-px flex flex-col gap-6">
			<AvatarSection />

			<Card>
				<CardHeader>
					<CardTitle>Edit Profile</CardTitle>
					<CardDescription>Update your profile information</CardDescription>
				</CardHeader>
				<CardContent>
					<UpdateProfileForm />
				</CardContent>
			</Card>

			<FriendsSection />

			<Card>
				<CardHeader>
					<CardTitle>Login Credentials</CardTitle>
					<CardDescription>
						Update your email or password (or signin method)
					</CardDescription>
				</CardHeader>
				<CardContent>
					<UserAuthCard />
				</CardContent>
			</Card>
		</main>
	)
}

// TODO the database doesn't have friendships yet so this is all mockup-y
// and the type is also mocked
function FriendsSection() {
	const { data, isPending } = useRelations()

	return isPending ?
			<Loader2 />
		:	<Card>
				<CardHeader>
					<CardTitle>Your Friends</CardTitle>
					<CardDescription>
						NB: This is just sample activity; there's no database object yet for
						friend-viewable user activity
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<ul className="list-disc ml-4">
						{data.uids.friends.map((uid) => {
							const d = data.relationsMap[uid]
							return !d.profile ? null : (
									<li key={uid}>
										<Link
											to="/friends/$uid"
											params={{ uid }}
											className="s-link"
										>
											{d.profile.username}
										</Link>{' '}
										<span className="opacity-70">was doing something</span>
									</li>
								)
						})}
					</ul>
					<Link
						to="/friends/search"
						from={Route.fullPath}
						className={buttonVariants({ variant: 'secondary' })}
					>
						Invite friends
					</Link>
				</CardContent>
			</Card>
}
