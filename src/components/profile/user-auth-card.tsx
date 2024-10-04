import { Label } from '@radix-ui/react-dropdown-menu'
import { Link } from '@tanstack/react-router'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { useAuth } from 'lib/hooks'

export default function UserAuthCard() {
	const { userEmail } = useAuth()

	return (
		<>
			<Label>Your email</Label>
			<div className="flex flex-row gap-2">
				<Input
					type="text"
					className="flex-grow rounded border bg-base-300 p-3 text-base-content/70"
					value={userEmail ?? 'loading...'}
					disabled
				/>
				<Button variant="soft" className="my-auto" asChild>
					<Link to="/profile/change-email">Change</Link>
				</Button>
			</div>
			<Label>Your password</Label>
			<div className="flex flex-row gap-2">
				<Input
					type="text"
					className="flex-grow rounded border bg-base-300 p-3 text-base-content/70"
					value="***************"
					disabled
				/>
				<Button variant="soft" className="my-auto" asChild>
					<Link to="/profile/change-password">Change</Link>
				</Button>
			</div>
		</>
	)
}
