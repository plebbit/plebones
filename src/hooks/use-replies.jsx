import {useMemo, useCallback} from 'react'
import {useAccountComments, useReplies} from '@plebbit/plebbit-react-hooks'
import useRepliesSortType from './use-replies-sort-type'

const useRepliesAndAccountReplies = (comment) => {
  const {useRepliesOptions} = useRepliesSortType()
  const {sortType, flat} = useRepliesOptions

  // filter only the parent cid
  const filter = useCallback((accountComment) => accountComment.parentCid === (comment?.cid || 'n/a'), [comment?.cid])
  const {accountComments} = useAccountComments({filter})
  let {replies, ...rest} = useReplies(comment?.depth === 0 && {comment, sortType, flat})
  // if (comment?.depth !== 0 && comment?.replies?.pages?.[sortType]?.comments) {
  //   replies = comment?.replies?.pages?.[sortType]?.comments
  // }

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

  // return {replies: repliesAndNotYetPublishedReplies, ...rest}
  return {replies, ...rest}
}

export default useRepliesAndAccountReplies
