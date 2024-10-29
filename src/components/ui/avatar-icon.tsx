import { PublicProfile } from '@/types/main'
import { ReactNode } from '@tanstack/react-router'
import { User } from 'lucide-react'

type AvatarIconRowProps = PublicProfile & {
	children?: ReactNode
}

export function AvatarIconRow({
	avatar_url,
	username,
	children,
}: AvatarIconRowProps) {
	return (
		<div className="flex flex-row justify-between items-center gap-4 w-full">
			{avatar_url ?
				<img
					src={avatar_url}
					aria-disabled="true"
					alt={`${username}'s avatar`}
				/>
			:	<User className="bg-foreground/20 rounded-full w-8 h-8 p-1" />}
			<p className="me-auto">{username}</p>
			{children}
		</div>
	)
}
