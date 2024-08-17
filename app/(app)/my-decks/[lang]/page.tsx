import languages from 'lib/languages'
import NewCardLinkAndModal from './new-card-link-and-modal'
import ClientPage from './client-page'
import Navbar from 'app/(app)/navbar'

export default function Page({ params: { lang } }) {
  return (
    <>
      <Navbar title={`Manage your ${languages[lang]} flashcards`}>
        <NewCardLinkAndModal lang={lang} />
      </Navbar>
      <main>
        <div className="card-white">
          <ClientPage lang={lang} />
        </div>
      </main>
    </>
  )
}

export async function generateStaticParams() {
  return Object.keys(languages).map((lang) => ({
    lang,
  }))
}
