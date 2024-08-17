'use client'

import type { FormEvent } from 'react'
// nextjs: import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import supabase from 'lib/supabase-client'
import { cn } from 'lib/utils'
import { useAuth } from 'components/auth-context'
import ShowError from 'components/show-error'

export default function SetNewPasswordForm() {
  const { isAuth } = useAuth()

  const submitNewPassword = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const password = event.target['password'].value

      const { data, error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      console.log(`Updated user, received:`, data)
      toast.success('Successfully updated your password')
    },
  })

  return (
    submitNewPassword.isSuccess ? <SuccessfulSubmit />
    : !isAuth ? <InvalidLink />
    : <>
        <h1 className="h3 text-base-content/90">Choose a new password</h1>
        <form role="form" onSubmit={submitNewPassword.mutate} className="form">
          <fieldset
            className="flex flex-col gap-y-4"
            disabled={submitNewPassword.isPending}
          >
            <div>
              <p>
                <label htmlFor="password">New password</label>
              </p>
              <input
                id="password"
                name="password"
                required={true}
                //aria-invalid={
                //  submitNewPassword.error?.errors?.password ? true : false
                //}
                className={cn(
                  //submitNewPassword.error?.errors?.password
                  //  ? 'border-error/60'
                  //  : '',
                  's-input'
                )}
                tabIndex={1}
                type="password"
                placeholder="new password"
              />
            </div>
            <div className="flex flex-row justify-between">
              <button
                tabIndex={3}
                className="btn btn-primary"
                type="submit"
                disabled={submitNewPassword.isPending}
                aria-disabled={submitNewPassword.isPending}
              >
                Set new password
              </button>
            </div>
          </fieldset>
        </form>
        <ShowError show={!!submitNewPassword.error}>
          Error setting new password: {submitNewPassword.error?.message}
        </ShowError>
      </>
  )
}

const InvalidLink = () => (
  <div className="flex flex-col space-y-4">
    <h1 className="h3 text-base-content/90">Invalid link</h1>
    <p>
      Perhaps you&apos;ve received more than one password reset email? try the
      most recent one.
    </p>
    <p>
      Or maybe the token has expired; try requesting{' '}
      <Link href="/forgot-password" className="s-link">
        another password reset email
      </Link>
      .
    </p>
  </div>
)

const SuccessfulSubmit = () => (
  <div className="flex flex-col space-y-4">
    <h1 className="h3 text-base-content/90">Update Successful!</h1>
    <p>
      You can close this window or go{' '}
      <Link href="/profile" className="s-link">
        back to your profile
      </Link>
      .
    </p>
  </div>
)
