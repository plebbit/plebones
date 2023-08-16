import {useNotifications, useAccount} from '@plebbit/plebbit-react-hooks'
import { useRef, useEffect } from 'react'
import { Virtuoso } from 'react-virtuoso'
import FeedPost from '../../components/feed-post'
import styles from './inbox.module.css'

let lastVirtuosoState

function Inbox() {
  const {notifications, markAsRead} = useNotifications()
  const unreadNotificationCount = useAccount()?.unreadNotificationCount

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

  if (!notifications.length) {
    return 'empty'
  }

  return (
    <div>
      <button onClick={markAsRead} disabled={!unreadNotificationCount} className={styles.markAsReadButton}>mark as read</button>
      <Virtuoso
        increaseViewportBy={ { bottom: 600, top: 600 } }
        totalCount={ notifications?.length || 0 }
        data={ notifications }
        style={ { maxWidth: '100%' } }
        itemContent={(index, notification) => <div className={notification.markedAsRead === false ? styles.unreadNotification : styles.readNotification}><FeedPost index={index} post={notification} /></div>}
        useWindowScroll={ true }
        ref={virtuosoRef}
        restoreStateFrom={lastVirtuosoState}
        initialScrollTop={lastVirtuosoState?.scrollTop}
      />

    </div>
  )
}

export default Inbox
