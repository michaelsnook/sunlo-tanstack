import { getAllPhraseDetails } from 'app/data/fetchers'
import Client from './client'
import Navbar from 'app/(app)/navbar'
import languages from 'lib/languages'

export async function generateStaticParams() {
  let phrases = await getAllPhraseDetails()
  return phrases.map((phrase) => {
    return phrase?.lang && phrase?.text && phrase?.id ?
        {
          lang: phrase.lang,
          id: phrase.id,
        }
      : null
  })
}

export default function Page({ params: { id, lang } }) {
  return (
    <>
      <Navbar title={`${languages[lang]} Phrase`} />
      <Client pid={id} />
    </>
  )
}
