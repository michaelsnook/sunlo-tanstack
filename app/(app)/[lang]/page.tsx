import languages from 'lib/languages'
import ClientPage from './use-client'
// nextjs: import Link from 'next/link'

export default function Page({ params: { lang } }) {
  return (
    <main className="page-card">
      <h1 className="h1">
        {languages[lang]} <span className="sub">[{lang}]</span>
      </h1>
      <p>
        <Link href="/hin">hin</Link> | <Link href="/tam">tam</Link>
      </p>
      <div>
        <ClientPage />
      </div>
    </main>
  )
}

export async function generateStaticParams() {
  return Object.keys(languages).map((lang) => ({
    lang,
  }))
}
