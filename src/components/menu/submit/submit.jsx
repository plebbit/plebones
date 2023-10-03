import {useState, useEffect, memo} from 'react'
import {useFloating, autoUpdate, offset, flip, shift, useDismiss, useRole, useClick, useInteractions, FloatingFocusManager, useId} from '@floating-ui/react'
import styles from './submit.module.css'
import {usePublishComment} from '@plebbit/plebbit-react-hooks'
import createStore from 'zustand'
import challengesStore from '../../../hooks/use-challenges'
import {useNavigate, useParams} from 'react-router-dom'
import {isLink, useDefaultAndSubscriptionsSubplebbits} from './utils'
import {alertChallengeVerificationFailed} from '../../../lib/utils'

const {addChallenge} = challengesStore.getState()

const useSubmitStore = createStore((setState, getState) => ({
  subplebbitAddress: undefined,
  title: undefined,
  content: undefined,
  publishCommentOptions: undefined,
  setSubmitStore: ({subplebbitAddress, title, content}) =>
    setState((state) => {
      const nextState = {...state}
      if (subplebbitAddress !== undefined) {
        nextState.subplebbitAddress = subplebbitAddress
      }
      if (title !== undefined) {
        nextState.title = title
      }
      if (content !== undefined) {
        nextState.content = content
      }
      nextState.publishCommentOptions = {
        ...nextState,
        onChallenge: (...args) => addChallenge(args),
        onChallengeVerification: alertChallengeVerificationFailed,
        onError: (error) => {
          console.warn(error)
          alert(error)
        },
      }
      // plebones only has 1 input for link or content, detect if is link before publishing
      if (isLink(nextState.publishCommentOptions.content)) {
        nextState.publishCommentOptions.link = nextState.publishCommentOptions.content
        delete nextState.publishCommentOptions.content
      }
      return nextState
    }),
  resetSubmitStore: () => setState((state) => ({subplebbitAddress: undefined, title: undefined, content: undefined, publishCommentOptions: undefined})),
}))

const Submit = ({onSubmit}) => {
  const params = useParams()
  const subplebbits = useDefaultAndSubscriptionsSubplebbits()
  const {subplebbitAddress, title, content, publishCommentOptions, setSubmitStore, resetSubmitStore} = useSubmitStore()
  const {index, publishComment} = usePublishComment(publishCommentOptions)

  const navigate = useNavigate()

  const onPublish = () => {
    if (!title) {
      alert(`missing title`)
      return
    }
    if (!content) {
      alert(`missing link`)
      return
    }
    if (!subplebbitAddress) {
      alert(`missing subplebbit`)
      return
    }
    publishComment()
  }

  // redirect to pending post after submitting
  useEffect(() => {
    if (typeof index === 'number') {
      onSubmit?.()
      resetSubmitStore({})
      navigate(`/profile/${index}`)
    }
  }, [index, onSubmit, resetSubmitStore, navigate])

  return (
    <div className={styles.submit}>
      <SubplebbitSelect subplebbits={subplebbits} subplebbitAddress={subplebbitAddress || params.subplebbitAddress} setSubmitStore={setSubmitStore} />
      <div>
        {/* set params.subplebbitAddress as default if subplebbitAddress is not yet defined */}
        <input
          onChange={(e) => setSubmitStore({title: e.target.value, subplebbitAddress: !subplebbitAddress ? params.subplebbitAddress : undefined})}
          defaultValue={title}
          className={styles.submitTitle}
          placeholder="title"
        />
      </div>
      <div>
        <textarea
          onChange={(e) => setSubmitStore({content: e.target.value, subplebbitAddress: !subplebbitAddress ? params.subplebbitAddress : undefined})}
          defaultValue={content}
          rows={6}
          className={styles.submitContent}
          placeholder="link"
        />
      </div>
      <div className={styles.submitButtonWrapper}>
        <button onClick={onPublish} className={styles.submitButton}>
          submit
        </button>
      </div>
    </div>
  )
}

const SubplebbitSelect = memo(({subplebbits, subplebbitAddress, setSubmitStore}) => {
  const subplebbitsOptions = subplebbits.map((subplebbit) => (
    <option key={subplebbit.address} value={subplebbit.address}>
      p/{subplebbit.displayAddress}
    </option>
  ))
  subplebbitsOptions.unshift(
    <option key="p/" value="">
      p/
    </option>
  )
  return (
    <div>
      <select
        onChange={(e) => setSubmitStore({subplebbitAddress: e.target.value})}
        // NOTE: using 'defaultValue' instead of 'value' sometimes causes a bug to render 'p/' even when subplebbitAddress
        // is defined, but it seems to improve performance and the bug doesn't affect UX much
        defaultValue={subplebbitAddress || 'p/'}
        className={styles.submitSelectSubplebbit}
      >
        {subplebbitsOptions}
      </select>
    </div>
  )
})

function SubmitModal({className}) {
  // modal stuff
  const [isOpen, setIsOpen] = useState(false)

  const {refs, floatingStyles, context} = useFloating({
    placement: 'bottom',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(2), flip({fallbackAxisSideDirection: 'end'}), shift()],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const {getReferenceProps, getFloatingProps} = useInteractions([click, dismiss, role])

  const headingId = useId()

  const onSubmit = () => setIsOpen(false)

  return (
    <>
      <span className={className} ref={refs.setReference} {...getReferenceProps()}>
        submit
      </span>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div className={styles.modal} ref={refs.setFloating} style={floatingStyles} aria-labelledby={headingId} {...getFloatingProps()}>
            <Submit onSubmit={onSubmit} />
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export default SubmitModal
