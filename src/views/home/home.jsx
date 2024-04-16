import {useRef, useEffect, memo} from 'react'
import useDefaultSubplebbitAddresses from '../../hooks/use-default-subplebbit-addresses'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import {Virtuoso} from 'react-virtuoso'
import FeedPost from '../../components/feed-post'
import {useParams} from 'react-router-dom'
import useFeedStateString from '../../hooks/use-feed-state-string'
import useTimeFilter from '../../hooks/use-time-filter'

const lastVirtuosoStates = {}

const NoPosts = () => 'no posts'

// memo feed post so back button loads faster
const FeedPostMemo = memo(({index, post}) => <FeedPost index={index} post={post} />)

function Home() {
  const params = useParams()
  const subplebbitAddresses = useDefaultSubplebbitAddresses()
  const sortType = params?.sortType || 'hot'
  const {timeFilterSeconds} = useTimeFilter()
  const {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType, postsPerPage: 10, newerThan: timeFilterSeconds})
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
          lastVirtuosoStates[sortType + timeFilterSeconds] = snapshot
        }
      })
    window.addEventListener('scroll', setLastVirtuosoState)
    // clean listener on unmount
    return () => window.removeEventListener('scroll', setLastVirtuosoState)
  }, [sortType, timeFilterSeconds])
  const lastVirtuosoState = lastVirtuosoStates?.[sortType + timeFilterSeconds]

  return (
    <div>
      <Virtuoso
        increaseViewportBy={{bottom: 1200, top: 600}}
        totalCount={feed?.length || 0}
        data={feed}
        itemContent={(index, post) => <FeedPostMemo index={index} post={post} />}
        useWindowScroll={true}
        components={{Footer}}
        endReached={loadMore}
        ref={virtuosoRef}
        restoreStateFrom={lastVirtuosoState}
        initialScrollTop={lastVirtuosoState?.scrollTop}
      />
    </div>
  )
}

export default Home
