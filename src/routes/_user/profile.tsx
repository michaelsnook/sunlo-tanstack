import { createFileRoute } from '@tanstack/react-router'
import {
	AvatarSection,
	UpdateProfileForm,
	UserAuthCard,
} from 'components/profile'

export const Route = createFileRoute('/_user/profile')({
	component: ProfilePage,
})

function ProfilePage() {
	return (
		<div className="w-app space-y-4 py-6">
			<AvatarSection />
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
