import {useMemo, useCallback} from 'react'
import {useAccountComments, useReplies as plebbitReactHooksUseReplies} from '@plebbit/plebbit-react-hooks'
import useRepliesSortType from './use-replies-sort-type'

const useReplies = (options) => {
  const {useRepliesOptions} = useRepliesSortType()
  const {replies, ...rest} = plebbitReactHooksUseReplies({...useRepliesOptions, ...options})

  // filter only the parent cid
  const comment = options?.comment
  const filter = useCallback((accountComment) => accountComment.parentCid === (comment?.cid || 'n/a'), [comment?.cid])
  const {accountComments} = useAccountComments({filter})

  // the account's replies have a delay before getting published, so get them locally from accountComments instead
  const accountRepliesNotYetPublished = useMemo(() => {
    const replyCids = new Set(replies.map((reply) => reply?.cid))
    // filter out the account comments already in comment.replies, so they don't appear twice
    return accountComments.filter((accountReply) => !replyCids.has(accountReply?.cid))
  }, [replies, accountComments])

  const repliesAndNotYetPublishedReplies = useMemo(() => {
    return [
      // put the author's unpublished replies at the top, latest first (reverse)
      ...accountRepliesNotYetPublished.reverse(),
      // put the published replies after,
      ...replies,
    ]
  }, [replies, accountRepliesNotYetPublished])

  return {replies: repliesAndNotYetPublishedReplies, ...rest}
}

export default useReplies
