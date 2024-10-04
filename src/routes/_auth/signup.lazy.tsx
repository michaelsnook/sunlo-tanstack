import { z } from 'zod'

import { Link, createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { ShowError } from 'components/errors'
import supabase from 'lib/supabase-client'
import toast from 'react-hot-toast'
import { Button, buttonVariants } from 'components/ui/button'
import { Input, Label } from 'components/ui'
import { zodValidator } from '@tanstack/zod-form-adapter'

export const Route = createLazyFileRoute('/_auth/signup')({
	component: SignUp,
})

const SignUpSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
})

const useSignUp = () =>
	useMutation({
		mutationFn: async (values: FormData) => {
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
	const useSignupMutation = useSignUp()

	const form = useForm<z.infer<typeof SignUpSchema>>({
		defaultValues: {
			email: '',
			password: '',
		},
		validatorAdapter: zodValidator(),
		validators: {
			onSubmit: SignUpSchema,
			onChange: SignUpSchema,
		},
		onSubmit: (values) => {
			useSignupMutation.mutate(values, {
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
			<h1 className="h3 text-base-content/90">Sign Up</h1>
			<form
				role="form"
				className="form"
				onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					form.handleSubmit()
				}}
			>
				<fieldset
					className="flex flex-col gap-y-4"
					disabled={useSignUp.isPending}
				>
					<form.Field
						name="email"
						children={(field) => (
							<div>
								<p>
									<Label htmlFor={field.name}>Email</Label>
								</p>
								<Input
									id={field.name}
									name={field.name}
									required={true}
									tabIndex={1}
									type="email"
									placeholder="email@domain"
								/>
							</div>
						)}
					/>
					<form.Field
						name="password"
						children={(field) => (
							<div>
								<p>
									<Label htmlFor={field.name}>Password</Label>
								</p>
								<Input
									id={field.name}
									name={field.name}
									required={true}
									tabIndex={2}
									type="password"
									placeholder="* * * * * * * *"
								/>
							</div>
						)}
					/>
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
						<Link
							tabIndex={4}
							to="/login"
							className={buttonVariants({ variant: 'soft' })}
						>
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
