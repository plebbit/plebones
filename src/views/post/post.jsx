import {useComment, useEditedComment} from '@plebbit/plebbit-react-hooks'
import utils from '../../lib/utils'
import {useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import Arrow from '../../components/icons/arrow'
import styles from './post.module.css'
import PostTools from '../../components/post-tools'
import PostReplyTools from '../../components/post-reply-tools'
import ReplyTools from '../../components/reply-tools'
import {useBlock, useAuthorAddress} from '@plebbit/plebbit-react-hooks'
import useUnreadReplyCount from '../../hooks/use-unread-reply-count'
import useUpvote from '../../hooks/use-upvote'
import useDownvote from '../../hooks/use-downvote'
import useReplies from '../../hooks/use-replies'
import useCommentLabels from '../../hooks/use-comment-labels'
import useStateString from '../../hooks/use-state-string'
import ReplyMedia from './reply-media'

const PostMedia = ({post}) => {
  const mediaType = utils.getCommentLinkMediaType(post?.link)
  if (!mediaType) {
    return <div className={styles.noMedia}></div>
  }
  if (mediaType === 'image') {
    return <div className={styles.mediaWrapper}><img className={styles.media} src={post?.link} alt='' /></div>
  }
  if (mediaType === 'video') {
    return <video className={styles.media} controls={true} autoPlay={false} src={post?.link} />
  }
  if (mediaType === 'audio') {
    return <audio className={styles.media} controls={true} autoPlay={false} src={post?.link} />
  }
  return <div className={styles.noMedia}></div>
}

const Reply = ({reply, depth, isLast}) => {
  // show the unverified author address for a few ms until the verified arrives
  const {shortAuthorAddress} = useAuthorAddress({comment: reply})
  const replies = useReplies(reply)
  const replyDepthEven = depth % 2 === 0

  const state = (reply?.state === 'pending' || reply?.state === 'failed') ? reply?.state : undefined
  const publishingStateString = useStateString(state === 'pending' && reply)

  return (
    <div className={styles.reply}>
      <ReplyTools reply={reply}>
        <div className={[styles.replyWrapper, replyDepthEven ? styles.replyDepthEven : undefined, isLast ? styles.replyIsLast : undefined].join(' ')}>
          <div className={styles.replyHeader}>
            <span className={styles.replyScore}>{(reply?.upvoteCount - reply?.downvoteCount) || 0}</span>
            <span className={styles.replyAuthor}> {shortAuthorAddress || reply?.author?.shortAddress}</span>
            <span className={styles.replyTimestamp}> {utils.getFormattedTime(reply?.timestamp)}</span>
            {state && <>{' '}<span className={styles.label}>{state}</span></>}
            {publishingStateString && <>{' '}<span>{publishingStateString}...</span></>}
          </div>

          <div className={styles.replyContent}>{reply?.content?.trim?.()}</div>
          <ReplyMedia reply={reply} />
        </div>
      </ReplyTools>
      <div className={styles.replies}>
        {replies.map((reply, index) => <Reply key={reply?.cid} depth={(depth || 1) + 1} reply={reply} isLast={reply?.replyCount > 0 || replies.length === index + 1} />)}
      </div>
    </div>
  )
}

function Post() {
  const {commentCid, subplebbitAddress} = useParams()
  let post = useComment({commentCid})

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

  const replies = useReplies(post).map(reply => <Reply key={reply?.cid} reply={reply} isLast={reply?.replyCount === 0}/>) || ''

  const {blocked: hidden} = useBlock({cid: post?.cid})

  const [upvoted, upvote] = useUpvote(post)
  const [downvoted, downvote] = useDownvote(post)

  // show the unverified author address for a few ms until the verified arrives
  const {shortAuthorAddress} = useAuthorAddress({comment: post})

  // keep track of unread reply counts
  const [, setRepliesToRead] = useUnreadReplyCount(post)
  useEffect(() => setRepliesToRead(), [post?.replyCount, setRepliesToRead])

  // scroll to top on first load
  useEffect(() => window.scrollTo(0,0), [])

  let scoreNumber = (post?.upvoteCount - post?.downvoteCount)
  const negativeScoreNumber = scoreNumber < 0
  const largeScoreNumber = String(scoreNumber).length > 3
  if (isNaN(scoreNumber)) {
    scoreNumber = '-'
  }

  const labels = useCommentLabels(post, editedPostState)

  const stateString = useStateString(post)

  // redirect to parent post if any
  const navigate = useNavigate()
  useEffect(() => {
    if (post?.postCid && post?.postCid !== post?.cid) {
      navigate(`/p/${post?.subplebbitAddress}/c/${post?.postCid}`, {replace: true})
    }
  }, [post?.postCid, post?.subplebbitAddress, post?.cid, navigate])

  // invalid subplebbit
  if (post?.subplebbitAddress && subplebbitAddress !== post?.subplebbitAddress) {
    return 'wrong subplebbit address'
  }

  return (
    <div className={styles.post}>
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
            <Link to={post?.link} target={post?.link ? '_blank' : undefined} rel='noreferrer' className={styles.title}>{post?.title?.trim?.() || '-'}</Link>
            {labels.map(label => <>{' '}<span key={label} className={styles.label}>{label}</span></>)}
            {hostname && <Link to={post?.link} target='_blank' rel='noreferrer'> {hostname}</Link>}
          </div>
          <div>
            <span className={styles.timestamp}>{utils.getFormattedTime(post?.timestamp)}</span>
            <span className={styles.author}> by <Link to={`/u/${post?.author?.address}/c/${post?.cid}`}>{shortAuthorAddress || post?.author?.shortAddress}</Link> to </span>
            <Link to={`/p/${post?.subplebbitAddress}`} className={styles.subplebbit}>{post?.subplebbitAddress}</Link>
          </div>
          <div className={styles.footer}>
            <span className={[styles.replyCount, styles.button].join(' ')}>{post?.replyCount} comments</span>
            <PostReplyTools reply={post}>
              <span className={styles.button}>
                reply
              </span>
            </PostReplyTools>
          </div>
          {post?.content?.trim?.() && <div className={styles.content}>{post?.content?.trim?.()}</div>}
        </div>
      </div>
      <div className={hidden ? styles.hidden : undefined}>
        <PostMedia post={post} />
      </div>
      {stateString && <div className={styles.stateString} title={stateString}>{stateString}...</div>}
      <div className={styles.replies}>
        {replies}
      </div>
    </div>
  )
}

export default Post
