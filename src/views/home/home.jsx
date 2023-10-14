import {useRef, useEffect} from 'react'
import useDefaultSubplebbitAddresses from '../../hooks/use-default-subplebbit-addresses'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import {Virtuoso} from 'react-virtuoso'
import FeedPost from '../../components/feed-post'
import {useParams} from 'react-router-dom'
import useFeedStateString from '../../hooks/use-feed-state-string'
import useTimeFilter from '../../hooks/use-time-filter'

const lastVirtuosoStates = {}

const NoPosts = () => 'no posts'

function Home() {
  const params = useParams()
  const subplebbitAddresses = useDefaultSubplebbitAddresses()
  const sortType = params?.sortType || 'hot'
  const timeFilterName = params.timeFilterName
  const {timeFilter} = useTimeFilter(sortType, timeFilterName)
  const {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType, postsPerPage: 10, filter: timeFilter})
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
          lastVirtuosoStates[sortType + timeFilterName] = snapshot
        }
      })
    window.addEventListener('scroll', setLastVirtuosoState)
    // clean listener on unmount
    return () => window.removeEventListener('scroll', setLastVirtuosoState)
  }, [sortType, timeFilterName])
  const lastVirtuosoState = lastVirtuosoStates?.[sortType + timeFilterName]

  return (
    <div>
      <Virtuoso
        increaseViewportBy={{bottom: 600, top: 600}}
        totalCount={feed?.length || 0}
        data={feed}
        itemContent={(index, post) => <FeedPost index={index} post={post} />}
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
