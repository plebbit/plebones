import { useRef, useEffect } from 'react'
import {useFeed, useAccount} from '@plebbit/plebbit-react-hooks'
import { Virtuoso } from 'react-virtuoso'
import FeedPost from '../../components/feed-post'
import {useParams} from 'react-router-dom'

const lastVirtuosoStates = {}

const Loading = () => 'loading...'
const NoSubscriptions = () => 'no subscriptions'

function Subscriptions() {
  const params = useParams()
  const account = useAccount()
  const subplebbitAddresses = account?.subscriptions
  const sortType = params?.sortType || 'hot'
  const {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType, postsPerPage: 10})

  let Footer
  if (hasMore) {
    Footer = Loading
  }
  if (subplebbitAddresses?.length === 0) {
    Footer = NoSubscriptions
  }

  // save last virtuoso state on each scroll
  const virtuosoRef = useRef()
  useEffect(() => {
    const setLastVirtuosoState = () => virtuosoRef.current?.getState((snapshot) => {
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
      <Virtuoso
        increaseViewportBy={ { bottom: 600, top: 600 } }
        totalCount={ feed?.length || 0 }
        data={ feed }
        itemContent={(index, post) => <FeedPost index={index} post={post} />}
        useWindowScroll={ true }
        components={ {Footer} }
        endReached={ loadMore }
        ref={virtuosoRef}
        restoreStateFrom={lastVirtuosoState}
        initialScrollTop={lastVirtuosoState?.scrollTop}
      />

    </div>
  )
}

export default Subscriptions
