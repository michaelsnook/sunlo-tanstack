'use client'

// nextjs: import Link from 'next/link'
import { useAuth } from 'components/auth-context'

export default function UserAuthCard() {
  const { userEmail } = useAuth()
  return (
    <div className="card card-body space-y-4 bg-base-100 text-base-content">
      <h2 className="card-title">Login credentials</h2>
      <div className="flex w-full flex-col">
        <label className="px-3 font-bold">Your email</label>
        <div className="flex flex-row gap-4">
          <input
            type="text"
            className="flex-grow rounded border bg-base-300 p-3 text-base-content/70"
            value={userEmail ?? 'loading...'}
            disabled
          />
          <Link
            href="/profile/change-email"
            className="btn btn-link hover:bg-base-200"
          >
            Change
          </Link>
        </div>
      </div>
      <div className="flex flex-col">
        <label className="px-3 font-bold">Your password</label>
        <div className="flex flex-row gap-4">
          <input
            type="text"
            className="flex-grow rounded border bg-base-300 p-3 text-base-content/70"
            value="***************"
            disabled
          />
          <Link
            href="/profile/change-password"
            className="btn btn-link hover:bg-base-200"
          >
            Change
          </Link>
        </div>
      </div>
    </div>
  )
}
