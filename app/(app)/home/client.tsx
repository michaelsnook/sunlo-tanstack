'use client'

// nextjs: import Link from 'next/link'
import { useProfile } from 'app/data/hooks'
import languages from 'lib/languages'
import Loading from 'components/loading'

export default function Client() {
  const { data: profile, isPending } = useProfile()

  return isPending ?
      <Loading />
    : <ol>
        {profile.deck_stubs?.map((deck) => (
          <li key={deck.lang} className="glass my-2 rounded p-2 text-center">
            <Link href={`home/${deck.lang}`}>
              <p className="py-2 text-xl">{languages[deck.lang]}</p>
            </Link>
          </li>
        ))}
      </ol>
}
