import createStore from 'zustand'
import localForageLru from '@plebbit/plebbit-react-hooks/dist/lib/localforage-lru'
import assert from 'assert'

const readReplyCountsDb = localForageLru.createInstance({name: `plebonesReadReplyCounts`, size: 2000})

const useReadReplyCountsStore = createStore((setState, getState) => ({
  readReplyCounts: {},
  setReadReplyCount: (commentCid, readReplyCount) => {
    setState((state) => ({
      readReplyCounts: {...state.readReplyCounts, [commentCid]: readReplyCount},
    }))
    readReplyCountsDb.setItem(commentCid, readReplyCount)
  },
}))

// load reply counts from database once on load
const initializeReadReplyCountsStore = async () => {
  const readReplyCountsEntries = await readReplyCountsDb.entries()
  const readReplyCounts = {}
  readReplyCountsEntries.forEach(([commentCid, readReplyCount]) => {
    readReplyCounts[commentCid] = readReplyCount
  })

  useReadReplyCountsStore.setState((state) => {
    // TODO: remove debug readReplyCounts
    console.log({readReplyCounts, stateReadReplyCounts: state.readReplyCounts})
    return {readReplyCounts: {...readReplyCounts, ...state.readReplyCounts}}
  })
}
initializeReadReplyCountsStore()

const useUnreadReplyCount = (post) => {
  const readReplyCount = useReadReplyCountsStore((state) => state.readReplyCounts[post?.cid?.substring(2, 14)])
  const setReadReplyCount = useReadReplyCountsStore((state) => state.setReadReplyCount)
  const setRepliesToRead = () => {
    if (post?.cid && typeof post?.replyCount === 'number') {
      // don't set if readReplyCount is defined and bigger or equal, could happen if post.replyCount is outdated
      if (typeof readReplyCount === 'number' && readReplyCount >= post?.replyCount) {
        return
      }
      // don't set readReplyCount if comment is a reply
      if (post?.parentCid) {
        return
      }
      setReadReplyCount(post.cid.substring(2, 14), post.replyCount)
    }
  }
  let unreadReplyCount
  if (typeof post?.replyCount === 'number' && typeof readReplyCount === 'number') {
    unreadReplyCount = post.replyCount - readReplyCount

    // can be smaller than 0 in a feed post that hasn't yet updated
    if (unreadReplyCount < 0) {
      unreadReplyCount = 0
    }
  }
  return [unreadReplyCount, setRepliesToRead]
}

export const incrementReadReplyCount = (commentCid) => {
  assert(commentCid, `readReplyCountsStore.incrementReadReplyCount invalid commentCid argument '${commentCid}'`)
  commentCid = commentCid?.substring(2, 14)
  let nextCount
  useReadReplyCountsStore.setState((state) => {
    nextCount = (state.readReplyCounts[commentCid] || 0) + 1
    return {readReplyCounts: {...state.readReplyCounts, [commentCid]: nextCount}}
  })
  readReplyCountsDb.setItem(commentCid, nextCount)
}

export default useUnreadReplyCount
