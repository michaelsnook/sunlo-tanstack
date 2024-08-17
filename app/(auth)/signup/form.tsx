'use client'

import { type FormEvent } from 'react'
// nextjs: import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import supabase from 'lib/supabase-client'
import { BASE_URL, cn } from 'lib/utils'
import ShowError from 'components/show-error'

export default function SignupForm() {
  const router = useRouter()

  const submitSignup = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const email = event.target['email'].value
      const password = event.target['password'].value

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${BASE_URL}/getting-started` },
      })

      if (error) throw error
      if (data?.user && data?.session) router.push('/getting-started')
    },
  })

  return (
    <div>
      {submitSignup.isSuccess ?
        <SuccessfulSubmit />
      : <>
          <h1 className="h3 text-base-content/90">Create your account</h1>
          <form role="form" onSubmit={submitSignup.mutate} className="form">
            <fieldset
              className="flex flex-col gap-y-4"
              disabled={submitSignup.isPending}
            >
              <div>
                <p>
                  <label htmlFor="email">Email</label>
                </p>
                <input
                  id="email"
                  name="email"
                  required={true}
                  pattern="[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*"
                  aria-invalid={submitSignup.error ? true : false}
                  className={cn(
                    's-input',
                    submitSignup.error ? 'ring-error/60' : ''
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
                  aria-invalid={submitSignup.error ? true : false}
                  className={cn(
                    's-input',
                    submitSignup.error ? 'ring-error/60' : ''
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
                  disabled={submitSignup.isPending}
                  aria-disabled={submitSignup.isPending}
                >
                  Sign up
                </button>
                <Link tabIndex={4} href="/login" className="btn btn-ghost">
                  Log in
                </Link>
              </div>
              <ShowError show={!!submitSignup.error}>
                Problem signing up: {submitSignup.error?.message}
              </ShowError>
              <p>
                <Link href="/forgot-password" className="s-link text-sm">
                  Forgot password?
                </Link>
              </p>
            </fieldset>
          </form>
        </>
      }
    </div>
  )
}

const SuccessfulSubmit = () => (
  <div className="flex flex-col space-y-4 p-4 @md:p-6 @xl:p-10">
    <h1 className="h3 text-base-content/90">Please confirm email</h1>
    <p>
      We&apos;ve sent a confirmation email to the address you entered. Please
      click the confirmation link in your email.
    </p>
    <p>You can close this tab.</p>
  </div>
)
