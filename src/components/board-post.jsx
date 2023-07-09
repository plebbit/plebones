import utils from '../utils'
import { Link } from 'react-router-dom'
import { flattenCommentsPages } from '@plebbit/plebbit-react-hooks/dist/lib/utils'
import {useMemo} from 'react'

const BoardPostMedia = ({mediaInfo}) => {
  if (!mediaInfo) {
    return <div className='no-media'></div>
  }
  if (mediaInfo.type === 'image') {
    return <div className='media-wrapper'><img className='media' src={mediaInfo.url} alt='' /></div>
  }
  if (mediaInfo.type === 'video') {
    return <div className='media-wrapper'><video className='media' controls={true} autoplay={false} src={mediaInfo.url} /></div>
  }
  return <div className='no-media'></div>
}

const Reply = ({reply}) => {
  return (
    <div className='reply'>
      <div className='header-wrapper'>
        <div className='header'>
          <span className='author-address'>{reply.author.shortAddress}</span>
          <span className='timestamp'> {utils.getFormattedTime(reply?.timestamp)}</span>
        </div>
      </div>

      <div className='content'>{reply.content}</div>
    </div>
  )
}

const BoardPost = ({post, index}) => {
  const evenOrOdd = index % 2 === 0 ? 'even' : 'odd'

  const mediaInfo = utils.getCommentMediaInfo(post)

  const internalLink = `/p/${post.subplebbitAddress}/c/${post.cid}`
  const externalLink = !mediaInfo && post?.link && <Link to={post?.link}>{post?.link}</Link>

  const replies = useMemo(() => flattenCommentsPages(post.replies).splice(0, 5).map(reply => <Reply reply={reply}/>), [post.replies])

  return <div className={`board-post ${evenOrOdd}`}>
    <Link to={internalLink}>
      <BoardPostMedia mediaInfo={mediaInfo} />
    </Link>
    <div className='text-wrapper'>
      <div className='header'>
        <Link to={internalLink} className='title'>{post?.title || '-'}</Link>
        <span className='timestamp'> {utils.getFormattedTime(post?.timestamp)}</span>
        <span className='author'> by {post?.author?.shortAddress}</span>
        <span className='subplebbit'> to {post?.subplebbitAddress}</span>
      </div>
      <div className='content'>
        {externalLink}
        <Link to={internalLink} className='content'>{post?.content || ''}</Link>
      </div>
      <div className='footer'>
        <Link to={internalLink} className='reply-count'>
          {post?.replyCount} comments
        </Link>
      </div>
    </div>
    {replies}
  </div>
}

export default BoardPost
