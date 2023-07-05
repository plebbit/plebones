/* this file is an example of using react-virtuoso with restoreStateFrom */

import { useMemo, useRef } from 'react'
import useDefaultSubplebbits from '../hooks/use-default-subplebbits'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import { Virtuoso } from 'react-virtuoso'
import FeedPost from '../components/feed-post'

let lastVirtuosoState

function Home() {
  const defaultSubplebbits = useDefaultSubplebbits()
  const subplebbitAddresses = useMemo(() => defaultSubplebbits.map(subplebbit => subplebbit.address), [defaultSubplebbits])
  const sortType = 'hot'
  let {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType})

  let Loading
  if (hasMore) {
    Loading = () => 'Loading...'
  }

  const virtuosoRef = useRef()
  // TODO: don't use in production like this, 
  // make sure this event is only set once
  window.addEventListener('scroll', () => {
    virtuosoRef.current?.getState((snapshot) => {
      if (snapshot?.ranges?.length) {
        lastVirtuosoState = snapshot
      }
    })
  })

  return (
    <div className="home">
      Home

      <Virtuoso
        increaseViewportBy={ { bottom: 600, top: 600 } }
        totalCount={ feed?.length || 0 }
        data={ feed }
        style={ { maxWidth: '100%' } }
        itemContent={(index, post) => <FeedPost index={index} post={post} />}
        useWindowScroll={ true }
        components={ {Footer: Loading } }
        endReached={ loadMore }
        ref={virtuosoRef}
        restoreStateFrom={lastVirtuosoState}
        initialScrollTop={lastVirtuosoState?.scrollTop}
      />

    </div>
  )
}

export default Home
