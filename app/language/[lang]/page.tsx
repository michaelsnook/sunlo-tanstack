// nextjs: import Link from 'next/link'
import PhraseCardSmall from './phrase-card-small'
import { getLanguageDetails } from 'app/data/fetchers'
import languages from 'lib/languages'
import { notFound } from 'next/navigation'
import Navbar from 'app/(app)/navbar'

export default async function Page({ params: { lang } }) {
  if (!languages[lang]) {
    return notFound()
  }

  const language = await getLanguageDetails(lang)
  if (language === null) {
    return notFound()
  }

  return (
    <>
      <Navbar title={`${languages[lang]} (${lang})`}></Navbar>
      <main className="page-card">
        {!language?.phrases?.length ?
          <p>
            We don&apos;t have any phrases for you to learn {languages[lang]}{' '}
            yet. But you can be the first to add one!
          </p>
        : <ul className="columns-1 gap-4 @lg:columns-2 @3xl:columns-3">
            {language.phrases.map((phrase) => (
              <li key={`phrase-${phrase.id}`}>
                <Link href={`/language/${lang}/phrase/${phrase.id}`}>
                  <PhraseCardSmall
                    text={phrase.text}
                    lang={phrase.lang}
                    translations={phrase.translations}
                  />
                </Link>
              </li>
            ))}
          </ul>
        }
      </main>
    </>
  )
}

export async function generateStaticParams() {
  return Object.keys(languages).map((lang) => ({
    lang,
  }))
}
