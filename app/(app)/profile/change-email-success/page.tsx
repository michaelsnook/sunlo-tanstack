'use client'

import { useAuth } from 'components/auth-context'
import Navbar from 'app/(app)/navbar'

export default function Page() {
  const { userEmail } = useAuth()
  return (
    <>
      <Navbar title="Email changed" />
      <main className="card-white mx-auto w-4/5">
        {userEmail ?
          <div className="flex flex-col space-y-4">
            <h1 className="h3 text-base-content/90">Email address changed!</h1>
            <p>You&apos;ve successfully changed your email to {userEmail}</p>
            <p>You can close this tab.</p>
          </div>
        : <div className="flex flex-col space-y-4">
            <h1 className="h3 text-base-content/90">Something went wrong...</h1>
            <p>
              We are&apos;t sure what it is... if this message is still here in
              10 seconds you may want to try setting your email again.
            </p>
          </div>
        }
      </main>
    </>
  )
}
