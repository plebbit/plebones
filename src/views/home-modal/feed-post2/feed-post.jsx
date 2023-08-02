import utils from '../../../lib/utils'
import { Link } from 'react-router-dom'
import styles from './feed-post.module.css'
import Arrow from '../../../components/icons/arrow'
import PostTools from '../../../components/post-tools'
import {useBlock} from '@plebbit/plebbit-react-hooks'
import PostModal from '../post-modal'

const FeedPostMedia = ({mediaInfo}) => {
  if (!mediaInfo) {
    return <div className={styles.noMedia}></div>
  }
  if (mediaInfo.type === 'image') {
    return <div className={styles.mediaWrapper}><img className={styles.media} src={mediaInfo.url} alt='' /></div>
  }
  if (mediaInfo.type === 'video') {
    return <div className={styles.mediaWrapper}><video className={styles.media} controls={true} autoPlay={false} src={mediaInfo.url} /></div>
  }
  if (mediaInfo.type === 'audio') {
    return <audio className={styles.media} controls={true} autoPlay={false} src={mediaInfo.url} />
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

  const {blocked: hidden} = useBlock({cid: post?.cid})

  return <div className={styles.feedPost}>
    <div className={styles.textWrapper}>
      <div className={styles.column}>
        <div className={styles.score}>
          <div className={styles.upvote}><Arrow /></div>
          <PostTools post={post}>
            <div className={styles.scoreNumber}>
              {(post?.upvoteCount - post?.downvoteCount) || 0}
            </div>
          </PostTools>
          <div className={styles.downvote}><Arrow /></div>
        </div>
      </div>
      <div className={[styles.column, hidden && styles.hidden].join(' ')}>
        <div className={styles.header}>
          <PostModal post={post}>
            <Link className={styles.title}>{post?.title || post?.content || '-'}</Link>
          </PostModal>
          {hostname && <Link to={post?.link} target='_blank' rel='noreferrer'> {hostname}</Link>}
        </div>
        <div className={styles.content}>
          <span className={styles.timestamp}>{utils.getFormattedTime(post?.timestamp)}</span>
          <span className={styles.author}> by {post?.author?.shortAddress}</span>
          <span className={styles.subplebbit}> to {post?.shortSubplebbitAddress}</span>
        </div>
        <div className={styles.footer}>
          <PostModal post={post}>
            <Link className={[styles.button, styles.replyCount].join(' ')}>
              {post?.replyCount} comments
            </Link>
          </PostModal>
        </div>
      </div>
    </div>
    <PostModal post={post}>
      <Link className={hidden && styles.hidden}>
        <FeedPostMedia mediaInfo={mediaInfo} />
      </Link>
    </PostModal>
  </div>
}

export default FeedPost
