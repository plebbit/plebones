import {useComment, useEditedComment, useAccountComment, useAuthorAvatar, useReplies} from '@plebbit/plebbit-react-hooks'
import utils from '../../lib/utils'
import {useEffect, useState} from 'react'
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
import useRepliesSortType from '../../hooks/use-replies-sort-type'
import useCommentLabels from '../../hooks/use-comment-labels'
import useStateString from '../../hooks/use-state-string'
import ReplyMedia from './reply-media'
import Embed, {canEmbed} from '../../components/embed'

const AuthorAvatar = ({comment}) => {
  const {imageUrl} = useAuthorAvatar({author: comment?.author})
  // if comment.author.avatar is defined, load empty space even without imageUrl
  // to not displace the feed after image loads
  if (!comment?.author?.avatar) {
    return
  }
  return (
    <span className={styles.authorAvatarWrapper}>
      <img className={styles.authorAvatar} alt="" src={imageUrl} />
    </span>
  )
}

const PostMedia = ({post}) => {
  if (!post?.link) {
    return <div className={styles.noMedia}></div>
  }
  const mediaType = utils.getCommentLinkMediaType(post?.link)
  if (mediaType === 'image') {
    return (
      <div className={styles.mediaWrapper}>
        <img className={styles.media} src={post?.link} alt="" />
      </div>
    )
  }
  if (mediaType === 'video') {
    return <video className={styles.media} controls={true} autoPlay={false} src={post?.link} />
  }
  if (mediaType === 'audio') {
    return <audio className={styles.media} controls={true} autoPlay={false} src={post?.link} />
  }
  try {
    const parsedUrl = new URL(post?.link)
    if (canEmbed(parsedUrl)) {
      return (
        <div className={styles.mediaWrapper}>
          <Embed parsedUrl={parsedUrl} />
        </div>
      )
    }
  } catch (e) {}
  return <div className={styles.noMedia}></div>
}

const Reply = ({reply, updatedReply, depth, isLast}) => {
  // handle pending mod or author edit
  const {state: editedReplyState, editedComment: editedReply} = useEditedComment({comment: reply})
  if (editedReply) {
    reply = editedReply
  }

  // show the unverified author address for a few ms until the verified arrives
  const {shortAuthorAddress} = useAuthorAddress({comment: reply})
  const {useRepliesOptions} = useRepliesSortType()
  const {replies, bufferedReplies, updatedReplies, loadMore, hasMore} = useReplies({...useRepliesOptions, comment: reply, repliesPerPage: 5})
  const replyDepthEven = depth % 2 === 0

  // publishing states exist only on account comment
  const accountReply = useAccountComment({commentIndex: reply.index})
  const state = accountReply?.state === 'pending' || accountReply?.state === 'failed' ? accountReply?.state : undefined
  const publishingStateString = useStateString(state === 'pending' && accountReply)

  const labels = useCommentLabels(reply, editedReplyState)

  const _loadMore = (event) => {
    event.stopPropagation() // don't trigger the reply typing modal
    loadMore()
  }

  let score = (updatedReply?.upvoteCount || 0) - (updatedReply?.downvoteCount || 0)
  if (score === 0) {
    score = ''
  } else if (score > 0) {
    score = `+${score}`
  }

  return (
    <div className={styles.reply}>
      <ReplyTools reply={reply}>
        <div className={[styles.replyWrapper, replyDepthEven ? styles.replyDepthEven : undefined, isLast ? styles.replyIsLast : undefined].join(' ')}>
          <div className={styles.replyHeader}>
            <span className={styles.replyScore}>{score} </span>
            <AuthorAvatar comment={reply} />
            <span className={styles.replyAuthor}>{shortAuthorAddress}</span>
            <span className={styles.replyTimestamp}> {utils.getFormattedTime(reply?.timestamp)}</span>
            {hasMore && bufferedReplies?.length !== 0 && (
              <span onClick={_loadMore} className={styles.newRepliesButton}>
                {' '}
                ({bufferedReplies?.length} new {bufferedReplies.length === 1 ? 'reply' : 'replies'})
              </span>
            )}
            {labels.map((label) => (
              <>
                {' '}
                <span key={label} className={styles.label}>
                  {label}
                </span>
              </>
            ))}
            {state && (
              <>
                {' '}
                <span className={styles.label}>{state}</span>
              </>
            )}
            {publishingStateString && (
              <>
                {' '}
                <span>{publishingStateString}</span>
              </>
            )}
          </div>

          {useRepliesOptions.flat && reply.depth > 1 && <ReplyQuote commentCid={reply.parentCid} />}
          {/*<span className={styles.replyContent}>({reply?.cid?.substring?.(2, 6)} {reply?.index})</span>*/}
          <span className={styles.replyContent}>{reply?.content?.trim?.()}</span>
          <ReplyMedia reply={reply} />
        </div>
      </ReplyTools>
      <div className={styles.replies}>
        {replies.map((reply, index) => (
          <Reply
            key={reply?.cid || reply?.index}
            depth={(depth || 1) + 1}
            reply={reply}
            updatedReply={updatedReplies[index]}
            isLast={reply?.replyCount > 0 || replies.length === index + 1}
          />
        ))}
      </div>
    </div>
  )
}

const ReplyQuote = ({commentCid}) => {
  const comment = useComment({commentCid, onlyIfCached: true})
  // show the unverified author address for a few ms until the verified arrives
  const {shortAuthorAddress} = useAuthorAddress({comment})
  const [isOpen, setIsOpen] = useState(false)

  let content = comment?.content?.trim?.()
  if (!content) {
    return ''
  }
  let ellipsis = ''

  const tooLong = content.length > 60
  if (!isOpen && tooLong) {
    content = content.substring(0, 60).trim()
    ellipsis = <span className={styles.quoteEllipsis}>.....</span>
  }
  const open = (event) => {
    if (isOpen || !tooLong) {
      return
    }
    event.stopPropagation() // don't trigger the reply typing modal
    setIsOpen(true)
  }

  return (
    <div onClick={open} className={styles.quote}>
      <div className={styles.reply}>
        <div className={[styles.replyDepthEven, styles.replyIsLast].join(' ')}>
          <div className={styles.replyHeader}>
            <span className={styles.replyAuthor}>{shortAuthorAddress}</span>
          </div>
          <span className={[styles.replyContent, !isOpen ? styles.quoteClosed : undefined].join(' ')}>
            {content} {ellipsis}
          </span>
        </div>
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
  } catch (e) {}

  const {repliesSortType, repliesSortTypes, setRepliesSortType, useRepliesOptions} = useRepliesSortType()
  let {replies, bufferedReplies, updatedReplies, hasMore, loadMore} = useReplies({...useRepliesOptions, comment: post, repliesPerPage: 50})
  const replyComponents =
    replies.map((reply, index) => <Reply key={reply?.cid || reply?.index} reply={reply} updatedReply={updatedReplies[index]} isLast={reply?.replyCount === 0} />) || ''

  const {blocked: hidden} = useBlock({cid: post?.cid})

  const [upvoted, upvote] = useUpvote(post)
  const [downvoted, downvote] = useDownvote(post)

  // show the unverified author address for a few ms until the verified arrives
  const {shortAuthorAddress} = useAuthorAddress({comment: post})

  // keep track of unread reply counts
  const [, setRepliesToRead] = useUnreadReplyCount(post)
  useEffect(() => setRepliesToRead(), [post?.replyCount, setRepliesToRead])

  // scroll to top on first load
  useEffect(() => window.scrollTo(0, 0), [])

  let scoreNumber = post?.upvoteCount - post?.downvoteCount
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
            <Link to={post?.link} target={post?.link ? '_blank' : undefined} rel="noreferrer" className={styles.title}>
              {post?.title?.trim?.() || '-'}
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
          <div>
            <span className={styles.timestamp}>{utils.getFormattedTime(post?.timestamp)}</span>
            <span className={styles.author}>
              {' '}
              by <AuthorAvatar comment={post} />
              <Link to={`/u/${post?.author?.address}/c/${post?.cid}`}>{shortAuthorAddress}</Link> to{' '}
            </span>
            <Link to={`/p/${post?.subplebbitAddress}`} className={styles.subplebbit}>
              {post?.subplebbitAddress}
            </Link>
          </div>
          <div className={styles.footer}>
            <span className={[styles.replyCount, styles.button].join(' ')}>{post?.replyCount} comments</span>
            <span className={styles.button}>
              <select onChange={(event) => setRepliesSortType(event.target.value)} value={repliesSortType} className={styles.repliesSortType}>
                {repliesSortTypes.map((repliesSortType) => (
                  <option key={repliesSortType} value={repliesSortType}>
                    {repliesSortType}
                  </option>
                ))}
              </select>
            </span>
            <PostReplyTools reply={post}>
              <span className={styles.button}>reply</span>
            </PostReplyTools>
          </div>
          {post?.content?.trim?.() && <div className={styles.content}>{post?.content?.trim?.()}</div>}
        </div>
      </div>
      <div className={hidden ? styles.hidden : undefined}>
        <PostMedia post={post} />
      </div>
      {stateString && <div className={styles.stateString}>{stateString}</div>}
      <div className={styles.replies}>{replyComponents}</div>
      {hasMore && bufferedReplies?.length !== 0 && (
        <div onClick={loadMore} className={styles.button}>
          <span className={styles.footer}>load more comments</span> ({bufferedReplies?.length} replies)
        </div>
      )}
    </div>
  )
}

export default Post
