import { Link, createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { Button, buttonVariants } from 'components/ui/button'
import { CardContent, CardHeader, CardTitle } from 'components/ui/card'

import supabase from 'lib/supabase-client'
import { ShowError } from 'components/errors'
import { EmailField, PasswordField } from 'components/inputs'

export const Route = createLazyFileRoute('/_auth/signup')({
	component: SignUp,
})

const FormSchema = z.object({
	email: z
		.string()
		.min(1, `Email is required`)
		.email(`Email is required to be a real email`),
	password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormInputs = z.infer<typeof FormSchema>

const useSignUp = () =>
	useMutation({
		mutationKey: ['signup'],
		mutationFn: async ({ email, password }: FormInputs) => {
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
	})

function SignUp() {
	const router = useRouter()
	const signupMutation = useSignUp()

	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<FormInputs>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<>
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					role="form"
					noValidate
					className="space-y-4"
					onSubmit={handleSubmit((values: FormInputs) => {
						signupMutation.mutate(values, {
							onSuccess: (data) => {
								toast.success(`Signed up as ${data.user?.email}`, {
									position: 'bottom-center',
								})
								router.navigate({ to: '/getting-started', from: '/signup' })
							},
						})
					})}
				>
					<fieldset className="flex flex-col gap-y-4" disabled={isSubmitting}>
						<EmailField register={register} error={errors.email} />
						<PasswordField register={register} error={errors.password} />
					</fieldset>
					<div className="flex flex-row justify-between">
						<Button disabled={signupMutation.isPending}>Sign Up</Button>
						<Link to="/login" className={buttonVariants({ variant: 'link' })}>
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
