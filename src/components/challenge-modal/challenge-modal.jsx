import { useState } from "react"
import {
  useFloating,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId
} from "@floating-ui/react"
import styles from './challenge-modal.module.css'
import useChallenges from '../../hooks/use-challenges'
import {getPublicationType, getVotePreview, getPublicationPreview} from './utils'

const Challenge = ({challenge, closeModal}) => {
  const challenges = challenge?.[0]?.challenges
  const publication = challenge?.[1]
  const publicationTarget = challenge?.[2] // the comment being voted on, replied to or edited
  const publicationType = getPublicationType(publication)
  const publicationPreview = publicationType === 'vote' ? getPublicationPreview(publicationTarget) : getPublicationPreview(publication)
  const parentCommentPreview = publicationType === 'reply' ? getPublicationPreview(publicationTarget) : undefined
  const votePreview = getVotePreview(publication)

  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const onAnswersChange = (e) => {
    setAnswers(prevAnswers => {
      const answers = [...prevAnswers]
      answers[currentChallengeIndex] = e.target.value
      return answers
    })
  }
  const onSubmit = () => {
    publication.publishChallengeAnswers(answers)
    setAnswers([])
    closeModal()
  }

  return <div className={styles.challenge}>
    <div>{publicationType}{votePreview} in p/{publication?.shortSubplebbitAddress}</div>
    {parentCommentPreview && <div>to: {parentCommentPreview}</div>}
    <div>{publicationPreview}</div>
    <div className={styles.challengeMediaWrapper}><img alt='challenge' className={styles.challengeMedia} src={`data:image/png;base64,${challenges[currentChallengeIndex]?.challenge}`}/></div>
    <div><input onChange={onAnswersChange} value={answers[currentChallengeIndex] || ''} className={styles.challengeInput}/></div>
    <div className={styles.challengeFooter}>
      <div>{currentChallengeIndex + 1} of {challenges?.length}</div>
      <span>
        {challenges.length > 1 && <button disabled={!challenges[currentChallengeIndex-1]} onClick={() => setCurrentChallengeIndex(prev => prev - 1)}>previous</button>}
        {challenges[currentChallengeIndex+1] && <button onClick={() => setCurrentChallengeIndex(prev => prev + 1)}>next</button>}
        {!challenges[currentChallengeIndex+1] && <button onClick={onSubmit}>submit</button>}
      </span>
    </div>
  </div>
}

function ChallengeModal() {
  // plebbit stuff
  const {challenges, removeChallenge} = useChallenges()

  // modal stuff
  const isOpen = !!challenges.length
  const closeModal = () => removeChallenge()

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: closeModal,
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
            <Challenge challenge={challenges[0]} closeModal={closeModal}/>
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export default ChallengeModal
