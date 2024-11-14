import { useProfile } from '@/lib/use-profile'
import { User } from 'lucide-react'

export default function Avatar({ size = 144 }) {
	const { data: profile } = useProfile()
	return profile?.avatar_url ?
			<img
				src={profile.avatar_url}
				width={size}
				height={size}
				alt={`${profile?.username ?? 'Someone'}'s profile image`}
				className="rounded-full"
			/>
		:	<User size={size} />
}
