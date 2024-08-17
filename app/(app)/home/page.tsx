// nextjs: import Link from 'next/link'
import Navbar from '../navbar'
import Client from './client'

export default function Page() {
  return (
    <>
      <Navbar title={`Continue learning...`}>
        <Link href={`/my-decks/new`}>+ deck</Link>
      </Navbar>
      <main className="flex flex-col gap-4 p-2">
        <Client />
      </main>
    </>
  )
}
