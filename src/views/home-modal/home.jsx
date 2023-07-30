import { useMemo, useRef, useEffect } from 'react'
import useDefaultSubplebbits from '../../hooks/use-default-subplebbits'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import { Virtuoso } from 'react-virtuoso'
import FeedPost from './feed-post'
import {useParams, useLocation} from 'react-router-dom'
import PostModal from './post-modal'
 
const lastVirtuosoStates = {}

function Home() {
  const params = useParams()
  // dont load the feed if the user loads the post page directly
  const isFirstLocationAndIsPost = useLocation().key === 'default' && params.commentCid
  const defaultSubplebbits = useDefaultSubplebbits()
  const subplebbitAddresses = useMemo(() => defaultSubplebbits.map(subplebbit => subplebbit.address), [defaultSubplebbits])
  const sortType = params?.sortType || 'hot'
  let {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType})

  let Loading
  if (hasMore) {
    Loading = () => 'loading...'
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
      <PostModal />
      {!isFirstLocationAndIsPost && <Virtuoso
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
      />}
    </div>
  )
}

export default Home
