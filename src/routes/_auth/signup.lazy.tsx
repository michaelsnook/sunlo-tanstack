import { Link, createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { zodValidator } from '@tanstack/zod-form-adapter'
import toast from 'react-hot-toast'

import { Button, buttonVariants } from 'components/ui/button'
import { Input } from 'components/ui/input'

import supabase from 'lib/supabase-client'
import { ShowError } from 'components/errors'
import { LabelInputInfo } from 'components/LabelInputInfo'
import { CardContent, CardHeader, CardTitle } from 'components/ui/card'

export const Route = createLazyFileRoute('/_auth/signup')({
	component: SignUp,
})

const SignUpSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
})

const useSignUp = () =>
	useMutation({
		mutationKey: ['signup'],
		mutationFn: async (values: z.infer<typeof SignUpSchema>) => {
			const { email, password } = SignUpSchema.parse(values)
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${import.meta.env.VITE_BASE_URL}/getting-started`,
				},
			})
			if (error) {
				console.log(`Error`, error)
				throw error
			}
			return data
		},
		onSuccess: (data) => {
			toast.success(`as ${data.user?.email}`, {
				position: 'bottom-center',
			})
		},
	})

function SignUp() {
	const router = useRouter()
	const signupMutation = useSignUp()

	const form = useForm<z.infer<typeof SignUpSchema>>({
		defaultValues: {
			email: '',
			password: '',
		},
		validatorAdapter: zodValidator(),
		validators: {
			onSubmit: SignUpSchema,
			// onChange: SignUpSchema,
		},
		onSubmit: ({ value }) => {
			signupMutation.mutate(value, {
				onSuccess: (data) => {
					toast.success(`Signed up as ${data.user?.email}`, {
						position: 'bottom-center',
					})
					router.navigate({ to: '/getting-started', from: '/signup' })
				},
			})
		},
	})

	return (
		<>
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					role="form"
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault()
						e.stopPropagation()
						form.handleSubmit()
					}}
					noValidate
				>
					<fieldset
						className="flex flex-col gap-y-4"
						disabled={signupMutation.isPending}
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
											required={true}
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
											aria-invalid={showAsError}
											className={showAsError ? 'bg-destructive/20' : ''}
											required={true}
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
							disabled={signupMutation.isPending}
							aria-disabled={signupMutation.isPending}
						>
							Sign Up
						</Button>
						<Link
							tabIndex={4}
							to="/login"
							className={buttonVariants({ variant: 'secondary' })}
						>
							Already have an account?
						</Link>
					</div>
					<ShowError show={!!signupMutation.error}>
						Problem signing up: {signupMutation.error?.message}
					</ShowError>
				</form>
			</CardContent>
		</>
	)
}
