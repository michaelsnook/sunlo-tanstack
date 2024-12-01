import { Link } from '@tanstack/react-router'
import { Label } from '@/components/ui/label'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/hooks'

export default function UserAuthCard() {
	const { userEmail } = useAuth()
	return (
		<>
			<Label>Your email</Label>
			<div className="flex flex-row gap-2">
				<Input
					type="text"
					className="grow rounded border bg-base-300 p-3 text-base-content/70"
					value={userEmail ?? 'loading...'}
					disabled
				/>
				<Link
					to="/profile/change-email"
					className={buttonVariants({ variant: 'secondary' })}
				>
					Change
				</Link>
			</div>
			<Label>Your password</Label>
			<div className="flex flex-row gap-2">
				<Input
					type="text"
					className="grow rounded border bg-base-300 p-3 text-base-content/70"
					value="***************"
					disabled
				/>

				<Link
					to="/profile/change-password"
					className={buttonVariants({ variant: 'secondary' })}
				>
					Change
				</Link>
			</div>
		</>
	)
}
