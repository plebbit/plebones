import utils from '../../lib/utils'
import {useParams, useNavigate} from 'react-router-dom'
import {useEffect} from 'react'
import { Link } from 'react-router-dom'
import Arrow from '../../components/icons/arrow'
import styles from '../post/post.module.css'
import {useAccountComment} from '@plebbit/plebbit-react-hooks'
import useStateString from '../../hooks/use-state-string'

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

function Post() {
  const {accountCommentIndex: commentIndex} = useParams()
  const navigate = useNavigate()
  const post = useAccountComment({commentIndex})
  const shortAuthorAddress = post?.author?.shortAddress

  let hostname
  try {
    hostname = new URL(post?.link).hostname.replace(/^www\./, '')
  }
  catch (e) {}

  // scroll to top on first load
  useEffect(() => window.scrollTo(0,0), [])

  // redirect to post when post.cid is received
  useEffect(() => {
    if (post?.cid && post?.subplebbitAddress) {
      navigate(`/p/${post?.subplebbitAddress}/c/${post.cid}`, {replace: true})
    }
  }, [post?.cid, post?.subplebbitAddress, navigate])

  let state
  if (post?.timestamp) {
    // if older than 20 minutes without receiving post.cid, consider pending comment failed
    if (post.timestamp > (Date.now() / 1000) - (20 * 60)) {
      state = 'pending'
    }
    else {
      state = 'failed'
    }
  }
  const stateStyle = styles[`${state}Label`]

  const publishingStateString = useStateString(post)

  return (
    <div className={styles.post}>
      <div className={styles.textWrapper}>
        <div className={styles.column}>
          <div className={styles.score}>
            <div className={styles.upvote}><Arrow /></div>
              <div className={styles.scoreNumber}>0</div>
            <div className={styles.downvote}><Arrow /></div>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.header}>
            <Link to={post?.link} target={post?.link ? '_blank' : undefined} rel='noreferrer' className={styles.title}>{post?.title || post?.content || '-'}</Link>
            {' '}<span className={stateStyle}>{state}</span>
            {hostname && <Link to={post?.link} target='_blank' rel='noreferrer'> {hostname}</Link>}
          </div>
          <div>
            <span className={styles.timestamp}>{utils.getFormattedTime(post?.timestamp)}</span>
            <span className={styles.author}> by {shortAuthorAddress || post?.author?.shortAddress}</span>
            <span className={styles.subplebbit}> to {post?.subplebbitAddress}</span>
          </div>
          <div className={styles.footer}>
            <span className={[styles.replyCount, styles.button].join(' ')}>0 comments</span>
          </div>
          {post?.content && <div className={styles.content}>{post?.content}</div>}
        </div>
      </div>
      <div>
        <PostMedia post={post} />
      </div>
      {publishingStateString && <div className={styles.stateString} title={publishingStateString}>{publishingStateString}...</div>}
    </div>
  )
}

export default Post
