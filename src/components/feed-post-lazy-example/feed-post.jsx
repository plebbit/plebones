import utils from '../../lib/utils'
import { Link } from 'react-router-dom'
import styles from './feed-post.module.css'
import {useState, useEffect} from 'react'
import useIsMounted from '../../hooks/use-is-mounted'

const FeedPostMedia = ({mediaInfo, show}) => {
  if (!mediaInfo) {
    return <div className={styles.noMedia}></div>
  }
  // only show low priority components after high priority components have mounted
  if (!show) {
    return <div className={styles.mediaWrapper}></div>
  }
  if (mediaInfo.type === 'image') {
    return <div className={styles.mediaWrapper}><Media/></div>
  }
  if (mediaInfo.type === 'video') {
    return <div className={styles.mediaWrapper}><Media/></div>
  }
  return <div className={styles.noMedia}></div>
}

// fake slow media
const Media = ({mediaInfo}) => {
  let i = 50000000
  let a = 0
  while (i--) {
    a++
  }

  return <div style={{height: 300, width: 400, backgroundColor: 'red'}}></div>
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

  // FeedPost is mounted, only show low priority components after has mounted
  let isMounted = useIsMounted()
  // isMounted = true

  return <div className={styles.feedPost}>
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
          {hostname && <span className={styles.header}>{' '}{hostname}</span>}
        </div>
        <div className={styles.content}>
          <span className={styles.timestamp}>{utils.getFormattedTime(post?.timestamp)}</span>
          <span className={styles.author}> by {post?.author?.shortAddress}</span>
          <span className={styles.subplebbit}> to {post?.shortSubplebbitAddress || post?.subplebbitAddress}</span>
        </div>
        <div className={styles.footer}>
          <Link to={internalLink} className={styles.replyCount}>
            {post?.replyCount} comments
          </Link>
        </div>
      </div>
    </div>
    <Link to={internalLink}>
      <FeedPostMedia mediaInfo={mediaInfo} show={isMounted} />
    </Link>
  </div>
}

export default FeedPost
