import {useComment} from '@plebbit/plebbit-react-hooks'
import utils from '../utils'
import { useParams } from 'react-router-dom'

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

const Reply = ({reply}) => {
  const replies = reply?.replies?.pages?.topAll?.comments || ''
  return (
    <div className='reply'>
      <div className='score'>
        {(reply?.upvoteCount - reply?.downvoteCount) || 0}
      </div>
      <div className='header'>{reply.author.shortAddress} {utils.getFormattedTime(reply?.timestamp)}</div>
      <div className='content'>{reply.content}</div>
      <div className='replies'>
        {replies?.map?.(reply => <Reply reply={reply}/>)}
      </div>
    </div>
  )
}

function Post() {
  const {commentCid} = useParams()
  const post = useComment({commentCid})

  let hostname
  try {
    hostname = new URL(post?.link).hostname
  }
  catch (e) {}

  console.log(post)
  const replies = post?.replies?.pages?.topAll?.comments?.map?.(reply => <Reply reply={reply}/>) || ''

  return (
    <div className="post">
      Post

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
        <span className='reply-count'>{post?.replyCount} comments</span>
      </div>
      <FeedPostMedia post={post} />
      {replies}
    </div>
  )
}

export default Post
