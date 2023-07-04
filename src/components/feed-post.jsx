import utils from '../utils'
import { Link } from 'react-router-dom'

const FeedPostMedia = ({mediaInfo}) => {
  if (!mediaInfo) {
    return ''
  }
  if (mediaInfo.type === 'image') {
    return <div className='media-wrapper'><img className='media' src={mediaInfo.url} alt='' /></div>
  }
  if (mediaInfo.type === 'video') {
    return <video className='media' controls={true} autoplay={false} src={mediaInfo.url} />
  }
  if (mediaInfo.type === 'audio') {
    return <audio className='media' controls={true} autoplay={false} src={mediaInfo.url} />
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

  const mediaInfo = utils.getCommentMediaInfo(post)

  const internalLink = `/p/${post.subplebbitAddress}/c/${post.cid}`
  const externalLink = !mediaInfo && post?.link

  return <div className={`feed-post ${evenOrOdd}`}>
    <div className='score'>
      {(post?.upvoteCount - post?.downvoteCount) || 0}
    </div>
    <div className='header'>
      <Link to={externalLink || internalLink} target={externalLink ? '_blank' : undefined} className='title'>{post?.title || post?.content || '-'}</Link>
      {hostname && <span className='hostname'>{' '}{hostname}</span>}
    </div>
    <div className='content'>
      <span className='timestamp'>{utils.getFormattedTime(post?.timestamp)}</span>
      <span className='author'> by {post?.author?.shortAddress}</span>
      <span className='subplebbit'> to {post?.subplebbitAddress}</span>
    </div>
    <div className='footer'>
      <Link to={internalLink} className='reply-count'>
        {post?.replyCount} comments
      </Link>
    </div>
    <Link to={internalLink} className='reply-count'>
      <FeedPostMedia mediaInfo={mediaInfo} />
    </Link>
  </div>
}

export default FeedPost
