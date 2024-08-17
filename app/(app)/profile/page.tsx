// nextjs: import Link from 'next/link'
import Navbar from 'app/(app)/navbar'
import UpdateProfileForm from './update-profile-form'
import UserAuthCard from './user-auth-card'

export default function Page() {
  return (
    <>
      <Navbar>
        <Link href="/getting-started">Profile setup &rarr;</Link>
      </Navbar>
      <div className="card-white">
        <div className="h3">
          <h3>Edit Profile</h3>
          <p>Update your profile information.</p>
        </div>

        <UpdateProfileForm />
      </div>
      <UserAuthCard />
    </>
  )
}
