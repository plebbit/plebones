import utils from '../../../lib/utils'
import {Link} from 'react-router-dom'
import styles from './feed-post.module.css'
import Arrow from '../../../components/icons/arrow'
import PostTools from '../../../components/post-tools'
import {useBlock} from '@plebbit/plebbit-react-hooks'

const FeedPostMedia = ({mediaType, mediaUrl}) => {
  if (!mediaType) {
    return <div className={styles.noMedia}></div>
  }
  if (mediaType === 'image') {
    return (
      <div className={styles.mediaWrapper}>
        <img className={styles.media} src={mediaUrl} alt="" />
      </div>
    )
  }
  if (mediaType === 'video') {
    return (
      <div className={styles.mediaWrapper}>
        <video className={styles.media} controls={true} autoPlay={false} src={mediaUrl} />
      </div>
    )
  }
  if (mediaType === 'audio') {
    return <audio className={styles.media} controls={true} autoPlay={false} src={mediaUrl} />
  }
  return <div className={styles.noMedia}></div>
}

const FeedPost = ({post, index}) => {
  let hostname
  try {
    hostname = new URL(post?.link).hostname.replace(/^www\./, '')
  } catch (e) {}

  const mediaType = utils.getCommentMediaType(post)

  const internalLink = `/css-switch/p/${post?.subplebbitAddress}/c/${post?.cid}`

  const {blocked: hidden} = useBlock({cid: post?.cid})

  return (
    <div className={styles.feedPost}>
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
            <Link to={internalLink} className={styles.title}>
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
            <span className={styles.subplebbit}> to {post?.shortSubplebbitAddress}</span>
          </div>
          <div className={styles.footer}>
            <Link to={internalLink} className={[styles.button, styles.replyCount].join(' ')}>
              {post?.replyCount} comments
            </Link>
          </div>
        </div>
      </div>
      <Link className={hidden && styles.hidden} to={internalLink}>
        <FeedPostMedia mediaType={mediaType} mediaUrl={post?.link} />
      </Link>
    </div>
  )
}

export default FeedPost
