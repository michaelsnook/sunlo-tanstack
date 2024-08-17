import Form from './form'
import Navbar from 'app/(app)/navbar'

export default function Page() {
  return (
    <>
      <Navbar title="Start Learning" />
      <main className="card-white">
        <Form />
      </main>
    </>
  )
}
