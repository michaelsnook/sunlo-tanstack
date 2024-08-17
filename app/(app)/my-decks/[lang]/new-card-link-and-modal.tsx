'use client'

import { useState } from 'react'
import MyModal from 'components/modal'
import AddCardPhraseForm from 'app/(app)/my-decks/[lang]/new-card/form'

export default function NewCardLinkAndModal({ lang }) {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <a
        onClick={() => setShowModal(true)}
        className="flex-none place-self-center"
      >
        + new card
      </a>
      <MyModal isOpen={showModal} onRequestClose={() => setShowModal(false)}>
        <h1 className="h1">Add a new card</h1>
        <AddCardPhraseForm
          defaultLang={lang}
          cancel={() => setShowModal(false)}
        />
      </MyModal>
    </>
  )
}
