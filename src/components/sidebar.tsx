import { useState } from 'react'
import { Link } from '@tanstack/react-router'

import type { MenuType } from '@/types/main'
import languages from '@/lib/languages'
import { Garlic } from '@/components/garlic'
import { useProfile } from '@/lib/use-profile'
import { useAuth, useSignOut } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import Avatar from './avatar'
import Callout from './ui/callout'

const staticMenu: MenuType = {
	name: 'Menu',
	to: '/',
	links: [
		{
			name: 'Home',
			to: '/',
		},
		{
			name: 'Log in or sign up',
			to: '/login',
		},
		{
			name: 'Browse Languages',
			to: '/languages',
		},
	],
}

const GenericMenu = ({ menu }: { menu: MenuType }) => {
	return (
		<div>
			<p className="my-4 font-bold">
				{menu.to === null ?
					menu.name
				:	<Link
						className="nav-link"
						to={menu.to as string}
						activeOptions={{
							exact: true,
						}}
					>
						{menu.name}
					</Link>
				}
			</p>
			<ul className="flex flex-col gap-2">
				{menu.links?.map((i) => (
					<li key={`${i.to}-${i.params ? JSON.stringify(i.params) : ''}`}>
						<Link className="nav-link" to={i.to as string}>
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
					isOpen ? 'fixed md:sticky flex' : 'hidden',
					'top-0 z-30 h-screen w-72 flex-col gap-4 overflow-y-auto overflow-x-hidden p-6 bg-muted text-foreground'
				)}
			>
				<div className="flex flex-row justify-between items-center py-4">
					<Link
						to="/"
						className="font-bold flex flex-row items-center nav-link"
					>
						<Garlic size={50} />
						Sunlo
					</Link>
					<ModeToggle />
				</div>
				<DeckMenu />
				<GenericMenu menu={staticMenu} />
				<p className="mt-auto mb-[1.1rem] ml-auto">
					<SignOutButton shy />
				</p>
			</nav>
		</div>
	)
}

function DeckMenu() {
	const { data } = useProfile()
	if (!data) return null

	const menuData = {
		name: 'Learning decks',
		to: '/learn',
		links: data.deckLanguages?.map((lang) => {
			return {
				name: languages[lang],
				to: `/learn/$lang`,
				params: { lang },
			}
		}),
	}

	return (
		<>
			<Link to="/profile" className="nav-link">
				<p className="flex flex-row gap-2">
					<Avatar size={24} />
					Your profile
				</p>
			</Link>
			{data.deckLanguages.length === 0 ?
				<Callout>
					<div>
						<p>
							It seems like you're not learning any languages yet! Get started.
						</p>
						<Button className="w-full mt-2" asChild>
							<Link to="/learn/add-deck">Start Learning</Link>
						</Button>
					</div>
				</Callout>
			:	<GenericMenu menu={menuData} />}
		</>
	)
}

function SignOutButton({ shy = false }) {
	const signOut = useSignOut()
	const { isAuth } = useAuth()

	return shy === false || isAuth === true ?
			<Button
				variant="outline"
				type="button"
				onClick={(event) => {
					event.preventDefault()
					signOut.mutate()
				}}
				disabled={signOut.isPending || !isAuth}
			>
				Sign out
				<LogOut className="ms-2 h-4 w-4" />
			</Button>
		:	null
}

const SidebarOpener = ({ isOpen = false, toggle = () => {} }) => (
	<Button
		className={`fixed bottom-4 left-3 z-50 rounded-full h-10 w-10`}
		variant="white"
		size="icon"
		aria-haspopup={true}
		aria-label="Toggle main menu"
		aria-expanded={isOpen ? true : false}
		aria-controls="main-menu"
		onClick={toggle}
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
	</Button>
)
