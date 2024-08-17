import { getAllPhraseDetails } from 'app/data/fetchers'
import TinyPhrase from 'components/tiny-phrase'
import languages from 'lib/languages'
import { notFound } from 'next/navigation'
import Navbar from 'app/(app)/navbar'

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

export default async function Page({ params: { lang, id } }) {
  const phrases = await getAllPhraseDetails()
  const phrase = phrases.find((p) => p.id === id)
  if (!phrase) notFound()

  return (
    <>
      <Navbar title={`${languages[lang]} Phrase`}></Navbar>
      <main className="page-card w-app gap-8">
        <div>
          <h1 className="h1 my-0">&ldquo;{phrase.text}&rdquo;</h1>
        </div>
        <div>
          <h2 className="h2">Translations</h2>
          <ul>
            {phrase?.translations?.length ?
              phrase.translations.map((trans) => (
                <li key={`translation/${trans.id}`}>
                  <TinyPhrase {...trans} />
                </li>
              ))
            : <>OOPS! No translations for this phrase</>}
          </ul>
        </div>
        <div>
          <h2 className="h2 my-6">Related phrases</h2>
          <ul>
            {phrase.see_also_phrases?.length ?
              phrase.see_also_phrases.map((p) => {
                return (
                  <li key={`seeAlso/${p.id}`}>
                    <TinyPhrase {...p} />
                  </li>
                )
              })
            : <p className="italic text-base-content/70">
                No related phrases to see here
              </p>
            }
          </ul>
        </div>
      </main>
    </>
  )
}
