import Navbar from '@/components/navbar'
import { NavbarData } from '@/types/main'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/profile')({
	component: ProfilePage,
	loader: () => ({
		navbar: {
			title: `Profile Menu`,
			icon: '',
			contextMenu: [
				{
					name: 'Friends list',
					to: '/profile/friend-list',
					icon: 'friend',
				},
				{
					name: 'Browse profiles',
					to: '/profile/friend-request',
					icon: 'handshake',
				},
				{
					name: 'Invite to Sunlo',
					to: '/profile/friend-invite',
					icon: 'invite',
				},
				{
					name: 'Edit profile',
					to: '/profile',
					icon: 'notebook-pen',
				},
				{
					name: 'Update email',
					to: '/profile/change-email',
					icon: 'email',
				},
				{
					name: `Update password`,
					to: '/profile/change-password',
					icon: 'password',
				},
				{
					name: 'Start a new Language',
					to: '/learn/add-deck',
					icon: 'folder-plus',
				},
			],
		} as NavbarData,
	}),
})

function ProfilePage() {
	return (
		<div className="w-app @container">
			<Navbar />
			<div className="px-1 space-y-6 pb-10">
				<Outlet />
			</div>
		</div>
	)
}
