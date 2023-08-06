import {useComment} from '@plebbit/plebbit-react-hooks'
import utils from '../../lib/utils'
import { useParams } from 'react-router-dom'
import {useEffect} from 'react'
import { Link } from 'react-router-dom'
import Arrow from '../../components/icons/arrow'
import styles from './post.module.css'
import PostTools from '../../components/post-tools'
import PostReplyTools from '../../components/post-reply-tools'
import ReplyTools from '../../components/reply-tools'
import {useBlock, useAuthorAddress} from '@plebbit/plebbit-react-hooks'
import useUnreadReplyCount from '../../hooks/use-unread-reply-count'
import useUpvote from '../../hooks/use-upvote'
import useDownvote from '../../hooks/use-downvote'

const PostMedia = ({post}) => {
  const mediaInfo = utils.getCommentMediaInfo(post)
  if (!mediaInfo) {
    return <div className={styles.noMedia}></div>
  }
  if (mediaInfo.type === 'image') {
    return <div className={styles.mediaWrapper}><img className={styles.media} src={mediaInfo.url} alt='' /></div>
  }
  if (mediaInfo.type === 'video') {
    return <video className={styles.media} controls={true} autoPlay={false} src={mediaInfo.url} />
  }
  if (mediaInfo.type === 'audio') {
    return <audio className={styles.media} controls={true} autoPlay={false} src={mediaInfo.url} />
  }
  return <div className={styles.noMedia}></div>
}

const Reply = ({reply, isLast}) => {
  // show the unverified author address for a few ms until the verified arrives
  const {shortAuthorAddress} = useAuthorAddress({comment: reply})
  const replies = reply?.replies?.pages?.topAll?.comments || ''
  const replyDepthEven = reply?.depth % 2 === 0

  return (
      <div className={[styles.reply].join(' ')}>
        <ReplyTools reply={reply}>
          <div className={[styles.replyWrapper, replyDepthEven ? styles.replyDepthEven : undefined, isLast ? styles.replyIsLast : undefined].join(' ')}>
            <div className={styles.replyHeader}>
              <span className={styles.replyScore}>{(reply?.upvoteCount - reply?.downvoteCount) || 0}</span>
              <span className={styles.replyAuthor}> {shortAuthorAddress || reply?.author?.shortAddress}</span>
              <span className={styles.replyTimestamp}> {utils.getFormattedTime(reply?.timestamp)}</span>
            </div>

            <div className={styles.replyContent}>{reply.content}</div>
          </div>
        </ReplyTools>
        <div className={styles.replies}>
          {replies?.map?.((reply, index) => <Reply key={reply?.cid} reply={reply} isLast={reply?.replyCount !== 0 || replies.length === index + 1} />)}
        </div>
      </div>
  )
}

function Post() {
  const {commentCid} = useParams()
  const post = useComment({commentCid})

  let hostname
  try {
    hostname = new URL(post?.link).hostname.replace(/^www\./, '')
  }
  catch (e) {}

  const replies = post?.replies?.pages?.topAll?.comments?.map?.(reply => <Reply key={reply?.cid} reply={reply} isLast={reply?.replyCount === 0}/>) || ''

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

  const scoreNumber = (post?.upvoteCount - post?.downvoteCount) || 0
  const largeScoreNumber = String(scoreNumber).length > 3
  const negativeScoreNumber = scoreNumber < 0

  return (
    <div className={styles.post}>
      <div className={styles.textWrapper}>
        <div className={styles.column}>
          <div className={styles.score}>
            <div onClick={upvote} className={[styles.upvote, upvoted ? styles.voteSelected : undefined].join(' ')}><Arrow /></div>
              <PostTools post={post}>
                <div className={[styles.scoreNumber, largeScoreNumber ? styles.largeScoreNumber : undefined, negativeScoreNumber ? styles.negativeScoreNumber: undefined].join(' ')}>
                  {(post?.upvoteCount - post?.downvoteCount) || 0}
                </div>
              </PostTools>
            <div onClick={downvote} className={[styles.downvote, downvoted ? styles.voteSelected : undefined].join(' ')}><Arrow /></div>
          </div>
        </div>
        <div className={[styles.column, hidden ? styles.hidden : undefined].join(' ')}>
          <div className={styles.header}>
            <Link to={post?.link} target={post?.link ? '_blank' : undefined} rel='noreferrer' className={styles.title}>{post?.title || post?.content || '-'}</Link>
            {hostname && <Link to={post?.link} target='_blank' rel='noreferrer'> {hostname}</Link>}
          </div>
          <div>
            <span className={styles.timestamp}>{utils.getFormattedTime(post?.timestamp)}</span>
            <span className={styles.author}> by {shortAuthorAddress || post?.author?.shortAddress}</span>
            <span className={styles.subplebbit}> to {post?.subplebbitAddress}</span>
          </div>
          <div className={styles.footer}>
            <span className={[styles.replyCount, styles.button].join(' ')}>{post?.replyCount} comments</span>
            <PostReplyTools reply={post}>
              <span className={styles.button}>
                reply
              </span>
            </PostReplyTools>
          </div>
          {post?.content?.trim?.() && <div className={styles.content}>{post?.content}</div>}
        </div>
      </div>
      <div className={hidden ? styles.hidden : undefined}>
        <PostMedia post={post} />
      </div>
      <div className={styles.replies}>
        {replies}
      </div>
    </div>
  )
}

export default Post
