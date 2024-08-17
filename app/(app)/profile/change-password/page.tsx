import Navbar from 'app/(app)/navbar'
import SetNewPasswordForm from 'app/(auth)/set-new-password/form'

export default function Page() {
  return (
    <>
      <Navbar title="Change password" />
      <main className="card-white mx-auto w-4/5">
        <SetNewPasswordForm />
      </main>
    </>
  )
}
