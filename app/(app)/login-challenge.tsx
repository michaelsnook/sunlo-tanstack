'use client'

import { useState } from 'react'
import Modal from 'react-modal'
import { useAuth } from 'components/auth-context'
import LoginForm from 'app/(auth)/login/form'

Modal.setAppElement('#modal-root')

export default function LoginChallenge() {
  const { isAuth, isPending } = useAuth()
  const [isDismissed, setIsDismissed] = useState(false)
  // console.log(`auth login challenge`, isAuth)
  return (
    <Modal
      isOpen={!isDismissed && !isAuth && !isPending}
      className="card-white w-app my-6 place-self-center outline-none @container max-sm:mx-1"
      overlayClassName="bg-black/70 fixed backdrop-blur-sm fixed inset-0 flex"
      noScroll={true}
      handleCloseModal={() => setIsDismissed(true)}
    >
      <LoginForm asModal />
    </Modal>
  )
}
