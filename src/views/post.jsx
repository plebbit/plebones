import {useComment} from '@plebbit/plebbit-react-hooks'
import utils from '../utils'
import { useParams } from 'react-router-dom'
import {useEffect} from 'react'
import { Link } from 'react-router-dom'

const FeedPostMedia = ({post}) => {
  const mediaInfo = utils.getCommentMediaInfo(post)
  if (!mediaInfo) {
    return <div className='no-media'></div>
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
  return <div className='no-media'></div>
}

const Reply = ({reply}) => {
  const replies = reply?.replies?.pages?.topAll?.comments || ''
  return (
    <div className='reply'>
      <div className='header-wrapper'>
        <div className='score'>
          <div className='upvote'>⯅</div>
          {(reply?.upvoteCount - reply?.downvoteCount) || 0}
          <div className='downvote'>⯆</div>
        </div>
        <div className='header'>
          <span className='author-address'>{reply.author.shortAddress}</span>
          <span className='timestamp'> {utils.getFormattedTime(reply?.timestamp)}</span>
        </div>
      </div>

      <div className='content'>{reply.content}</div>
      <div className='replies'>
        {replies?.map?.(reply => <Reply key={reply?.cid} reply={reply}/>)}
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

  const replies = post?.replies?.pages?.topAll?.comments?.map?.(reply => <Reply key={reply?.cid} reply={reply}/>) || ''

  // scroll to top on first load
  useEffect(() => window.scrollTo(0,0), [])

  return (
    <div className="post">
      <div className='text-wrapper'>
        <div className='column'>
          <div className='score'>
            <div className='upvote'>⯅</div>
            <div className='number'>
              {(post?.upvoteCount - post?.downvoteCount) || 0}
            </div>
            <div className='downvote'>⯆</div>
          </div>
        </div>
        <div className='column'>
          <div className='header'>
            <Link to={post?.link} target={post?.link ? '_blank' : undefined} className='title'>{post?.title || post?.content || '-'}</Link>
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
        </div>
      </div>
      <FeedPostMedia post={post} />
      <div className='replies'>
        {replies}
      </div>
    </div>
  )
}

export default Post
