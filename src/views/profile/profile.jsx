import {useRef, useEffect} from 'react'
import {useAccountComments, useAccount} from '@plebbit/plebbit-react-hooks'
import { Virtuoso } from 'react-virtuoso'
import FeedPost from './feed-post'
import styles from './profile.module.css'

const ProfileInfo = () => {
  const account = useAccount()
  const postScore = account?.karma?.postScore
  const replyScore = account?.karma?.replyScore

  return <div className={styles.info}>
      <div><span className={styles.scoreNumber}>{postScore}</span> post karma</div>
      <div><span className={styles.scoreNumber}>{replyScore}</span> reply karma</div>
  </div>
}

let lastVirtuosoState

function Profile() {
  let {accountComments} = useAccountComments()
  accountComments = [...accountComments].reverse()

  // save last virtuoso state on each scroll
  const virtuosoRef = useRef()
  useEffect(() => {
    const setLastVirtuosoState = () => virtuosoRef.current?.getState((snapshot) => {
      // TODO: not sure if checking for empty snapshot.ranges works for all scenarios
      if (snapshot?.ranges?.length) {
        lastVirtuosoState = snapshot
      }
    })
    window.addEventListener('scroll', setLastVirtuosoState)
    // clean listener on unmount
    return () => window.removeEventListener('scroll', setLastVirtuosoState)
  }, [])

  if (!accountComments.length) {
    return 'no posts'
  }

  return (
    <div>
      <ProfileInfo />
      <Virtuoso
        increaseViewportBy={ { bottom: 600, top: 600 } }
        totalCount={ accountComments?.length || 0 }
        data={ accountComments }
        style={ { maxWidth: '100%' } }
        itemContent={(index, post) => <FeedPost index={index} post={post} />}
        useWindowScroll={ true }
        ref={virtuosoRef}
        restoreStateFrom={lastVirtuosoState}
        initialScrollTop={lastVirtuosoState?.scrollTop}
      />

    </div>
  )
}

export default Profile
