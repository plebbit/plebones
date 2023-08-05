import { useState } from "react"
import {
  useFloating,
  autoUpdate,
  offset,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId
} from "@floating-ui/react"
import styles from './reply-tools.module.css'

const Menu = ({reply}) => {
  return <div className={styles.replyToolsMenu}>
    <div>
      <textarea className={styles.submitContent} rows={2} placeholder='content' />
    </div>
    <div className={styles.submitButtonWrapper} ><button className={styles.submitButton}>reply</button></div>
  </div>
}

function ReplyTools({children, reply}) {
  // modal stuff
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(2),
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

  return (
    <>
      <span className={styles.replyToolsButton} ref={refs.setReference} {...getReferenceProps()}>
        {children}
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
            <Menu reply={reply}/>
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export default ReplyTools
