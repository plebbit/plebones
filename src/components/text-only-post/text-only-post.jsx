import utils from '../../lib/utils'
import { Link } from 'react-router-dom'
import styles from './text-only-post.module.css'

const TextOnlyPost = ({post, index}) => {
  const internalLink = `/p/${post.subplebbitAddress}/c/${post.cid}`
  const externalLink = post?.link

  return <div className={styles.post}>
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
          <Link to={externalLink || internalLink} target={externalLink ? '_blank' : undefined} className={styles.title}>{post?.title || post?.content || '-'}</Link>
        </div>
        <div className={styles.content}>
          <span className={styles.timestamp}>{utils.getFormattedTime(post?.timestamp)}</span>
          <span className={styles.author}> by {post?.author?.shortAddress}</span>
          <span className={styles.subplebbit}> to {post?.shortSubplebbitAddress}</span>
        </div>
        <div className={styles.footer}>
          <Link to={internalLink} className={styles.replyCount}>
            {post?.replyCount} comments
          </Link>
        </div>
      </div>
    </div>
  </div>
}

export default TextOnlyPost
