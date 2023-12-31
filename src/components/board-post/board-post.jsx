import utils from '../../lib/utils'
import {Link} from 'react-router-dom'
import {flattenCommentsPages} from '@plebbit/plebbit-react-hooks/dist/lib/utils'
import {useMemo} from 'react'
import styles from './board-post.module.css'

const BoardPostMedia = ({mediaType, mediaUrl}) => {
  if (!mediaType) {
    return <div className={styles.noMedia}></div>
  }
  if (mediaType === 'image') {
    return (
      <div className={styles.mediaWrapper}>
        <img className={styles.media} src={mediaUrl} alt="" />
      </div>
    )
  }
  if (mediaType === 'video') {
    return (
      <div className={styles.mediaWrapper}>
        <video className={styles.media} controls={true} autoPlay={false} src={mediaUrl} />
      </div>
    )
  }
  return <div className={styles.noMedia}></div>
}

const Reply = ({reply}) => {
  return (
    <div className={styles.reply}>
      <div className={styles.replyHeaderWrapper}>
        <div className={styles.replyHeader}>
          <span className={styles.replyAuthor}>{reply.author.shortAddress}</span>
          <span className={styles.replyTimestamp}> {utils.getFormattedTime(reply?.timestamp)}</span>
        </div>
      </div>

      <div className={styles.replyContent}>{reply.content}</div>
    </div>
  )
}

const BoardPost = ({post, index}) => {
  const mediaType = utils.getCommentLinkMediaType(post?.link)

  const internalLink = `/p/${post.subplebbitAddress}/c/${post.cid}`
  const externalLink = !mediaType && post?.link && <Link to={post?.link}>{post?.link}</Link>

  const replies = useMemo(
    () =>
      flattenCommentsPages(post.replies)
        .splice(0, 5)
        .map((reply) => <Reply reply={reply} />),
    [post.replies]
  )

  return (
    <div className={styles.post}>
      <Link to={internalLink}>
        <BoardPostMedia mediaType={mediaType} mediaUrl={post?.link} />
      </Link>
      <div className={styles.textWrapper}>
        <div className={styles.header}>
          <Link to={internalLink} className={styles.title}>
            {post?.title || '-'}
          </Link>
          <span className={styles.timestamp}> {utils.getFormattedTime(post?.timestamp)}</span>
          <span className={styles.author}> by {post?.author?.shortAddress}</span>
          <span className={styles.subplebbit}> to {post?.shortSubplebbitAddress}</span>
        </div>
        <div className={styles.content}>
          {externalLink}
          <Link to={internalLink}>{post?.content || ''}</Link>
        </div>
        <div className={styles.footer}>
          <Link to={internalLink} className={styles.replyCount}>
            {post?.replyCount} comments
          </Link>
        </div>
      </div>
      {replies}
    </div>
  )
}

export default BoardPost
