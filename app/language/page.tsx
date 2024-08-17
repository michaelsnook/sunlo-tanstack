import Link from 'next/link'
import supabase from 'lib/supabase-client'

export default async function Page() {
  const { data, error } = await supabase
    .from('language_plus')
    .select('*')
    .is('alias_of', null)

  const active = data.filter((l) => l.phrases_to_learn > 0)
  const inactive = data.filter((l) => l.phrases_to_learn === 0)

  return (
    <main className="page-card">
      <h1 className="h1">Languages</h1>
      <ul className="columns-[18rem] gap-4 space-y-4">
        {active.map(({ lang, name, learners, phrases_to_learn }) => (
          <li key={lang} className="break-inside-avoid text-start">
            <Link
              href={`/language/${lang}`}
              className="card card-body shadow hover:bg-base-200"
            >
              <h3 className="card-title">
                {name} ({lang})
              </h3>
              <p>
                {learners} {learners === 1 ? 'person' : 'people'} learning{' '}
                {phrases_to_learn} different phrases
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="divider" />
      <p>
        These languages are currently empty &ndash; you can be the first to
        start adding cards to our public library
      </p>
      <ul className="list-disc columns-[12rem] gap-4 space-y-2 px-4">
        {inactive.map(({ lang, name }) => (
          <li key={lang}>
            <Link href={`/language/${lang}`} className="s-link">
              {name} ({lang})
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
