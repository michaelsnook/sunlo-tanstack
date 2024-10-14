import { useLayoutEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import toast from 'react-hot-toast'

import { Input } from 'components/ui/input'
import { Button, buttonVariants } from 'components/ui/button'
import supabase from 'lib/supabase-client'
import { useAuth } from 'lib/hooks'
import { ShowError } from 'components/errors'
import { LabelInputInfo } from 'components/LabelInputInfo'
import { CardContent, CardHeader, CardTitle } from 'components/ui/card'

export const Route = createFileRoute('/_auth/login')({
	validateSearch: (search: Record<string, unknown>): LoginSearchParams => {
		return {
			redirectedFrom: search.redirectedFrom as string | undefined,
		}
	},
	component: LoginForm,
})

interface LoginSearchParams {
	redirectedFrom?: string
}

const LoginSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters' }),
})

export default function LoginForm() {
	const { isAuth } = useAuth()
	const navigate = Route.useNavigate()
	const { redirectedFrom } = Route.useSearch()
	const fromPath = Route.fullPath

	useLayoutEffect(() => {
		if (isAuth && navigate) {
			void navigate({
				to: redirectedFrom || '/learn',
				from: fromPath,
			})
		}
	}, [isAuth, navigate, redirectedFrom, fromPath])

	const loginMutation = useMutation({
		mutationKey: ['login'],
		mutationFn: async (values: z.infer<typeof LoginSchema>) => {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: values.email,
				password: values.password,
			})
			if (error) throw error
			return data.user?.email
		},
		onSuccess: (email: string | undefined) => {
			if (email) {
				toast.success(`Logged in as ${email}`, { position: 'bottom-center' })
			}
			// we don't need to redirect here, because the useEffect will do that
		},
	})

	const form = useForm<z.infer<typeof LoginSchema>>({
		defaultValues: {
			email: '',
			password: '',
		},
		onSubmit: ({ value }) => loginMutation.mutate(value),
		validatorAdapter: zodValidator(),
		validators: {
			onSubmit: LoginSchema,
			// onChange: LoginSchema,
		},
	})

	if (isAuth)
		return <p>You are logged in; please wait while we redirect you.</p>
	console.log('form state', form.state, loginMutation)
	const submitButtonShouldBeDisabled =
		loginMutation.isPending || form.state.isSubmitting

	return (
		<>
			<CardHeader>
				<CardTitle>Please log in</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					role="form"
					className="space-y-4"
					onSubmit={(event) => {
						event.preventDefault()
						event.stopPropagation()
						form.handleSubmit()
					}}
					noValidate
				>
					<fieldset
						className="flex flex-col gap-y-4"
						disabled={loginMutation.isPending}
					>
						<form.Field
							name="email"
							children={(field) => {
								const showAsError =
									field.state.meta.errors.length > 0 && field.state.meta.isDirty
								return (
									<LabelInputInfo field={field} label="Email">
										<Input
											id={field.name}
											name={field.name}
											inputMode="email"
											aria-invalid={showAsError}
											className={showAsError ? 'bg-destructive/20' : ''}
											tabIndex={1}
											type="email"
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="email@domain"
										/>
									</LabelInputInfo>
								)
							}}
						/>
						<form.Field
							name="password"
							children={(field) => {
								const showAsError =
									field.state.meta.errors.length > 0 && field.state.meta.isDirty
								return (
									<LabelInputInfo field={field} label="Password">
										<Input
											id={field.name}
											name={field.name}
											inputMode="text"
											required={true}
											aria-invalid={field.state.meta.errors.length > 0}
											className={showAsError ? 'bg-destructive/20' : ''}
											tabIndex={2}
											type="password"
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="* * * * * * * *"
										/>
									</LabelInputInfo>
								)
							}}
						/>
					</fieldset>

					<div className="flex flex-row justify-between">
						<Button
							tabIndex={3}
							variant="default"
							type="submit"
							disabled={submitButtonShouldBeDisabled}
							aria-disabled={submitButtonShouldBeDisabled}
						>
							Log in
						</Button>

						<Link
							to="/signup"
							from={Route.fullPath}
							className={buttonVariants({ variant: 'link' })}
						>
							Create account
						</Link>
					</div>
					<ShowError show={!!loginMutation.error}>
						Problem logging in: {loginMutation.error?.message}
					</ShowError>
					<p>
						<Link
							to="/forgot-password"
							from={Route.fullPath}
							className="s-link text-sm"
						>
							Forgot password?
						</Link>
					</p>
				</form>
			</CardContent>
		</>
	)
}
