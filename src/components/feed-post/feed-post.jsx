import utils from '../../lib/utils'
import { Link } from 'react-router-dom'
import styles from './feed-post.module.css'
import Arrow from '../icons/arrow'
import PostTools from '../post-tools'
import {useBlock, useAuthorAddress, useEditedComment} from '@plebbit/plebbit-react-hooks'
import useUnreadReplyCount from '../../hooks/use-unread-reply-count'
import useUpvote from '../../hooks/use-upvote'
import useDownvote from '../../hooks/use-downvote'
import useCommentLabels from '../../hooks/use-comment-labels'

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
    return <audio controls={true} autoPlay={false} src={mediaInfo.url} />
  }
  return <div className={styles.noMedia}></div>
}

const FeedPost = ({post, index}) => {
  // handle pending mod or author edit
  const {state: editedPostState, editedComment: editedPost} = useEditedComment({comment: post})
  if (editedPost) {
    post = editedPost
  }

  let hostname
  try {
    hostname = new URL(post?.link).hostname.replace(/^www\./, '')
  }
  catch (e) {}

  const mediaInfo = utils.getCommentMediaInfo(post)

  const internalLink = `/p/${post.subplebbitAddress}/c/${post.cid}`

  const {blocked: hidden} = useBlock({cid: post?.cid})

  const [unreadReplyCount] = useUnreadReplyCount(post)
  const unreadReplyCountText = typeof unreadReplyCount === 'number' ? `+${unreadReplyCount}` : ''

  // show the unverified author address for a few ms until the verified arrives
  const {shortAuthorAddress} = useAuthorAddress({comment: post})

  const [upvoted, upvote] = useUpvote(post)
  const [downvoted, downvote] = useDownvote(post)

  const scoreNumber = (post?.upvoteCount - post?.downvoteCount) || 0
  const largeScoreNumber = String(scoreNumber).length > 3
  const negativeScoreNumber = scoreNumber < 0

  const labels = useCommentLabels(post, editedPostState)

  return <div className={styles.feedPost}>
    <div className={styles.textWrapper}>
      <div className={styles.column}>
        <div className={styles.score}>
          <div onClick={upvote} className={[styles.upvote, upvoted ? styles.voteSelected : undefined].join(' ')}><Arrow /></div>
          <PostTools post={post}>
            <div className={[styles.scoreNumber, largeScoreNumber ? styles.largeScoreNumber : undefined, negativeScoreNumber ? styles.negativeScoreNumber: undefined].join(' ')}>
              {scoreNumber}
            </div>
          </PostTools>
          <div onClick={downvote} className={[styles.downvote, downvoted ? styles.voteSelected : undefined].join(' ')}><Arrow /></div>
        </div>
      </div>
      <div className={[styles.column, hidden ? styles.hidden : undefined].join(' ')}>
        <div className={styles.header}>
          <Link to={internalLink} className={styles.title}>{(post?.title || post?.content || '-').trim()}</Link>
          {labels.map(label => <>{' '}<span key={label} className={styles.label}>{label}</span></>)}
          {hostname && <Link to={post?.link} target='_blank' rel='noreferrer'> {hostname}</Link>}
        </div>
        <div className={styles.content}>
          <span className={styles.timestamp}>{utils.getFormattedTime(post?.timestamp)}</span>
          <span className={styles.author}> by {shortAuthorAddress || post?.author?.shortAddress} to </span>
          <Link to={`/p/${post?.subplebbitAddress}`} className={styles.subplebbit}>{post?.shortSubplebbitAddress}</Link>
        </div>
        <div className={styles.footer}>
          <Link to={internalLink} className={[styles.button, styles.replyCount].join(' ')}>
            {post?.replyCount} comments <span className={styles.unreadReplyCount}>{unreadReplyCountText}</span>
          </Link>
        </div>
      </div>
    </div>
    <Link className={hidden ? styles.hidden : undefined} to={internalLink}>
      <FeedPostMedia mediaInfo={mediaInfo} />
    </Link>
  </div>
}

export default FeedPost
