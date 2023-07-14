import { useMemo, useRef, useEffect } from 'react'
import useDefaultSubplebbits from '../../hooks/use-default-subplebbits'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import { Virtuoso } from 'react-virtuoso'
import BoardPost from '../../components/board-post'
import {useParams} from 'react-router-dom'

const lastVirtuosoStates = {}

function Board() {
  const params = useParams()
  const defaultSubplebbits = useDefaultSubplebbits()
  const subplebbitAddresses = useMemo(() => defaultSubplebbits.map(subplebbit => subplebbit.address), [defaultSubplebbits])
  const sortType = params?.sortType || 'active'
  let {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType})

  let Loading
  if (hasMore) {
    Loading = () => 'Loading...'
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
        style={ { maxWidth: '100%' } }
        itemContent={(index, post) => <BoardPost index={index} post={post} />}
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

export default Board
