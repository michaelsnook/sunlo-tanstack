import { useState } from 'react'
import SectionTranslations from 'components/translations-section'
import TinyPhrase from 'components/tiny-phrase'
import MyModal from 'components/modal'
// import { SectionSeeAlsos } from 'components/big-phrase'

export default function ClientPage({ language, deck }) {
  const { meta: langMeta, phrases: langItems } = language
  const { meta: deckMeta, cards: deckItems, pids: deckPids } = deck

  return (
    <div className="space-y-4">
      <div>
        <div>
          deck is{' '}
          <PlusDetailModal>
            {JSON.stringify(deckMeta.data, null, 2)}
          </PlusDetailModal>
        </div>
        <div>
          language is{' '}
          <PlusDetailModal>
            {JSON.stringify(langMeta.data, null, 2)}
          </PlusDetailModal>
        </div>
      </div>
      <div className="flex-basis-[20rem] flex flex-shrink flex-row flex-wrap gap-4">
        {deckPids.data?.map((pid) => {
          return (
            <div
              key={pid}
              tabIndex={0}
              className="collapse collapse-arrow border border-base-300 bg-base-200"
            >
              <div className="collapse-title text-xl font-medium">
                <div className="inline flex-grow">
                  {deckItems.data[pid].status.substring(0, 2)}
                  {'  '}
                  <TinyPhrase {...langItems.data[pid]} />
                </div>
              </div>
              <div className="collapse-content">
                <SectionTranslations phrase={langItems.data[pid]} />
                {/*
                  <SectionSeeAlsos seeAlsos={langItems[pid].relation_pids} />

                  This won't work (yet) bc the structure of this data has changed.
                  We will copy this component, modify it for the new structure, and
                  delete the old one when the pages using it are migrated or retired.
                */}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PlusDetailModal({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)
  const open = () => setIsOpen(true)
  return (
    <>
      <a role="button" onClick={open} className="s-link">
        [see details]
      </a>

      <MyModal isOpen={isOpen} onRequestClose={close}>
        {children}
      </MyModal>
    </>
  )
}
