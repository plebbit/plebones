import { useState } from "react"
import {
  useFloating,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  FloatingOverlay,
  useId
} from "@floating-ui/react"
import styles from './post-modal.module.css'
import Post from '../post'

function PostModal({children, post}) {
  // modal stuff
  const [isOpen, setIsOpen] = useState(false)

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
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
      <span className={styles.postModalButton} ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </span>
      {isOpen && (
        <FloatingOverlay className={styles.overlay} lockScroll>
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              aria-labelledby={headingId}
              {...getFloatingProps()}
            >
              <Post post={post}/>
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </>
  )
}

export default PostModal
