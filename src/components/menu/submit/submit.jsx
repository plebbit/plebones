import { useState } from "react"
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId
} from "@floating-ui/react"
import styles from './submit.module.css'
// import {usePublishComment} from '@plebbit/plebbit-react-hooks'
// import {Link} from 'react-router-dom'
import useDefaultSubplebbits from '../../../hooks/use-default-subplebbits'

const Submit = ({onSubmit}) => {
  const defaultSubplebbits = useDefaultSubplebbits()
  const subplebbitsOptions = defaultSubplebbits.map(subplebbit => <option value={subplebbit?.address}>p/{subplebbit?.address || ''}</option>)
  subplebbitsOptions.unshift(<option value='p/'>p/</option>)

  const onSubplebbitSelectChange = async (event) => {
    // set subplebbit
  }

  return <div className={styles.submit}>
    <div>
      <select className={styles.submitSelectSubplebbit} onChange={onSubplebbitSelectChange} value={'p/'}>
        {subplebbitsOptions}
      </select>
    </div>
    <div><input className={styles.submitTitle} placeholder='title' /></div>
    <div><textarea rows={6} className={styles.submitContent} placeholder='link' /></div>
    <div className={styles.submitButtonWrapper}><button className={styles.submitButton}>submit</button></div>
  </div>
}

function SubmitModal({className}) {
  // modal stuff
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(2),
      flip({ fallbackAxisSideDirection: "end" }),
      shift()
    ],
    whileElementsMounted: autoUpdate
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role
  ])

  const headingId = useId()

  const onSubmit = () => setIsOpen(false)

  return (
    <>
      <span className={className} ref={refs.setReference} {...getReferenceProps()}>
        submit
      </span>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={styles.modal}
            ref={refs.setFloating}
            style={floatingStyles}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <Submit onSubmit={onSubmit} />
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export default SubmitModal
