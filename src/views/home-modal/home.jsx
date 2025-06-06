import {useRef, useEffect} from 'react'
import useDefaultSubplebbitAddresses from '../../hooks/use-default-subplebbit-addresses'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import {Virtuoso} from 'react-virtuoso'
import FeedPost from './feed-post'
import {useParams, useLocation} from 'react-router-dom'
import PostModal from './post-modal'
import useFeedStateString from '../../hooks/use-feed-state-string'

const lastVirtuosoStates = {}

const NoPosts = () => 'no posts'

function Home() {
  const params = useParams()
  // dont load the feed if the user loads the post page directly
  const isFirstLocationAndIsPost = useLocation().key === 'default' && params.commentCid
  const subplebbitAddresses = useDefaultSubplebbitAddresses()
  const sortType = params?.sortType || 'hot'
  const {feed, updatedFeed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType})
  const loadingStateString = useFeedStateString(subplebbitAddresses) || 'loading...'

  let Footer
  if (feed?.length === 0) {
    Footer = NoPosts
  }
  if (hasMore || subplebbitAddresses.length === 0) {
    Footer = () => loadingStateString
  }

  // save last virtuoso state on each scroll
  const virtuosoRef = useRef()
  useEffect(() => {
    const setLastVirtuosoState = () =>
      virtuosoRef.current?.getState((snapshot) => {
        // TODO: not sure if checking for empty snapshot.ranges works for all scenarios
        if (snapshot?.ranges?.length) {
          lastVirtuosoStates[sortType] = snapshot
        }
      })
    window.addEventListener('scroll', setLastVirtuosoState)
    // clean listener on unmount
    return () => window.removeEventListener('scroll', setLastVirtuosoState)
  }, [sortType])
  const lastVirtuosoState = lastVirtuosoStates?.[sortType]

  return (
    <div>
      <PostModal />
      {!isFirstLocationAndIsPost && (
        <Virtuoso
          increaseViewportBy={{bottom: 1200, top: 600}}
          totalCount={feed?.length || 0}
          data={feed}
          itemContent={(index, post) => <FeedPost index={index} post={post} updatedPost={updatedFeed[index]} />}
          useWindowScroll={true}
          components={{Footer}}
          endReached={loadMore}
          ref={virtuosoRef}
          restoreStateFrom={lastVirtuosoState}
          initialScrollTop={lastVirtuosoState?.scrollTop}
        />
      )}
    </div>
  )
}

export default Home
