import createStore from 'zustand'
import localForageLru from '@plebbit/plebbit-react-hooks/dist/lib/localforage-lru'

const readReplyCountsDb = localForageLru.createInstance({name: `plebonesReadReplyCounts`, size: 1000})

const useReadReplyCountsStore = createStore((setState, getState) => ({
  readReplyCounts: {},
  setReadReplyCount: (commentCid, readReplyCount) => {
    setState(state => ({
      readReplyCounts: {...state.readReplyCounts, [commentCid]: readReplyCount}
    }))
    readReplyCountsDb.setItem(commentCid, readReplyCount)
  }
}))

// load reply counts from database once on load
const initializeReadReplyCountsStore = async () => {
  const commentCids = await readReplyCountsDb.keys()
  const readReplyCounts = {} 
  await Promise.all(commentCids.map(commentCid => readReplyCountsDb.getItem(commentCid).then(readReplyCount => {
    readReplyCounts[commentCid] = readReplyCount
  })))
  useReadReplyCountsStore.setState(state => ({
    readReplyCounts: {...readReplyCounts, ...state.readReplyCounts}
  }))
}
initializeReadReplyCountsStore()

const useUnreadReplyCount = (post) => {
  const readReplyCount = useReadReplyCountsStore(state => state.readReplyCounts[post?.cid])
  const setReadReplyCount = useReadReplyCountsStore(state => state.setReadReplyCount)
  const setRepliesToRead = () => {
    if (post?.cid && post?.replyCount) {
      setReadReplyCount(post.cid, post.replyCount)
    }
  }
  let unreadReplyCount
  if (post?.replyCount > 0 && typeof readReplyCount === 'number') {
    unreadReplyCount = post.replyCount - readReplyCount
  }
  return [unreadReplyCount, setRepliesToRead]
}

export default useUnreadReplyCount
