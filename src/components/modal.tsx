import Modal from 'react-modal'

function MyModal({ onRequestClose, isOpen, children }) {
  const el = document.querySelector('#modal-root')
  return (
    <Modal
      appElement={el}
      isOpen={isOpen}
      className="card-white w-app my-6 max-h-[90svh] place-self-center overflow-y-auto outline-none @container max-sm:mx-1"
      overlayClassName="bg-black/70 fixed backdrop-blur-sm fixed inset-0 flex"
      noScroll={true}
      onRequestClose={onRequestClose}
    >
      {children}
    </Modal>
  )
}

export default MyModal
