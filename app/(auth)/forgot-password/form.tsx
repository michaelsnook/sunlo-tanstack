'use client'

import { type FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import supabase from 'lib/supabase-client'
import { BASE_URL } from 'lib/utils'
import ShowError from 'components/show-error'

export default function ForgotPasswordForm() {
  const [yourEmail, setYourEmail] = useState()

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = event.target['email'].value
    setYourEmail(email)
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${BASE_URL}/profile/change-password`,
    })
    if (error) throw error
    return data
  }

  const useRequestPasswordForm = useMutation({
    mutationFn: onSubmit,
  })

  return (
    <>
      {useRequestPasswordForm.isSuccess ?
        <>
          <h1 className="h3 text-base-content/90">Check your email</h1>
          <p>We&apos;ve sent a password reset link to {yourEmail}.</p>
          <p>You can close this window.</p>
        </>
      : <>
          <h1 className="h3 text-base-content/90">Request a password reset</h1>
          <form
            role="form"
            onSubmit={useRequestPasswordForm.mutate}
            className="form"
          >
            <fieldset
              className="flex flex-col gap-y-4"
              disabled={useRequestPasswordForm.isPending}
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
                  aria-invalid={useRequestPasswordForm.error ? 'true' : 'false'}
                  className={`${
                    useRequestPasswordForm.error ? 'ring-error/60' : ''
                  } s-input`}
                  tabIndex={1}
                  type="email"
                  placeholder="email@domain"
                />
              </div>
              <div className="flex flex-row justify-between">
                <button
                  tabIndex={3}
                  className="btn btn-primary"
                  type="submit"
                  disabled={useRequestPasswordForm.isPending}
                  aria-disabled={useRequestPasswordForm.isPending}
                >
                  Send password reset email
                </button>
              </div>
            </fieldset>
          </form>
          <ShowError show={!!useRequestPasswordForm.error}>
            Error sending password reset:{' '}
            {useRequestPasswordForm.error?.message}
          </ShowError>
        </>
      }
    </>
  )
}
