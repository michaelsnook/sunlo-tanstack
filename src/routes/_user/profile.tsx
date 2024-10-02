import { createFileRoute, Link } from '@tanstack/react-router'
import {
	AvatarSection,
	UpdateProfileForm,
	UserAuthCard,
} from 'components/profile'
import { ArrowRightIcon } from 'lucide-react'

export const Route = createFileRoute('/_user/profile')({
	component: ProfilePage,
})

function ProfilePage() {
	return (
		<div className="w-app space-y-4 py-6">
			<AvatarSection />
			<div className="w-full text-center">
				<Link to="/getting-started" className="s-link text-xl" tabIndex={-1}>
					Get Started <ArrowRightIcon className="inline-block w-4 h-4 ml-1" />
				</Link>
			</div>
			<div className="card-white">
				<div className="h3">
					<h3>Edit Profile</h3>
					<p>Update your profile information.</p>
				</div>

				<UpdateProfileForm />
			</div>
			<div className="card-white">
				<div className="h3">
					<h3>Login Credentials</h3>
					<p>Update your email or password (or signin method)</p>
				</div>
				<UserAuthCard />
			</div>
		</div>
	)
}
