import { Link } from '@tanstack/react-router'
import { useAuth } from 'lib/hooks'

export default function UserAuthCard() {
	const { userEmail } = useAuth()

	return (
		<>
			<div className="flex w-full flex-col">
				<label className="px-3 font-bold">Your email</label>
				<div className="flex flex-row gap-4">
					<input
						type="text"
						className="flex-grow rounded border bg-base-300 p-3 text-base-content/70"
						value={userEmail ?? 'loading...'}
						disabled
					/>
					<Link
						to="/profile/change-email"
						className="btn btn-link hover:bg-base-200"
					>
						Change
					</Link>
				</div>
			</div>
			<div className="flex flex-col">
				<label className="px-3 font-bold">Your password</label>
				<div className="flex flex-row gap-4">
					<input
						type="text"
						className="flex-grow rounded border bg-base-300 p-3 text-base-content/70"
						value="***************"
						disabled
					/>
					<Link
						to="/profile/change-password"
						className="btn btn-link hover:bg-base-200"
					>
						Change
					</Link>
				</div>
			</div>
		</>
	)
}
