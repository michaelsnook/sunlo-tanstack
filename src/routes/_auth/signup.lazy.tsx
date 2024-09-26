import { createLazyFileRoute } from '@tanstack/react-router'

import { Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { cn } from 'lib/utils'
import { ErrorShow } from 'components/errors'
import supabase from 'lib/supabase-client'
import { Session } from 'inspector/promises'
import toast from 'react-hot-toast'

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
							<label htmlFor="email">Email</label>
						</p>
						<input
							id="email"
							name="email"
							required={true}
							className={cn('s-input')}
							tabIndex={1}
							type="email"
							placeholder="email@domain"
						/>
					</div>
					<div>
						<p>
							<label htmlFor="password">Password</label>
						</p>
						<input
							id="password"
							name="password"
							required={true}
							className={cn('s-input')}
							tabIndex={2}
							type="password"
							placeholder="* * * * * * * *"
						/>
					</div>
					<div className="flex flex-row justify-between">
						<button
							tabIndex={3}
							className="btn btn-primary"
							type="submit"
							disabled={useSignUp.isPending}
							aria-disabled={useSignUp.isPending}
						>
							Sign Up
						</button>
						<Link tabIndex={4} to="/login" className="btn btn-ghost">
							Already have an account?
						</Link>
					</div>
					<ErrorShow show={!!useSignUp.error}>
						Problem signing up: {useSignUp.error?.message}
					</ErrorShow>
				</fieldset>
			</form>
		</>
	)
}
