import { useMemo, useRef, useEffect } from 'react'
import useDefaultSubplebbits from '../../hooks/use-default-subplebbits'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import { Virtuoso } from 'react-virtuoso'
import useWindowWidth from '../../hooks/use-window-width'
import {useParams, Link} from 'react-router-dom'
import utils from '../../lib/utils'
import styles from './catalog.module.css'

const CatalogPostMedia = ({post}) => {
  const mediaInfo = utils.getCommentMediaInfo(post)
  if (!mediaInfo) {
    return <div className={styles.noMedia}></div>
  }
  if (mediaInfo.type === 'image') {
    return <div className={styles.mediaWrapper}><img className={styles.media} src={mediaInfo.url} alt='' /></div>
  }
  return <div className={styles.noMedia}></div>
}

const CatalogPost = ({post}) => {
  const internalLink = `/p/${post.subplebbitAddress}/c/${post.cid}`

  let title = post.title || ''
  const content = post.content || ''
  if (title && content) {
    title += ': '
  }
  title += content
  title = title.replace(/\n/g, '').substring(0, 100) || '-'

  // TODO: count images in replies as R: ${replyCount} / I: ${imageCount}
  const stats = `R: ${post?.replyCount}`

  return <div className={styles.post}>
    <div className={styles.postHeader}>
      <span className={styles.postStats}>{stats}</span>
    </div>
    <div className={styles.postTitle}>
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
  return <div className={styles.row}>{posts}</div>
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
  const sortType = params?.sortType || 'active'
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
    <div>
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
