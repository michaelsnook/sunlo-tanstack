import Modal from 'react-modal'

Modal.setAppElement('#modal-root')

function MyModal({ onRequestClose, isOpen, children }) {
  return (
    <Modal
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
