import Navbar from 'app/(app)/navbar'
import SetNewEmailForm from './form'

export default function Page() {
  return (
    <>
      <Navbar title="Change email" />
      <main className="card-white mx-auto w-4/5">
        <SetNewEmailForm />
      </main>
    </>
  )
}
