import {usePublishVote, useAccountVote} from '@plebbit/plebbit-react-hooks'
import {useMemo} from 'react'
import useChallenges from './use-challenges.js'
import {alertChallengeVerificationFailed} from '../lib/utils.js'

const useUpvote = (comment) => {
  const {addChallenge} = useChallenges()
  const {vote} = useAccountVote({commentCid: comment?.cid})

  const publishVoteOptions = useMemo(
    () => ({
      commentCid: comment?.cid,
      vote: vote !== 1 ? 1 : 0,
      subplebbitAddress: comment?.subplebbitAddress,
      onChallenge: (...args) => addChallenge([...args, comment]),
      onChallengeVerification: alertChallengeVerificationFailed,
      onError: console.warn,
    }),
    [comment, vote, addChallenge]
  )
  const {publishVote} = usePublishVote(publishVoteOptions)

  return [vote === 1, publishVote]
}

export default useUpvote
