import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'

// these pages relate to the auth flow, such as sign in, sign up, etc
// they do not require the user to be logged in
export const Route = createFileRoute('/_auth')({
	component: () => (
		<div className="px-4">
			<Card className="mx-auto mt-[10cqh] w-full max-w-md [padding:clamp(0.5rem,2cqw,2rem)]">
				<Outlet />
			</Card>
		</div>
	),
})
