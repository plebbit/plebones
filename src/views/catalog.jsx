import { useMemo, useRef, useEffect } from 'react'
import useDefaultSubplebbits from '../hooks/use-default-subplebbits'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import { Virtuoso } from 'react-virtuoso'
import useWindowWidth from '../hooks/use-window-width'
import {useParams, Link} from 'react-router-dom'
import utils from '../utils'

const CatalogPostMedia = ({post}) => {
  const mediaInfo = utils.getCommentMediaInfo(post)
  if (!mediaInfo) {
    return <div className='no-media'></div>
  }
  if (mediaInfo.type === 'image') {
    return <div className='media-wrapper'><img className='media' src={mediaInfo.url} alt='' /></div>
  }
  return <div className='no-media'></div>
}

const CatalogPost = ({post}) => {
  const internalLink = `/p/${post.subplebbitAddress}/c/${post.cid}`

  let title = post.title || ''
  if (title) {
    title += ': '
  }
  title += (post.content || '')
  title = title.replace(/\n/g, '').substring(0, 100) || '-'

  const stats = `R: ${post?.replyCount} / S: ${(post?.upvoteCount - post?.downvoteCount) || 0}`

  return <div className='catalog-post'>
    <div className='stats'>{stats}</div>
    <div className='title'>
      <Link to={internalLink}>{title}</Link>
    </div>
    <div>
      <Link to={internalLink}>
        <CatalogPostMedia post={post} />
      </Link>
    </div>
  </div>
}

const CatalogRow = ({row}) => {
  const posts = []
  for (const post of row) {
    posts.push(<CatalogPost key={post?.cid} post={post} />)
  }
  return <div className='catalog-row'>{posts}</div>
}

const lastVirtuosoStates = {}

// column width in px
const columnWidth = 180

function Catalog() {
  const windowWidth = useWindowWidth()
  const columnCount = Math.floor(windowWidth / columnWidth)
  const params = useParams()
  const defaultSubplebbits = useDefaultSubplebbits()
  const subplebbitAddresses = useMemo(() => defaultSubplebbits.map(subplebbit => subplebbit.address), [defaultSubplebbits])
  const sortType = params?.sortType || 'hot'
  let {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType})

  // split feed into rows
  const rows = useMemo(() => {
    const rows = []
    for (let i = 0; i < feed.length; i += columnCount) {
      rows.push(feed.slice(i, i + columnCount))
    }
    return rows
  }, [feed, columnCount])

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
    // TODO: doesn't work if the user hasn't scrolled
    window.addEventListener('scroll', setLastVirtuosoState)
    // clean listener on unmount
    return () => window.removeEventListener('scroll', setLastVirtuosoState)
  }, [sortType])
  const lastVirtuosoState = lastVirtuosoStates?.[sortType]

  return (
    <div className="home">
      <Virtuoso
        increaseViewportBy={ { bottom: 600, top: 600 } }
        totalCount={ rows?.length || 0 }
        data={ rows }
        style={ { maxWidth: '100%' } }
        itemContent={(index, row) => <CatalogRow index={index} row={row} />}
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

export default Catalog
