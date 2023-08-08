import { useState, useEffect } from "react"
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
import useReply from '../../hooks/use-reply'

const Menu = ({reply, onPublished}) => {
  const {blocked: hidden, block: hide, unblock: unhide} = useBlock({cid: reply?.cid})
  const {blocked: authorBlocked, block: blockAuthor, unblock: unblockAuthor} = useBlock({address: reply?.author?.address})
  const toggleHide = () => !hidden ? hide() : unhide()
  const toggleBlockAuthor = () => !authorBlocked ? blockAuthor() : unblockAuthor()

  const [upvoted, upvote] = useUpvote(reply)
  const [downvoted, downvote] = useDownvote(reply)

  const scoreNumber = (reply?.upvoteCount - reply?.downvoteCount) || 0
  const largeScoreNumber = String(scoreNumber).length > 3
  const negativeScoreNumber = scoreNumber < 0

  const {content, setContent, resetContent, replyIndex, publishReply} = useReply(reply)

  const onPublish = () => {
    if (!content) {
      alert(`missing content`)
      return
    }
    publishReply()
  }

  // close and reset modal after publishing
  useEffect(() => {
    if (typeof replyIndex === 'number') {
      onPublished?.()
      resetContent()
    }
  }, [replyIndex, onPublished, resetContent]) 

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
      <textarea className={styles.submitContent} rows={2} placeholder='content' defaultValue={content} onChange={(e) => setContent(e.target.value)}/>
    </div>
    <div className={styles.submitButtonWrapper} ><button onClick={onPublish}  className={styles.submitButton}>reply</button></div>
  </div>
}

function ReplyTools({children, reply}) {
  // modal stuff
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    /* don't open undefined or pending replies */
    onOpenChange: reply?.cid ? setIsOpen : undefined,
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
            <Menu reply={reply} onPublished={() => setIsOpen(false)}/>
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export default ReplyTools
