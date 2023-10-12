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
  const {timeFilter, timeFilterName, setTimeFilter} = useTimeFilter()
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
      {/* TODO: remove inline style, only used as a temporary experiment */}
      <select style={{position: 'fixed', top: -3, left: -1, zIndex: 1}} onChange={(e) => setTimeFilter(sortType, e.target.value)} value={timeFilterName}>
        <option value="1h">1h</option>
        <option value="12h">12h</option>
        <option value="24h">24h</option>
        <option value="48h">48h</option>
        <option value="1w">1w</option>
        <option value="1m">1m</option>
        <option value="1y">1y</option>
        <option value="all">all</option>
      </select>
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
