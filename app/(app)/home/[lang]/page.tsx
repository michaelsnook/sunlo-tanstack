import { notFound } from 'next/navigation'
import Navbar from 'app/(app)/navbar'
import languages from 'lib/languages'
import Client from './client'

export default function Page({ params: { lang } }) {
  const language = languages[lang]
  if (typeof language !== 'string') notFound()

  return (
    <>
      <Navbar title={`Learning ${language}`} />
      <main className="mx-auto">
        <Client lang={lang} />
      </main>
    </>
  )
}

export async function generateStaticParams() {
  return Object.keys(languages).map((lang) => ({
    lang,
  }))
}
