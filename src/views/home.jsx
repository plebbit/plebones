import { useMemo, useRef } from 'react'
import useDefaultSubplebbits from '../hooks/use-default-subplebbits'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import { Virtuoso } from 'react-virtuoso'
import utils from '../utils'
import { Link } from 'react-router-dom'

const FeedPostMedia = ({post}) => {
  const mediaInfo = utils.getCommentMediaInfo(post)
  if (!mediaInfo) {
    return ''
  }
  if (mediaInfo.type === 'image') {
    return <div className='media-wrapper'><img className='media' src={mediaInfo.url} alt='' /></div>
  }
  if (mediaInfo.type === 'video') {
    return <video className='media' src={mediaInfo.url} />
  }
  if (mediaInfo.type === 'audio') {
    return <audio className='media' src={mediaInfo.url} />
  }
  return ''
}

const FeedPost = ({post, index}) => {
  const evenOrOdd = index % 2 === 0 ? 'even' : 'odd'
  let hostname
  try {
    hostname = new URL(post?.link).hostname
  }
  catch (e) {}

  const href = `/p/${post.subplebbitAddress}/c/${post.cid}`

  return <div className={`feed-post ${evenOrOdd}`}>
    <div className='score'>
      {(post?.upvoteCount - post?.downvoteCount) || 0}
    </div>
    <div className='header'>
      <span className='title'>{post?.title || post?.content || '-'}</span>
      {hostname && <span className='hostname'>{' '}{hostname}</span>}
    </div>
    <div className='content'>
      <span className='timestamp'>{utils.getFormattedTime(post?.timestamp)}</span>
      <span className='author'> by {post?.author?.shortAddress}</span>
      <span className='subplebbit'> to {post?.subplebbitAddress}</span>
    </div>
    <div className='footer'>
      <Link to={href} className='reply-count'>
        {post?.replyCount} comments
      </Link>
    </div>
    <FeedPostMedia post={post} />
  </div>
}

let lastVirtuosoState

function Home() {
  const defaultSubplebbits = useDefaultSubplebbits()
  const subplebbitAddresses = useMemo(() => defaultSubplebbits.map(subplebbit => subplebbit.address), [defaultSubplebbits])
  const sortType = 'hot'
  const {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType})

  let Loading
  if (hasMore) {
    Loading = () => 'Loading...'
  }

  const virtuosoRef = useRef()
  // TODO: make sure this event is only set once
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
        // initialTopMostItemIndex={lastVirtuosoState?.ranges?.length - 1 || 0}
        // rangeChanged={onRangeChanged}
      />

    </div>
  )
}

export default Home
