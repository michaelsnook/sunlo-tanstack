import { useState } from 'react'
import { Link } from '@tanstack/react-router'

import type { MenuType } from 'types/main'
import languages from 'lib/languages'
import { Garlic } from 'components/garlic'
import { useProfile } from 'lib/use-profile'
import { useAuth, useSignOut } from 'lib/hooks'
import { cn } from 'lib/utils'
import Loading from './loading'

const staticMenu: MenuType = {
	name: 'Menu',
	href: null,
	links: [
		{
			name: 'Home',
			href: '/',
		},
		{
			name: 'Log in or sign up',
			href: '/login',
		},
		{
			name: 'Browse Languages',
			href: '/language',
		},
	],
}

const GenericMenu = ({ menu }: { menu: MenuType }) => {
	return (
		<div>
			<p className="my-4 font-bold">
				{menu.href ?
					<Link
						className="nav-link"
						to={menu.href}
						activeOptions={{
							exact: true,
						}}
					>
						{menu.name}
					</Link>
				:	menu.name}
			</p>
			<ul className="flex flex-col gap-2">
				{menu.links?.map((i) => (
					<li key={i.href}>
						<Link className="nav-link" to={i.href}>
							{i.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

export default function Sidebar() {
	const [isOpen, setIsOpen] = useState(false)
	const toggle = () => setIsOpen(!isOpen)

	return (
		<div id="sidebar-all">
			<SidebarOpener isOpen={isOpen} toggle={toggle} />
			<div
				className={cn(
					'z-20 bg-black bg-opacity-50 pt-10',
					isOpen ? 'fixed' : 'hidden',
					'bottom-0 left-0 right-0 top-0 md:hidden'
				)}
				onClick={toggle}
			/>
			<nav
				aria-label="Main navigation"
				className={cn(
					isOpen ? 'fixed' : 'hidden',
					!isOpen ? '' : 'md:sticky md:flex',
					'top-0 z-30 h-screen w-72 flex-col gap-4 overflow-y-auto overflow-x-hidden bg-base-300 p-6 text-base-content'
				)}
			>
				<Link to="/" className="h4 flex flex-row items-center">
					<Garlic size={50} />
					Sunlo
				</Link>
				<DeckMenu />
				<GenericMenu menu={staticMenu} />
				<p>
					<SignOutButton shy />
				</p>
			</nav>
		</div>
	)
}

function DeckMenu() {
	const { data: profile, isLoading } = useProfile()
	const menuData =
		!profile ? null : (
			{
				name: 'Learning decks',
				href: '/learn',
				links: profile?.deckLanguages?.map((lang) => {
					return {
						name: languages[lang],
						href: `/learn/${lang}`,
					}
				}),
			}
		)
	return (
		isLoading ? <Loading />
		: menuData ?
			<>
				<Link to="/profile">
					<p className="flex flex-row gap-2">
						<ProfileIcon /> {profile?.username}
					</p>
				</Link>
				<GenericMenu menu={menuData} />
			</>
		:	null
	)
}

function SignOutButton({ shy = false }) {
	const signOut = useSignOut()
	const { isAuth } = useAuth()

	return shy === false || isAuth === true ?
			<button
				className="btn btn-ghost"
				type="button"
				onClick={(event) => {
					event.preventDefault()
					signOut.mutate()
				}}
				disabled={signOut.isPending || !isAuth}
			>
				Sign out
			</button>
		:	null
}

const SidebarOpener = ({ isOpen = false, toggle = () => {} }) => (
	<button
		className={`btn-outline btn-primary fixed bottom-4 left-3 z-50 rounded-full border border-primary bg-white p-2`}
		role="button"
		aria-haspopup={true}
		aria-label="Toggle main menu"
		aria-expanded={isOpen ? true : false}
		aria-controls="main-menu"
		onClick={toggle}
		tabIndex={0}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M4 8h16M4 16h16"
			/>
		</svg>
	</button>
)

const ProfileIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="h-6 w-6"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	)
}
