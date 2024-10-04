import { createLazyFileRoute } from '@tanstack/react-router'

import { Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { cn } from 'lib/utils'
import { ShowError } from 'components/errors'
import supabase from 'lib/supabase-client'
import toast from 'react-hot-toast'
import { Button } from 'components/ui/button'
import { Input, Label } from 'components/ui'

export const Route = createLazyFileRoute('/_auth/signup')({
	component: SignUp,
})

function SignUp() {
	const useSignUp = useMutation({
		mutationFn: async (formData: FormData) => {
			const email = formData.get('email') as string
			const password = formData.get('password') as string
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${import.meta.env.VITE_BASE_URL}/getting-started`,
				},
			})
			if (error) throw error
			return data
		},
		onSuccess: (data) => {
			toast.success(`Signed up as ${data.user?.email}`, {
				position: 'bottom-center',
			})
			// Redirect to the getting-started page after successful signup
			const navigate = Route.useNavigate()
			navigate({ to: '/getting-started' })
		},
	})

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		useSignUp.mutate(formData)
	}

	return (
		<>
			<h1 className="h3 text-base-content/90">Sign Up</h1>
			<form role="form" className="form" onSubmit={handleSubmit}>
				<fieldset
					className="flex flex-col gap-y-4"
					disabled={useSignUp.isPending}
				>
					<div>
						<p>
							<Label htmlFor="email">Email</Label>
						</p>
						<Input
							id="email"
							name="email"
							required={true}
							tabIndex={1}
							type="email"
							placeholder="email@domain"
						/>
					</div>
					<div>
						<p>
							<Label htmlFor="password">Password</Label>
						</p>
						<Input
							id="password"
							name="password"
							required={true}
							tabIndex={2}
							type="password"
							placeholder="* * * * * * * *"
						/>
					</div>
					<div className="flex flex-row justify-between">
						<Button
							tabIndex={3}
							variant="default"
							type="submit"
							disabled={useSignUp.isPending}
							aria-disabled={useSignUp.isPending}
						>
							Sign Up
						</Button>
						<Link tabIndex={4} to="/login" className="btn btn-ghost">
							Already have an account?
						</Link>
					</div>
					<ShowError show={!!useSignUp.error}>
						Problem signing up: {useSignUp.error?.message}
					</ShowError>
				</fieldset>
			</form>
		</>
	)
}
