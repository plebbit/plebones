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
import styles from './post-tools.module.css'
import {useSubscribe, useBlock} from '@plebbit/plebbit-react-hooks'

function PostTools({children, post}) {
  // modal stuff
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(2),
      flip({ fallbackAxisSideDirection: "end",  }),
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

  // plebbit stuff
  const {subscribed, subscribe, unsubscribe} = useSubscribe({subplebbitAddress: post?.subplebbitAddress})
  const {blocked: hidden, block: hide, unblock: unhide} = useBlock({cid: post?.cid})
  const {blocked: subplebbitBlocked, block: blockSubplebbit, unblock: unblockSubplebbit} = useBlock({address: post?.subplebbitAddress})
  const {blocked: authorBlocked, block: blockAuthor, unblock: unblockAuthor} = useBlock({address: post?.author?.address})
  const toggleSubscribe = () => !subscribed ? subscribe() : unsubscribe()
  const toggleHide = () => !hidden ? hide() : unhide()
  const toggleBlockSubplebbit = () => !subplebbitBlocked ? blockSubplebbit() : unblockSubplebbit()
  const toggleBlockAuthor = () => !authorBlocked ? blockAuthor() : unblockAuthor()

  return (
    <>
      <span className={styles.postToolsButton} ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </span>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={styles.postToolsMenu}
            ref={refs.setFloating}
            style={floatingStyles}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <div onClick={toggleSubscribe} className={styles.menuItem}>{!subscribed ? 'join' : 'leave'} p/{post?.subplebbitAddress || ''}</div>
            <div onClick={toggleHide} className={styles.menuItem}>{!hidden ? 'hide' : 'unhide'}</div>
            <div onClick={toggleBlockSubplebbit} className={styles.menuItem}>{!subplebbitBlocked ? 'block' : 'unblock'} p/{post?.subplebbitAddress || ''}</div>
            <div onClick={toggleBlockAuthor} className={styles.menuItem}>{!authorBlocked ? 'block' : 'unblock'} u/{post?.author?.shortAddress || ''}</div>
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export default PostTools
