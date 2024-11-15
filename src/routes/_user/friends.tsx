import Navbar from '@/components/navbar'
import { NavbarData } from '@/types/main'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/friends')({
	component: FriendsPage,
	loader: () => ({
		navbar: {
			title: `Manage Friends and Contacts`,
			icon: '',
			contextMenu: [
				{
					name: 'Friends list',
					to: '/friends',
					icon: 'friend',
				},
				{
					name: 'Browse profiles',
					to: '/friends/request',
					icon: 'handshake',
				},
				{
					name: 'Invite to Sunlo',
					to: '/friends/invite',
					icon: 'invite',
				},
				{
					name: 'Edit profile',
					to: '/profile',
					icon: 'notebook-pen',
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

function FriendsPage() {
	return (
		<div className="w-app @container">
			<Navbar />
			<div className="px-1 space-y-6 pb-10">
				<Outlet />
			</div>
		</div>
	)
}
