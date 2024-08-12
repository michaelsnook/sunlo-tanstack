import { type FormEvent, useCallback, useLayoutEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import supabase from '../lib/supabase-client'
import { cn } from '../lib/utils'
import { useAuth } from '../lib/hooks'
import { ErrorShow } from './errors'

export default function LoginForm({ asModal = false }) {
  const { isAuth } = useAuth()
  const navigate = useNavigate()
  const toastSuccess = useCallback(
    () => toast.success(`You're logged in 👍️ redirecting you...`),
    []
  )
  useLayoutEffect(() => {
    if (isAuth && navigate && !asModal) {
      navigate({ to: '/learn' }) // go to home page
      toastSuccess()
    }
  }, [navigate, isAuth, asModal, toastSuccess])

  const useLogin = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const email = event.target['email'].value
      const password = event.target['password'].value

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      toast.success(`You're logged in as ${data.user.email}`)
    },
  })

  if (isAuth) return <p>You are logged in; pls wait while we redirect you.</p>

  return (
    <>
      <h1 className="h3 text-base-content/90">Please log in</h1>
      <form role="form" onSubmit={useLogin.mutate} className="form">
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
              pattern="[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*"
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
            <Link tabIndex={4} to="/signup" className="btn btn-ghost">
              Create account
            </Link>
          </div>
          <ErrorShow show={!!useLogin.error}>
            Problem logging in: {useLogin.error?.message}
          </ErrorShow>
          <p>
            <Link to="/forgot-password" className="s-link text-sm">
              Forgot password?
            </Link>
          </p>
        </fieldset>
      </form>
    </>
  )
}
