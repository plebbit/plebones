import utils from '../../lib/utils'
import { Link } from 'react-router-dom'
import styles from './feed-post.module.css'
import Arrow from '../arrow'

const FeedPostMedia = ({mediaInfo}) => {
  if (!mediaInfo) {
    return <div className={styles.noMedia}></div>
  }
  if (mediaInfo.type === 'image') {
    return <div className={styles.mediaWrapper}><img className={styles.media} src={mediaInfo.url} alt='' /></div>
  }
  if (mediaInfo.type === 'video') {
    return <div className={styles.mediaWrapper}><video className={styles.media} controls={true} autoplay={false} src={mediaInfo.url} /></div>
  }
  if (mediaInfo.type === 'audio') {
    return <audio className={styles.media} controls={true} autoplay={false} src={mediaInfo.url} />
  }
  return <div className={styles.noMedia}></div>
}

const FeedPost = ({post, index}) => {
  let hostname
  try {
    hostname = new URL(post?.link).hostname.replace(/^www\./, '')
  }
  catch (e) {}

  const mediaInfo = utils.getCommentMediaInfo(post)

  const internalLink = `/p/${post.subplebbitAddress}/c/${post.cid}`
  const externalLink = !mediaInfo && post?.link

  return <div className={styles.feedPost}>
    <div className={styles.textWrapper}>
      <div className={styles.column}>
        <div className={styles.score}>
          <div className={styles.upvote}><Arrow /></div>
          <div className={styles.scoreNumber}>
            {(post?.upvoteCount - post?.downvoteCount) || 0}
          </div>
          <div className={styles.downvote}><Arrow /></div>
        </div>
      </div>
      <div className={styles.column}>
        <div className={styles.header}>
          <Link to={internalLink} className={styles.title}>{post?.title || post?.content || '-'}</Link>
          {hostname && <Link to={externalLink} target='_blank'> {hostname}</Link>}
        </div>
        <div className={styles.content}>
          <span className={styles.timestamp}>{utils.getFormattedTime(post?.timestamp)}</span>
          <span className={styles.author}> by {post?.author?.shortAddress}</span>
          <span className={styles.subplebbit}> to {post?.subplebbitAddress}</span>
        </div>
        <div className={styles.footer}>
          <Link to={internalLink} className={styles.replyCount}>
            {post?.replyCount} comments
          </Link>
        </div>
      </div>
    </div>
    <Link to={internalLink}>
      <FeedPostMedia mediaInfo={mediaInfo} />
    </Link>
  </div>
}

export default FeedPost
