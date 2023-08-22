import utils from '../../../lib/utils'
import { Link } from 'react-router-dom'
import styles from './feed-post.module.css'
import Arrow from '../../../components/icons/arrow'
import PostTools from '../../../components/post-tools'
import {useAuthorAddress, useEditedComment} from '@plebbit/plebbit-react-hooks'
import useUnreadReplyCount from '../../../hooks/use-unread-reply-count'
import useCommentLabels from '../../../hooks/use-comment-labels'

const FeedPostMedia = ({mediaType, mediaUrl, link}) => {
  if (!mediaType) {
    return <div className={styles.noMedia}></div>
  }
  if (mediaType === 'image') {
    return <div className={styles.mediaWrapper}><Link to={link}><img className={styles.media} src={mediaUrl} alt='' /></Link></div>
  }
  if (mediaType === 'video') {
    return <div className={styles.mediaWrapper}><Link to={link}><video className={styles.media} controls={true} autoPlay={false} src={mediaUrl} /></Link></div>
  }
  if (mediaType === 'audio') {
    return <Link to={link}><audio controls={true} autoPlay={false} src={mediaUrl} /></Link>
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

  const mediaType = utils.getCommentLinkMediaType(post?.link)

  const internalLink = post?.cid ? `/p/${post.subplebbitAddress}/c/${post.cid}` : `/profile/${post.index}`

  const [unreadReplyCount] = useUnreadReplyCount(post)
  const unreadReplyCountText = typeof unreadReplyCount === 'number' ? `+${unreadReplyCount}` : ''

  // show the unverified author address for a few ms until the verified arrives
  const {shortAuthorAddress} = useAuthorAddress({comment: post})

  const scoreNumber = (post?.upvoteCount - post?.downvoteCount) || 0
  const largeScoreNumber = String(scoreNumber).length > 3
  const negativeScoreNumber = scoreNumber < 0

  let labels = useCommentLabels(post, editedPostState)
  let labelStyle = styles.label

  let state
  if (!post?.cid && post?.timestamp) {
    // if older than 20 minutes without receiving post.cid, consider pending comment failed
    if (post.timestamp > (Date.now() / 1000) - (20 * 60)) {
      state = 'pending'
    }
    else {
      state = 'failed'
    }
    labels = [state]
    labelStyle = styles[`${state}Label`]
  }

  const title = (post?.title?.trim?.() || post?.content?.trim?.())?.substring?.(0, 300) || '-'

  return <div className={styles.feedPost}>
    <div className={styles.textWrapper}>
      <div className={styles.column}>
        <div className={styles.score}>
          <div className={styles.upvote}><Arrow /></div>
          <PostTools post={post}>
            <div className={[styles.scoreNumber, largeScoreNumber ? styles.largeScoreNumber : undefined, negativeScoreNumber ? styles.negativeScoreNumber: undefined].join(' ')}>
              {scoreNumber}
            </div>
          </PostTools>
          <div className={styles.downvote}><Arrow /></div>
        </div>
      </div>
      <div className={styles.column}>
        <div className={styles.header}>
          <Link to={internalLink} className={styles.title}>{title}</Link>
          {labels.map(label => <>{' '}<span key={label} className={labelStyle}>{label}</span></>)}
          {hostname && <Link to={post?.link} target='_blank' rel='noreferrer'> {hostname}</Link>}
        </div>
        <div className={styles.content}>
          <span className={styles.timestamp}>{utils.getFormattedTime(post?.timestamp)}</span>
          <span className={styles.author}> by {shortAuthorAddress || post?.author?.shortAddress} to </span>
          <Link to={`/p/${post?.subplebbitAddress}`} className={styles.subplebbit}>{post?.subplebbitAddress}</Link>
        </div>
        <div className={styles.footer}>
          <Link to={internalLink} className={[styles.button, styles.replyCount].join(' ')}>
            {post?.replyCount} comments <span className={styles.unreadReplyCount}>{unreadReplyCountText}</span>
          </Link>
        </div>
      </div>
    </div>
    <div>
      <FeedPostMedia mediaType={mediaType} mediaUrl={post?.link} link={internalLink} />
    </div>
  </div>
}

export default FeedPost
