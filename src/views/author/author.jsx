import {useRef, useEffect} from 'react'
import {useAuthor, useAuthorComments, useAuthorAvatar} from '@plebbit/plebbit-react-hooks'
import {Virtuoso} from 'react-virtuoso'
import FeedPost from '../../components/feed-post'
import {useParams, useNavigate} from 'react-router-dom'
import styles from './author.module.css'
import {Link} from 'react-router-dom'

const AuthorInfo = ({authorAddress, commentCid}) => {
  const {author} = useAuthor({commentCid, authorAddress})
  const {imageUrl: avatarUrl} = useAuthorAvatar({author})

  const description = author?.displayName

  return (
    <div className={styles.info}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Link to={`/u/${authorAddress}/c/${commentCid}`}>u/{authorAddress}</Link>
          <img alt="" className={styles.avatar} src={avatarUrl} />
        </div>
      </div>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  )
}

const lastVirtuosoStates = {}

const Loading = () => 'loading...'

function Author() {
  const {commentCid, authorAddress} = useParams()
  const navigate = useNavigate()
  const {authorComments, lastCommentCid, hasMore, loadMore} = useAuthorComments({commentCid, authorAddress})

  const Footer = hasMore ? Loading : undefined

  // save last virtuoso state on each scroll
  const virtuosoRef = useRef()
  useEffect(() => {
    const setLastVirtuosoState = () =>
      virtuosoRef.current?.getState((snapshot) => {
        // TODO: not sure if checking for empty snapshot.ranges works for all scenarios
        if (snapshot?.ranges?.length) {
          lastVirtuosoStates[authorAddress] = snapshot
        }
      })
    // TODO: doesn't work if the user hasn't scrolled
    window.addEventListener('scroll', setLastVirtuosoState)
    // clean listener on unmount
    return () => window.removeEventListener('scroll', setLastVirtuosoState)
  }, [authorAddress])
  const lastVirtuosoState = lastVirtuosoStates?.[authorAddress]

  // always redirect to latest author cid
  useEffect(() => {
    if (authorAddress && lastCommentCid && commentCid && lastCommentCid !== commentCid) {
      navigate(`/u/${authorAddress}/c/${lastCommentCid}`, {replace: true})
    }
  }, [authorAddress, lastCommentCid, commentCid, navigate])

  return (
    <div>
      <AuthorInfo authorAddress={authorAddress} commentCid={commentCid} />
      <Virtuoso
        increaseViewportBy={{bottom: 1200, top: 600}}
        totalCount={authorComments?.length || 0}
        data={authorComments}
        itemContent={(index, post) => <FeedPost index={index} post={post} />}
        useWindowScroll={true}
        components={{Footer}}
        endReached={loadMore}
        ref={virtuosoRef}
        restoreStateFrom={lastVirtuosoState}
        initialScrollTop={lastVirtuosoState?.scrollTop}
      />
    </div>
  )
}

export default Author
