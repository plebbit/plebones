import {useRef, useEffect } from 'react'
import useDefaultSubplebbitAddresses from '../../hooks/use-default-subplebbit-addresses'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import { Virtuoso } from 'react-virtuoso'
import TextOnlyPost from '../../components/text-only-post'
import {useParams} from 'react-router-dom'

const lastVirtuosoStates = {}

const Loading = () => 'loading...'

function TextOnly() {
  const params = useParams()
  const subplebbitAddresses = useDefaultSubplebbitAddresses()
  const sortType = params?.sortType || 'hot'
  const {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType})

  const Footer = hasMore ? Loading : undefined

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
        itemContent={(index, post) => <TextOnlyPost index={index} post={post} />}
        useWindowScroll={ true }
        components={ {Footer} }
        endReached={ loadMore }
        ref={virtuosoRef}
        restoreStateFrom={lastVirtuosoState}
        initialScrollTop={lastVirtuosoState?.scrollTop}
        defaultItemHeight={42}
        fixedItemHeight={42}
      />

    </div>
  )
}

export default TextOnly
