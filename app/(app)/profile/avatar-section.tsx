'use client'

import Image from 'next/image'
import { useProfile } from 'app/data/hooks'

export default function AvatarSection() {
  const { data: profile } = useProfile()
  return (
    <header className="mx-auto my-4 max-w-sm text-center">
      <div className="avatar relative">
        {profile?.avatar_url && (
          <label
            className="mask mask-circle mb-2 h-36 w-36 bg-base-300 shadow-lg"
            htmlFor="single"
          >
            <Image
              src={profile?.avatar_url}
              width="144"
              height="144"
              alt={`${profile?.username}'s profile image`}
            />
          </label>
        )}
      </div>
      <div>
        <h2 className="text-4xl">Hello {profile?.username} 👋</h2>
      </div>
    </header>
  )
}
