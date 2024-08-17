import languages from 'lib/languages'
import ClientPage from './client'

export default function Page({ params: { lang } }) {
  return (
    <main>
      <ClientPage lang={lang} />
    </main>
  )
}

export async function generateStaticParams() {
  return Object.keys(languages).map((lang) => ({
    lang,
  }))
}
