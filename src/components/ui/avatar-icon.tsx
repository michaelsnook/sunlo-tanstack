import { PublicProfile } from '@/types/main'
import { Link, ReactNode } from '@tanstack/react-router'
import { User } from 'lucide-react'

type AvatarIconRowProps = PublicProfile & {
	children?: ReactNode
}

export function AvatarIconRow({
	avatar_url,
	username,
	uid,
	children,
}: AvatarIconRowProps) {
	return (
		<div className="flex flex-row justify-between items-center gap-4 w-full">
			<Link to="/friends/$uid" params={{ uid }}>
				{avatar_url ?
					<img
						src={avatar_url}
						aria-disabled="true"
						alt={`${username}'s avatar`}
						className="w-8 h-8 rounded-full object-cover"
					/>
				:	<User className="bg-foreground/20 rounded-full w-8 h-8 p-1" />}
			</Link>
			<p className="me-auto">
				<Link to="/friends/$uid" params={{ uid }}>
					{username}
				</Link>
			</p>
			{children}
		</div>
	)
}
