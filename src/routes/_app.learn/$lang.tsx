import { queryOptions, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import supabase from 'lib/supabase-client'
import { mapArray, selects } from 'lib/utils'
import {
  CardsMap,
  DeckFetched,
  DeckLoaded,
  LanguageFetched,
  LanguageLoaded,
  PhrasesMap,
  pids,
} from 'types/main'
import languages from 'lib/languages'
import ClientPage from './-interactive'
import Loading from 'components/loading'
import Navbar from 'components/navbar'

async function fetchLanguage(lang: string): Promise<LanguageLoaded> {
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
    queryFn: async ({ queryKey }) => fetchLanguage(queryKey[1]),
    enabled: typeof lang === 'string' && lang.length === 3,
    gcTime: 1_200_000,
    staleTime: 120_000,
    refetchOnWindowFocus: false,
  })

async function fetchDeck(lang: string): Promise<DeckLoaded> {
  const { data } = await supabase
    .from('user_deck_plus')
    .select(selects.deck_full())
    .eq('lang', lang)
    .maybeSingle()
    .throwOnError()
  const { cards: cardsArray, ...meta }: DeckFetched = data
  const pids: pids = cardsArray?.map((c) => c.phrase_id)
  const cards: CardsMap = mapArray(cardsArray, 'phrase_id')
  return {
    meta,
    pids,
    cards,
  }
}

const deckQuery = (lang: string) =>
  queryOptions({
    queryKey: ['user', lang],
    queryFn: async ({ queryKey }) => fetchDeck(queryKey[1]),
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

function Page() {
  const { lang } = Route.useParams()

  const { data: languageData, isPending: languageIsPending } = useQuery(
    languageQuery(lang)
  )
  const { data: deckData, isPending: deckIsPending } = useQuery(deckQuery(lang))
  const contextMenu = [
    {
      name: 'Add a phrase',
      href: './add-phrase',
      icon: 'square-plus',
    },
    {
      name: `Search ${deckData?.meta.language}`,
      href: './search',
      icon: 'search',
    },
    {
      name: 'Your cards',
      href: './browse',
      icon: 'wallet-cards',
    },
  ]

  return (
    <>
      <Navbar title={`Learning ${languages[lang]}`} contextMenu={contextMenu} />
      <main className="page-card">
        <p>
          <Link
            from={Route.fullPath}
            to="/learn/$lang"
            params={{ lang: 'hin' }}
          >
            hin
          </Link>{' '}
          |{' '}
          <Link
            from={Route.fullPath}
            to="/learn/$lang"
            params={{ lang: 'tam' }}
          >
            tam
          </Link>
        </p>
        <div>
          {languageIsPending || deckIsPending ?
            <Loading />
          : <ClientPage language={languageData} deck={deckData} />}
        </div>
      </main>
    </>
  )
}
