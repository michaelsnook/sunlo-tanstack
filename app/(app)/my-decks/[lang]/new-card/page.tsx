import languages from 'lib/languages'
import AddCardPhraseForm from './form'
import Navbar from 'app/(app)/navbar'

export default function Page({ params: { lang } }) {
  return (
    <>
      <Navbar title={`Add a new ${languages[lang]} phrase`}></Navbar>
      <main className="card-white">
        <AddCardPhraseForm defaultLang={lang} />
      </main>
    </>
  )
}

export async function generateStaticParams() {
  return Object.keys(languages).map((lang) => ({
    lang,
  }))
}
