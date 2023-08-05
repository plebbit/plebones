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
import styles from './reply-tools.module.css'
import {useBlock} from '@plebbit/plebbit-react-hooks'
import Arrow from '../icons/arrow'
import useUpvote from '../../hooks/use-upvote'
import useDownvote from '../../hooks/use-downvote'

const Menu = ({reply}) => {
  const {blocked: hidden, block: hide, unblock: unhide} = useBlock({cid: reply?.cid})
  const {blocked: authorBlocked, block: blockAuthor, unblock: unblockAuthor} = useBlock({address: reply?.author?.address})
  const toggleHide = () => !hidden ? hide() : unhide()
  const toggleBlockAuthor = () => !authorBlocked ? blockAuthor() : unblockAuthor()

  const [upvoted, upvote] = useUpvote(reply)
  const [downvoted, downvote] = useDownvote(reply)

  const scoreNumber = (reply?.upvoteCount - reply?.downvoteCount) || 0
  const largeScoreNumber = String(scoreNumber).length > 3
  const negativeScoreNumber = scoreNumber < 0

  return <div className={styles.replyToolsMenu}>
    <div className={styles.menuRow}>
      <div className={styles.score}>
        <div onClick={upvote} className={[styles.upvote, upvoted ? styles.voteSelected : undefined].join(' ')}><Arrow /></div>
          <div className={[styles.scoreNumber, largeScoreNumber ? styles.largeScoreNumber : undefined, negativeScoreNumber ? styles.negativeScoreNumber: undefined].join(' ')}>
            {scoreNumber}
          </div>
        <div onClick={downvote} className={[styles.downvote, downvoted ? styles.voteSelected : undefined].join(' ')}><Arrow /></div>
      </div>
      {' '}
      <div>
        <div onClick={toggleHide} className={styles.menuItem}> {!hidden ? 'hide' : 'unhide'}</div>
        <div onClick={toggleBlockAuthor} className={styles.menuItem}> {!authorBlocked ? 'block' : 'unblock'} u/{reply?.author?.shortAddress || ''}</div>
      </div>
    </div>
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
