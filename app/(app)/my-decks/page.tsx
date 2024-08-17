// nextjs: import Link from 'next/link'
import ClientPage from './client-page'
import Navbar from '../navbar'

export default function Page() {
  return (
    <>
      <Navbar title="My languages">
        <Link href="/my-decks/new">+ new deck</Link>
      </Navbar>
      <main className="page-card">
        <ClientPage />
      </main>
    </>
  )
}
