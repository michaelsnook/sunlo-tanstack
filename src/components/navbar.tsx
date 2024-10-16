import type { NavbarData } from 'types/main'
import { useCallback, useState } from 'react'
import {
	type LucideProps,
	BookHeart,
	ChevronLeft,
	FolderPlus,
	Home,
	MoreVertical,
	Rocket,
	Search,
	Settings,
	SquarePlus,
	WalletCards,
} from 'lucide-react'
import { Button } from 'components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from 'components/ui/dropdown-menu'
import { Link, useNavigate } from '@tanstack/react-router'

interface NavbarProps {
	data?: NavbarData
}

export default function Navbar({ data }: NavbarProps) {
	const navigate = useNavigate()
	const goBack = useCallback(() => {
		void navigate({ to: '..' })
	}, [navigate])
	const onBackClick = data?.onBackClick ?? goBack

	const [isOpen, setIsOpen] = useState(false)
	return (
		<nav className="flex items-center justify-between py-3 px-[1cqw] shadow-xl mb-4 bg-white/10">
			<div className="flex items-center gap-[1cqw]">
				<Button variant="ghost" size="icon" onClick={onBackClick}>
					<ChevronLeft />
					<span className="sr-only">Back</span>
				</Button>
				<div className="flex flex-row items-center gap-[1cqw]">
					{data?.icon ?
						<span className="rounded bg-white/20 p-2">
							{renderIcon(data?.icon, { size: 24 })}
						</span>
					:	<>&nbsp;</>}
					<div>
						<h1 className="text-lg font-bold">{data?.title}</h1>
						<p className="text-sm">{data?.subtitle}</p>
					</div>
				</div>
			</div>

			{!(data?.contextMenu?.length > 0) ? null : (
				<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreVertical />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						{data?.contextMenu.map(({ href, name, icon }, index) => (
							<DropdownMenuItem key={index}>
								<Link
									to={href}
									className="w-full flex flex-row gap-2 justify-content-center"
								>
									{renderIcon(icon)}
									{name}
								</Link>
							</DropdownMenuItem>
						)) || (
							<DropdownMenuItem disabled>No options available</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</nav>
	)
}

// TODO move this to utils?
function renderIcon(icon: string, props: LucideProps = { size: 20 }) {
	props.strokeWidth ??=
		typeof props.size === 'string' ? 1.5 : (props.size / 20) * 1.5
	switch (icon) {
		case 'book-heart': // for your /learn page
			return <BookHeart {...props} />
		case 'home': // for your /learn page
			return <Home {...props} />
		case 'folder-plus': // for a new deck
			return <FolderPlus {...props} />
		case 'search':
			return <Search {...props} />
		case 'settings':
			return <Settings {...props} />
		case 'square-plus': // for a new card
			return <SquarePlus {...props} />
		case 'rocket': // for GOAL actions (start a review)
			return <Rocket {...props} />
		case 'wallet-cards': // browse your own cards
			return <WalletCards {...props} />
		default:
			return null
	}
}
