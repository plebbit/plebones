import { useMemo, useRef, useEffect } from 'react'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import { Virtuoso } from 'react-virtuoso'
import useWindowWidth from '../../hooks/use-window-width'
import {useParams, Link} from 'react-router-dom'
import utils from '../../lib/utils'
import styles from './subplebbit-catalog.module.css'
import useUnreadReplyCount from '../../hooks/use-unread-reply-count'
import PostTools from '../../components/post-tools'

const CatalogPostMedia = ({post}) => {
  const mediaType = utils.getCommentLinkMediaType(post?.link)
  if (!mediaType) {
    return <div className={styles.noMedia}></div>
  }
  if (mediaType === 'image') {
    return <div className={styles.mediaWrapper}><img className={styles.media} src={post?.link} alt='' /></div>
  }
  if (mediaType === 'video') {
    return <div className={styles.mediaWrapper}><video className={styles.media} controls={true} autoPlay={false} src={post?.link} /></div>
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

  const [unreadReplyCount] = useUnreadReplyCount(post)
  const unreadReplyCountText = typeof unreadReplyCount === 'number' ? `+${unreadReplyCount}` : ''

  // TODO: count images in replies as R: ${replyCount} / I: ${imageCount}
  const stats = `R: ${post?.replyCount}`

  return <div className={styles.post}>
    <PostTools post={post}>
      <div className={styles.postHeader}>
        <span className={styles.postStats}>{stats}</span>
        <span className={styles.unreadReplyCount}>{unreadReplyCountText}</span>
      </div>
    </PostTools>
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

function Catalog() {
  const windowWidth = useWindowWidth()
  const columnCount = Math.floor(windowWidth / columnWidth)
  const params = useParams()
  const subplebbitAddress = params.subplebbitAddress
  const subplebbitAddresses = useMemo(() => [subplebbitAddress], [subplebbitAddress])
  const sortType = params?.sortType || 'active'
  let {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType})

  // split feed into rows
  const rows = useFeedRows(feed, columnCount)

  let Loading
  if (hasMore) {
    Loading = () => 'loading...'
  }
  if (subplebbitAddresses?.length === 0) {
    Loading = () => 'no subscriptions'
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
