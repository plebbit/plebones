import {useMemo, useRef, useEffect} from 'react'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import {Virtuoso} from 'react-virtuoso'
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
      } else {
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
const NoSubscriptions = () => 'no subscriptions'
const NoPosts = () => 'no image posts'

function Catalog() {
  const windowWidth = useWindowWidth()
  const columnCount = Math.floor(windowWidth / columnWidth)
  const params = useParams()
  const subplebbitAddress = params.subplebbitAddress
  const subplebbitAddresses = useMemo(() => [subplebbitAddress], [subplebbitAddress])
  const sortType = params?.sortType || 'active'
  const {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType, postsPerPage: 20, filter: utils.catalogFilter})

  // split feed into rows
  const rows = useFeedRows(feed, columnCount)

  let Footer
  if (feed?.length === 0) {
    Footer = NoPosts
  }
  if (subplebbitAddresses?.length === 0) {
    Footer = NoSubscriptions
  }
  if (hasMore) {
    Footer = Loading
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
    // TODO: doesn't work if the user hasn't scrolled
    window.addEventListener('scroll', setLastVirtuosoState)
    // clean listener on unmount
    return () => window.removeEventListener('scroll', setLastVirtuosoState)
  }, [sortType])
  const lastVirtuosoState = lastVirtuosoStates?.[sortType]

  return (
    <div>
      <Virtuoso
        increaseViewportBy={{bottom: 600, top: 600}}
        totalCount={rows?.length || 0}
        data={rows}
        itemContent={(index, row) => <CatalogRow index={index} row={row} />}
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

export default Catalog
