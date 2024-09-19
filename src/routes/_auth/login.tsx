import { type FormEvent, useEffect } from 'react'
import {
	createFileRoute,
	useNavigate,
	useSearch,
	Link,
} from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import supabase from 'lib/supabase-client'
import { cn } from 'lib/utils'
import { useAuth } from 'lib/hooks'
import { ErrorShow } from 'components/errors'

interface LoginSearchParams {
	redirectedFrom?: string
}

export const Route = createFileRoute('/_auth/login')({
	validateSearch: (search: Record<string, unknown>): LoginSearchParams => {
		return {
			redirectedFrom: search.redirectedFrom as string | undefined,
		}
	},
	component: LoginForm,
})

export default function LoginForm() {
	const { isAuth } = useAuth()
	const navigate = useNavigate()
	const { redirectedFrom } = useSearch({ strict: false })
	const fromPath = Route.fullPath

	useEffect(() => {
		if (isAuth && navigate) {
			void navigate({
				to: redirectedFrom || '/learn',
				from: fromPath,
			})
		}
	}, [isAuth, navigate, redirectedFrom, fromPath])

	const useLogin = useMutation({
		mutationFn: async (formData: FormData) => {
			const email = formData.get('email') as string
			const password = formData.get('password') as string
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			})
			if (error) throw error
			return data.user.email
		},
		onSuccess: (email: string) => {
			toast.success(`Logged in as ${email}`, { position: 'bottom-center' })
		},
	})
	// console.log(`what is auth rn`, auth.isAuth, auth)

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		useLogin.mutate(formData)
	}

	if (isAuth) return <p>You are logged in; pls wait while we redirect you.</p>

	return (
		<>
			<h1 className="h3 text-base-content/90">Please log in</h1>
			<form role="form" onSubmit={handleSubmit} className="form">
				<fieldset
					className="flex flex-col gap-y-4"
					disabled={useLogin.isPending}
				>
					<div>
						<label htmlFor="email">Email</label>
						<input
							id="email"
							name="email"
							required={true}
							pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
							// pattern = "[a-zA-Z0-9.+_-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+"
							// aria-invalid={login.error?.email ? true : false}
							className={cn(
								// login.error?.email ? 'border-error/60' : '',
								's-input'
							)}
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
							// aria-invalid={login.error?.password ? 'true' : 'false'}
							className={cn(
								's-input'
								// login.error?.password ? 'border-error/60' : ''
							)}
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
							disabled={useLogin.isPending}
							aria-disabled={useLogin.isPending}
						>
							Log in
						</button>
						<Link
							tabIndex={4}
							to="/signup"
							from={Route.fullPath}
							className="btn btn-ghost"
						>
							Create account
						</Link>
					</div>
					<ErrorShow show={!!useLogin.error}>
						Problem logging in: {useLogin.error?.message}
					</ErrorShow>
					<p>
						<Link
							to="/forgot-password"
							from={Route.fullPath}
							className="s-link text-sm"
						>
							Forgot password?
						</Link>
					</p>
				</fieldset>
			</form>
		</>
	)
}
