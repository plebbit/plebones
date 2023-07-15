import {useComment} from '@plebbit/plebbit-react-hooks'
import utils from '../../lib/utils'
import { useParams } from 'react-router-dom'
import {useEffect} from 'react'
import { Link } from 'react-router-dom'
import styles from './post.module.css'

const PostMedia = ({post}) => {
  const mediaInfo = utils.getCommentMediaInfo(post)
  if (!mediaInfo) {
    return <div className={styles.noMedia}></div>
  }
  if (mediaInfo.type === 'image') {
    return <div className={styles.mediaWrapper}><img className={styles.media} src={mediaInfo.url} alt='' /></div>
  }
  if (mediaInfo.type === 'video') {
    return <video className={styles.media} controls={true} autoplay={false} src={mediaInfo.url} />
  }
  if (mediaInfo.type === 'audio') {
    return <audio className={styles.media} controls={true} autoplay={false} src={mediaInfo.url} />
  }
  return <div className={styles.noMedia}></div>
}

const Reply = ({reply}) => {
  const replies = reply?.replies?.pages?.topAll?.comments || ''
  return (
    <div className={styles.reply}>
      <div className={styles.replyHeaderWrapper}>
        <div className={styles.replyScore}>
          <div className={styles.replyUpvote}>⇧</div>
          {(reply?.upvoteCount - reply?.downvoteCount) || 0}
          <div className={styles.replyDownvote}>⇧</div>
        </div>
        <div className={styles.replyHeader}>
          <span className={styles.replyAuthor}>{reply.author.shortAddress}</span>
          <span className={styles.replyTimestamp}> {utils.getFormattedTime(reply?.timestamp)}</span>
        </div>
      </div>

      <div className={styles.replyContent}>{reply.content}</div>
      <div className={styles.replies}>
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
    hostname = new URL(post?.link).hostname.replace(/^www\./, '')
  }
  catch (e) {}

  const replies = post?.replies?.pages?.topAll?.comments?.map?.(reply => <Reply key={reply?.cid} reply={reply}/>) || ''

  // scroll to top on first load
  useEffect(() => window.scrollTo(0,0), [])

  return (
    <div className={styles.post}>
      <div className={styles.textWrapper}>
        <div className={styles.column}>
          <div className={styles.score}>
            <div className={styles.upvote}>⇧</div>
            <div className={styles.scoreNumber}>
              {(post?.upvoteCount - post?.downvoteCount) || 0}
            </div>
            <div className={styles.downvote}>⇧</div>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.header}>
            <Link to={post?.link} target={post?.link ? '_blank' : undefined} className={styles.title}>{post?.title || post?.content || '-'}</Link>
            {hostname && <span className={styles.hostname}>{' '}{hostname}</span>}
          </div>
          <div className={styles.content}>
            <span className={styles.timestamp}>{utils.getFormattedTime(post?.timestamp)}</span>
            <span className={styles.author}> by {post?.author?.shortAddress}</span>
            <span className={styles.subplebbit}> to {post?.subplebbitAddress}</span>
          </div>
          <div className={styles.footer}>
            <span className={styles.replyCount}>{post?.replyCount} comments</span>
          </div>
        </div>
      </div>
      <PostMedia post={post} />
      <div className={styles.replies}>
        {replies}
      </div>
    </div>
  )
}

export default Post