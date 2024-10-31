import { useProfile } from '@/lib/use-profile'
import Avatar from '@/components/avatar'

export default function AvatarSection() {
	const { data: profile } = useProfile()

	return (
		<header className="mx-auto my-4 max-w-sm text-center">
			<div className="relative">
				{profile?.avatar_url && (
					<label
						className="mb-2 h-36 w-36 bg-base-300 shadow-lg flex flex-row justify-center mx-auto rounded-full"
						htmlFor="single"
					>
						<Avatar size={144} />
					</label>
				)}
			</div>
			<div>
				<h2 className="text-4xl">Hello {profile?.username} 👋</h2>
			</div>
		</header>
	)
}
