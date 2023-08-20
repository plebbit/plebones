import { useMemo, useRef, useEffect } from 'react'
import useDefaultSubplebbitAddresses from '../../hooks/use-default-subplebbit-addresses'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import { Virtuoso } from 'react-virtuoso'
import useWindowWidth from '../../hooks/use-window-width'
import {useParams} from 'react-router-dom'
import utils from '../../lib/utils'
import CatalogRow from '../../components/catalog-row'

const useFeedRows = (feed, columnCount) => {
  const rowsRef = useRef()
  return useMemo(() => {
    const rows = []
    for (let i = 0; i < feed.length; i += columnCount) {
      // if previous rows have the row, use the previous row so it uses the same array and avoids rerenders
      if (rowsRef.current?.[rows.length] && rowsRef.current[rows.length].length === columnCount) {
        rows.push(rowsRef.current[rows.length])
      }
      else {
        rows.push(feed.slice(i, i + columnCount))
      }
    }
    // save ref to get access to the previous rows next render
    rowsRef.current = rows
    return rows
  }, [feed, columnCount])
}

const lastVirtuosoStates = {}

// column width in px
const columnWidth = 180

const Loading = () => 'loading...'

function Catalog() {
  const windowWidth = useWindowWidth()
  const columnCount = Math.floor(windowWidth / columnWidth)
  const params = useParams()
  const subplebbitAddresses = useDefaultSubplebbitAddresses()
  const sortType = params?.sortType || 'active'
  // because we filter non images after, 50 posts per page makes it less likely to stall
  // virtuoso can stall is loadMore is called and no new posts are added (because they are filtered)
  // TODO: implement useFeed({filter: Function}) in plebbit-react-hooks
  const {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType, postsPerPage: 50})

  // filter non images
  const imageOnlyFeed = useMemo(() => feed.filter(post => {
    const mediaType = utils.getCommentLinkMediaType(post?.link)
    return mediaType === 'image' || mediaType === 'video'
  }), [feed])

  // split feed into rows
  const rows = useFeedRows(imageOnlyFeed, columnCount)

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
    // TODO: doesn't work if the user hasn't scrolled
    window.addEventListener('scroll', setLastVirtuosoState)
    // clean listener on unmount
    return () => window.removeEventListener('scroll', setLastVirtuosoState)
  }, [sortType])
  const lastVirtuosoState = lastVirtuosoStates?.[sortType]

  return (
    <div>
      <Virtuoso
        increaseViewportBy={ { bottom: 600, top: 600 } }
        totalCount={ rows?.length || 0 }
        data={ rows }
        style={ { maxWidth: '100%' } }
        itemContent={(index, row) => <CatalogRow index={index} row={row} />}
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

export default Catalog
