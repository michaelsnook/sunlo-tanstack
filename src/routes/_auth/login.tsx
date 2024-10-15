import { useLayoutEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { Button, buttonVariants } from 'components/ui/button'
import { CardContent, CardHeader, CardTitle } from 'components/ui/card'
import supabase from 'lib/supabase-client'
import { useAuth } from 'lib/hooks'
import { ShowError } from 'components/errors'
import { EmailField, PasswordField } from 'components/inputs'

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

const FormSchema = z.object({
	email: z
		.string()
		.min(1, `Email is required`)
		.email(`Email is required to be a real email`),
	password: z.string().min(1, 'Password is required'),
})

type FormInputs = z.infer<typeof FormSchema>

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
		mutationFn: async ({ email, password }: FormInputs) => {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
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

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormInputs>({
		resolver: zodResolver(FormSchema),
	})

	if (isAuth)
		return <p>You are logged in; please wait while we redirect you.</p>
	// console.log('form state', form.state, loginMutation)

	return (
		<>
			<CardHeader>
				<CardTitle>Please log in</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					role="form"
					noValidate
					className="space-y-4"
					onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
				>
					<fieldset className="flex flex-col gap-y-4" disabled={isSubmitting}>
						<EmailField register={register} error={errors.email} />
						<PasswordField register={register} error={errors.password} />
					</fieldset>
					<div className="flex flex-row justify-between">
						<Button
							tabIndex={3}
							variant="default"
							type="submit"
							disabled={isSubmitting}
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
