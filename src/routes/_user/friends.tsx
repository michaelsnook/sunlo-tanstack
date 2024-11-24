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
					name: 'Friends and contacts',
					to: '/friends',
					icon: 'friend',
				},
				{
					name: 'Search profiles',
					to: '/friends/search',
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
					name: 'Start a new language',
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
			<div className="px-1 space-y-4 pb-10">
				<Outlet />
			</div>
		</div>
	)
}
