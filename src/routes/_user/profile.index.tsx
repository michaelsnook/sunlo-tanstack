import { buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useProfile } from '@/lib/use-profile'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
	AvatarSection,
	UpdateProfileForm,
	UserAuthCard,
} from '@/components/profile'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useRelations } from '@/lib/friends'

export const Route = createFileRoute('/_user/profile/')({
	component: ProfilePage,
})

function ProfilePage() {
	return (
		<>
			<AvatarSection />
			<div className="w-full text-center">
				<Link to="/getting-started" className="s-link text-xl" tabIndex={-1}>
					Get Started <ArrowRight className="inline-block w-4 h-4 ml-1" />
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
