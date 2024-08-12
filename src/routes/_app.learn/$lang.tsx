import { queryOptions } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import supabase from '../../lib/supabase-client'
import { mapArray, selects } from '../../lib/utils'
import {
  LanguageFetched,
  LanguageLoaded,
  PhrasesMap,
  pids,
} from '../../types/main'
import languages from '../../lib/languages'
import ClientPage from './-interactive'
// nextjs: import Link from 'next/link'

export async function fetchLanguage(lang: string): Promise<LanguageLoaded> {
  const { data } = await supabase
    .from('language_plus')
    .select(selects.language_full())
    .eq('lang', lang)
    .maybeSingle()
    .throwOnError()
  const { phrases: phrasesArray, ...meta }: LanguageFetched = data
  const pids: pids = phrasesArray?.map((p) => p.id)
  const phrases: PhrasesMap = mapArray(phrasesArray, 'id')
  return {
    meta,
    pids,
    phrases,
  }
}

const languageQuery = (lang: string) =>
  queryOptions({
    queryKey: ['language', lang],
    queryFn: async () => fetchLanguage(lang),
    enabled: typeof lang === 'string' && lang.length === 3,
    gcTime: 1_200_000,
    staleTime: 120_000,
    refetchOnWindowFocus: false,
  })

export const Route = createFileRoute('/_app/learn/$lang')({
  // Use the `loader` option to ensure that the data is loaded
  loader: ({ context: { queryClient }, params: { lang } }) => {
    queryClient.ensureQueryData(languageQuery(lang))
  },
  component: Page,
})

function Page({ params: { lang } }) {
  const { data, isPending } = useQuery(publicProfilesQuery)

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
