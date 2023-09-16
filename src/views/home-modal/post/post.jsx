import utils from '../../../lib/utils'
import {Link} from 'react-router-dom'
import Arrow from '../../../components/icons/arrow'
import styles from './post.module.css'
import PostTools from '../../../components/post-tools'
import {useBlock} from '@plebbit/plebbit-react-hooks'

const PostMedia = ({post}) => {
  const mediaType = utils.getCommentLinkMediaType(post?.link)
  if (!mediaType) {
    return <div className={styles.noMedia}></div>
  }
  if (mediaType === 'image') {
    return (
      <div className={styles.mediaWrapper}>
        <img className={styles.media} src={post?.link} alt="" />
      </div>
    )
  }
  if (mediaType === 'video') {
    return <video className={styles.media} controls={true} autoPlay={false} src={post?.link} />
  }
  if (mediaType === 'audio') {
    return <audio className={styles.media} controls={true} autoPlay={false} src={post?.link} />
  }
  return <div className={styles.noMedia}></div>
}

const Reply = ({reply}) => {
  const replies = reply?.replies?.pages?.topAll?.comments || ''
  return (
    <div className={styles.reply}>
      <div className={styles.replyWrapper}>
        <div className={styles.replyHeader}>
          <span className={styles.replyScore}>{reply?.upvoteCount - reply?.downvoteCount || 0}</span>
          <span className={styles.replyAuthor}> {reply.author.shortAddress}</span>
          <span className={styles.replyTimestamp}> {utils.getFormattedTime(reply?.timestamp)}</span>
        </div>

        <div className={styles.replyContent}>{reply.content}</div>
      </div>
      <div className={styles.replies}>
        {replies?.map?.((reply) => (
          <Reply key={reply?.cid} reply={reply} />
        ))}
      </div>
    </div>
  )
}

function Post({post}) {
  let hostname
  try {
    hostname = new URL(post?.link).hostname.replace(/^www\./, '')
  } catch (e) {}

  const replies = post?.replies?.pages?.topAll?.comments?.map?.((reply) => <Reply key={reply?.cid} reply={reply} />) || ''

  const {blocked: hidden} = useBlock({cid: post?.cid})

  return (
    <div className={styles.post}>
      <div className={styles.textWrapper}>
        <div className={styles.column}>
          <div className={styles.score}>
            <div className={styles.upvote}>
              <Arrow />
            </div>
            <PostTools post={post}>
              <div className={styles.scoreNumber}>{post?.upvoteCount - post?.downvoteCount || 0}</div>
            </PostTools>
            <div className={styles.downvote}>
              <Arrow />
            </div>
          </div>
        </div>
        <div className={[styles.column, hidden && styles.hidden].join(' ')}>
          <div className={styles.header}>
            <Link to={post?.link} target={post?.link ? '_blank' : undefined} rel="noreferrer" className={styles.title}>
              {post?.title || post?.content || '-'}
            </Link>
            {hostname && (
              <Link to={post?.link} target="_blank" rel="noreferrer">
                {' '}
                {hostname}
              </Link>
            )}
          </div>
          <div className={styles.content}>
            <span className={styles.timestamp}>{utils.getFormattedTime(post?.timestamp)}</span>
            <span className={styles.author}> by {post?.author?.shortAddress}</span>
            <span className={styles.subplebbit}> to {post?.subplebbitAddress}</span>
          </div>
          <div className={styles.footer}>
            <span className={[styles.replyCount, styles.button].join(' ')}>{post?.replyCount} comments</span>
            <span className={styles.button}>reply</span>
          </div>
        </div>
      </div>
      <div className={hidden && styles.hidden}>
        <PostMedia post={post} />
      </div>
      <div className={styles.replies}>{replies}</div>
    </div>
  )
}

export default Post
