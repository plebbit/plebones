import {
  useFloating,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId
} from "@floating-ui/react"
import styles from './go-to-subplebbit-modal.module.css'
import {useNavigate} from 'react-router-dom'
import createStore from 'zustand'

const useSubplebbitAddress = createStore((setState) => ({
  subplebbitAddress: '',
  setSubplebbitAddress: (subplebbitAddress) => setState(state => ({subplebbitAddress}))
}))

const GoToSubplebbit = () => {
  const navigate = useNavigate()
  const {subplebbitAddress, setSubplebbitAddress} = useSubplebbitAddress()

  const go = (e) => {
    if (e.key === 'Enter' || e.key === undefined) {
      const cleanedSubplebbitAddress = subplebbitAddress.trim().replace(/^\/?p\//i, '')
      if (cleanedSubplebbitAddress) {
        navigate(`/p/${cleanedSubplebbitAddress}`)
      }
    }
  }

  const onChange = (e) => setSubplebbitAddress(e.target.value)

  return <div className={styles.goToSubplebbit}>
    <input defaultValue={subplebbitAddress} onChange={onChange} onKeyPress={go} placeholder='address.eth' />
    <button onClick={go}>go</button>
  </div>
}

function GoToSubplebbitModal({isOpen, setIsOpen}) {
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { getFloatingProps } = useInteractions([
    click,
    dismiss,
    role
  ])

  const headingId = useId()

  return (
    <>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={styles.modal}
            ref={refs.setFloating}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <GoToSubplebbit />
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export default GoToSubplebbitModal
