'use client'

import { AddCardButtonsSection, SectionSeeAlsos } from 'components/big-phrase'
import EditCardStatusButtons from 'components/edit-status-buttons'
import SectionTranslations from 'components/translations-section'
import TinyPhrase from 'components/tiny-phrase'
import Loading from 'components/loading'
import { useCard } from 'lib/preload-deck'
import { usePhrase } from 'lib/preload-language'

export default function Client({ pid }) {
  const phrase = usePhrase(pid)?.data
  const card = useCard(pid)?.data

  return !phrase ?
      <Loading />
    : <main className="card-white">
        {!phrase ? null : (
          <>
            <h2 lang={phrase.lang} className="h3 font-bold">
              <TinyPhrase lang={phrase.lang} text={phrase.text} />
            </h2>
            <SectionTranslations phrase={phrase} />
            <SectionSeeAlsos relations={phrase?.relation_pids} />
            {card ?
              <EditCardStatusButtons pid={phrase?.id} />
            : <AddCardButtonsSection pid={pid} onClose={() => {}} />}
          </>
        )}
      </main>
}
