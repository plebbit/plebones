import utils from '../../lib/utils'
import { Link } from 'react-router-dom'
import { flattenCommentsPages } from '@plebbit/plebbit-react-hooks/dist/lib/utils'
import {useMemo} from 'react'
import styles from './board-post.module.css'

const BoardPostMedia = ({mediaInfo}) => {
  if (!mediaInfo) {
    return <div className={styles.noMedia} ></div>
  }
  if (mediaInfo.type === 'image') {
    return <div className={styles.mediaWrapper}><img className={styles.media} src={mediaInfo.url} alt='' /></div>
  }
  if (mediaInfo.type === 'video') {
    return <div className={styles.mediaWrapper}><video className={styles.media} controls={true} autoplay={false} src={mediaInfo.url} /></div>
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
  const mediaInfo = utils.getCommentMediaInfo(post)

  const internalLink = `/p/${post.subplebbitAddress}/c/${post.cid}`
  const externalLink = !mediaInfo && post?.link && <Link to={post?.link}>{post?.link}</Link>

  const replies = useMemo(() => flattenCommentsPages(post.replies).splice(0, 5).map(reply => <Reply reply={reply}/>), [post.replies])

  return <div className={styles.post}>
    <Link to={internalLink}>
      <BoardPostMedia mediaInfo={mediaInfo} />
    </Link>
    <div className={styles.textWrapper}>
      <div className={styles.header}>
        <Link to={internalLink} className={styles.title}>{post?.title || '-'}</Link>
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
}

export default BoardPost
