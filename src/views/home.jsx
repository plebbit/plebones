import { useMemo } from 'react'
import useDefaultSubplebbits from '../hooks/use-default-subplebbits'
import {useFeed} from '@plebbit/plebbit-react-hooks'
import { Virtuoso } from 'react-virtuoso'
import utils from '../utils'

const FeedPostMedia = ({post}) => {
  const mediaInfo = utils.getCommentMediaInfo(post)
  if (!mediaInfo) {
    return ''
  }
  if (mediaInfo.type === 'image') {
    return <div className='media-wrapper'><img className='media' src={mediaInfo.url} /></div>
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
  console.log(post)
  const evenOrOdd = index % 2 === 0 ? 'even' : 'odd'
  let hostname
  try {
    hostname = new URL(post?.link).hostname
  }
  catch (e) {}

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
      <span className='replies'>{post?.replyCount} comments</span>
    </div>
    <FeedPostMedia post={post} />
  </div>
}

function Home() {
  const defaultSubplebbits = useDefaultSubplebbits()
  const subplebbitAddresses = useMemo(() => defaultSubplebbits.map(subplebbit => subplebbit.address), [defaultSubplebbits])
  const sortType = 'hot'
  const {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType})
  console.log({defaultSubplebbits, feed, hasMore})

  let Loading
  if (hasMore) {
    Loading = () => 'Loading...'
  }

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
      />

    </div>
  )
}

export default Home
