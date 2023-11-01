import utils from '../../lib/utils'
import {Link} from 'react-router-dom'
import styles from './feed-post.module.css'
import Arrow from '../icons/arrow'
import PostTools from '../post-tools'
import {useBlock, useAuthorAddress, useEditedComment, useSubplebbit} from '@plebbit/plebbit-react-hooks'
import useUnreadReplyCount from '../../hooks/use-unread-reply-count'
import useUpvote from '../../hooks/use-upvote'
import useDownvote from '../../hooks/use-downvote'
import useCommentLabels from '../../hooks/use-comment-labels'

const FeedPostMedia = ({mediaType, mediaUrl, link}) => {
  if (!mediaType) {
    return <div className={styles.noMedia}></div>
  }
  if (mediaType === 'image') {
    return (
      <div className={styles.mediaWrapper}>
        <Link to={link}>
          <img className={styles.media} src={mediaUrl} alt="" />
        </Link>
      </div>
    )
  }
  if (mediaType === 'video') {
    return (
      <div className={styles.mediaWrapper}>
        <Link to={link}>
          <video className={styles.media} controls={true} autoPlay={false} src={mediaUrl} />
        </Link>
      </div>
    )
  }
  if (mediaType === 'audio') {
    return (
      <Link to={link}>
        <audio controls={true} autoPlay={false} src={mediaUrl} />
      </Link>
    )
  }
  return <div className={styles.noMedia}></div>
}

const FeedPostAuthorAddress = ({post}) => {
  // show the public key author address for a few ms until the crypto name verification loads
  const {shortAuthorAddress, authorAddressChanged} = useAuthorAddress({comment: post})

  return (
    <Link className={styles.authorAddressWrapper} to={`/u/${post?.author?.address}/c/${post?.cid}`}>
      {/* use the crypto name as the width of the html element, but hide it and display the verified author address instead */}
      <span className={styles.authorAddressHidden}>{post?.author?.shortAddress}</span>
      {/* add css animation if the author address changed */}
      <span className={[styles.authorAddressVisible, authorAddressChanged ? styles.authorAddressChanged : undefined].join(' ')}>{shortAuthorAddress}</span>
    </Link>
  )
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
  } catch (e) {}

  const mediaType = utils.getCommentLinkMediaType(post?.link)

  const internalLink = `/p/${post?.subplebbitAddress}/c/${post?.cid}`

  const {blocked: hidden} = useBlock({cid: post?.cid})

  const [unreadReplyCount] = useUnreadReplyCount(post)
  const unreadReplyCountText = typeof unreadReplyCount === 'number' ? `+${unreadReplyCount}` : ''

  const [upvoted, upvote] = useUpvote(post)
  const [downvoted, downvote] = useDownvote(post)

  let scoreNumber = post?.upvoteCount - post?.downvoteCount
  const negativeScoreNumber = scoreNumber < 0
  const largeScoreNumber = String(scoreNumber).length > 3
  if (isNaN(scoreNumber)) {
    scoreNumber = '-'
  }

  const labels = useCommentLabels(post, editedPostState)

  const title = (post?.title?.trim?.() || post?.content?.trim?.())?.substring?.(0, 300) || '-'

  // if sub address is not a domain, add sub title hint to address
  const subplebbitAddressIsDomain = post?.shortSubplebbitAddress && post?.shortSubplebbitAddress?.includes('.')
  const subplebbit = useSubplebbit({subplebbitAddress: !subplebbitAddressIsDomain ? post?.subplebbitAddress : undefined})
  const subplebbitAddress = subplebbit?.title
    ? `${post?.shortSubplebbitAddress.substring(0, 8)}-${subplebbit?.title?.replaceAll(' ', '').substring(0, 8).toLowerCase()}`
    : post?.shortSubplebbitAddress

  return (
    <div className={styles.feedPost}>
      <div className={styles.textWrapper}>
        <div className={styles.column}>
          <div className={styles.score}>
            <div onClick={upvote} className={[styles.upvote, upvoted ? styles.voteSelected : undefined].join(' ')}>
              <Arrow />
            </div>
            <PostTools post={post}>
              <div
                className={[
                  styles.scoreNumber,
                  largeScoreNumber ? styles.largeScoreNumber : undefined,
                  negativeScoreNumber ? styles.negativeScoreNumber : undefined,
                ].join(' ')}
              >
                {scoreNumber}
              </div>
            </PostTools>
            <div onClick={downvote} className={[styles.downvote, downvoted ? styles.voteSelected : undefined].join(' ')}>
              <Arrow />
            </div>
          </div>
        </div>
        <div className={[styles.column, hidden ? styles.hidden : undefined].join(' ')}>
          <div className={styles.header}>
            <Link to={internalLink} className={styles.title}>
              {title}
            </Link>
            {labels.map((label) => (
              <>
                {' '}
                <span key={label} className={styles.label}>
                  {label}
                </span>
              </>
            ))}
            {hostname && (
              <Link to={post?.link} target="_blank" rel="noreferrer">
                {' '}
                {hostname}
              </Link>
            )}
          </div>
          <div className={styles.content}>
            <span className={styles.timestamp}>{utils.getFormattedTime(post?.timestamp)}</span>
            <span className={styles.author}>
              {' '}
              by <FeedPostAuthorAddress post={post} /> to{' '}
            </span>
            <Link to={`/p/${post?.subplebbitAddress}`} className={styles.subplebbit}>
              {subplebbitAddress}
            </Link>
          </div>
          <div className={styles.footer}>
            <Link to={internalLink} className={[styles.button, styles.replyCount].join(' ')}>
              {post?.replyCount} comments <span className={styles.unreadReplyCount}>{unreadReplyCountText}</span>
            </Link>
          </div>
        </div>
      </div>
      <div className={hidden || post?.removed ? styles.hidden : undefined}>
        <FeedPostMedia mediaType={mediaType} mediaUrl={post?.link} link={internalLink} />
      </div>
    </div>
  )
}

export default FeedPost
