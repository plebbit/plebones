import { useState, useEffect } from 'react'
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
} from '@floating-ui/react'
import styles from './post-tools.module.css'
import {useSubscribe, useBlock, useAccount, useSubplebbit, usePublishCommentEdit} from '@plebbit/plebbit-react-hooks'
import {alertChallengeVerificationFailed} from '../../lib/utils'
import challengesStore from '../../hooks/use-challenges'
const {addChallenge} = challengesStore.getState()

const Menu = ({post, closeModal}) => {
  const {subscribed, subscribe, unsubscribe} = useSubscribe({subplebbitAddress: post?.subplebbitAddress})
  const {blocked: hidden, block: hide, unblock: unhide} = useBlock({cid: post?.cid})
  const {blocked: subplebbitBlocked, block: blockSubplebbit, unblock: unblockSubplebbit} = useBlock({address: post?.subplebbitAddress})
  const {blocked: authorBlocked, block: blockAuthor, unblock: unblockAuthor} = useBlock({address: post?.author?.address})
  const toggleSubscribe = () => !subscribed ? subscribe() : unsubscribe()
  const toggleHide = () => !hidden ? hide() : unhide()
  const toggleBlockSubplebbit = () => !subplebbitBlocked ? blockSubplebbit() : unblockSubplebbit()
  const toggleBlockAuthor = () => !authorBlocked ? blockAuthor() : unblockAuthor()

  const account = useAccount()
  const role = useSubplebbit({subplebbitAddress: post?.subplebbitAddress})?.roles?.[account?.author?.address]?.role
  const isMod = role === 'admin' || role === 'owner' || role === 'moderator'

  const share = () => {
    const shareUrl = `https://pleb.bz/p/${post?.subplebbitAddress}/c/${post?.cid}?redirect=plebones.eth.limo`
    alert(shareUrl)
  }

  return <div className={styles.postToolsMenu}>
    <div onClick={toggleSubscribe} className={styles.menuItem}>{!subscribed ? 'join' : 'leave'} p/{post?.shortSubplebbitAddress || ''}</div>
    <div onClick={toggleHide} className={styles.menuItem}>{!hidden ? 'hide' : 'unhide'}</div>
    <div onClick={toggleBlockSubplebbit} className={styles.menuItem}>{!subplebbitBlocked ? 'block' : 'unblock'} p/{post?.shortSubplebbitAddress || ''}</div>
    <div onClick={toggleBlockAuthor} className={styles.menuItem}>{!authorBlocked ? 'block' : 'unblock'} u/{post?.author?.shortAddress || ''}</div>
    <div onClick={share} className={styles.menuItem}>share</div>
    {isMod && <ModTools post={post} closeModal={closeModal}/>}
  </div>
}

const ModTools = ({post, closeModal}) => {
  const defaultPublishOptions = {
    removed: post?.removed,
    locked: post?.locked,
    spoiler: post?.spoiler,
    pinned: post?.pinned,
    commentCid: post?.cid,
    subplebbitAddress: post?.subplebbitAddress,
    onChallenge: (...args) => addChallenge([...args, post]),
    onChallengeVerification: alertChallengeVerificationFailed,
    onError: error => {
      console.error(error)
      alert(error)
    }
  }
  const [publishCommentEditOptions, setPublishCommentEditOptions] = useState(defaultPublishOptions)
  const {state, publishCommentEdit} = usePublishCommentEdit(publishCommentEditOptions)

  // close the modal after publishing
  useEffect(() => {
    if (state && state !== 'failed' && state !== 'initializing' && state !== 'ready') {
      closeModal?.()
    }
  }, [state, closeModal])

  const onCheckbox = e => 
    setPublishCommentEditOptions(state => ({...state, [e.target.id]: e.target.checked}))

  const onReason = e => 
    setPublishCommentEditOptions(state => ({...state, reason: e.target.value ? e.target.value : undefined}))

  return <div className={styles.modTools}>
    <div className={styles.menuItem}><input onChange={onCheckbox} checked={publishCommentEditOptions.removed} type='checkbox' id='removed'/ ><label for='removed'>removed</label></div>
    <div className={styles.menuItem}><input onChange={onCheckbox} checked={publishCommentEditOptions.locked} type='checkbox' id='locked'/ ><label for='locked'>locked</label></div>
    <div className={styles.menuItem}><input onChange={onCheckbox} checked={publishCommentEditOptions.spoiler} type='checkbox' id='spoiler'/ ><label for='spoiler'>spoiler</label></div>
    <div className={styles.menuItem}><input onChange={onCheckbox} checked={publishCommentEditOptions.pinned} type='checkbox' id='pinned'/ ><label for='pinned'>pinned</label></div>
    <div className={styles.menuItem}><input onChange={onReason} defaultValue={post?.reason} size={14} placeholder='reason'/><button onClick={publishCommentEdit}>edit</button></div>
  </div>
}

function PostTools({children, post}) {
  // modal stuff
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(2),
      flip({ fallbackAxisSideDirection: 'end',  }),
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
      <span className={styles.postToolsButton} ref={refs.setReference} {...getReferenceProps()}>
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
            <Menu post={post} closeModal={() => setIsOpen(false)}/>
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export default PostTools
