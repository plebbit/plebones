import { useMemo, useRef, useEffect } from 'react'
import {useFeed, useSubplebbit, useSubplebbitStats, useSubscribe} from '@plebbit/plebbit-react-hooks'
import { Virtuoso } from 'react-virtuoso'
import FeedPost from '../../components/feed-post'
import {useParams} from 'react-router-dom'
import styles from './subplebbit.module.css'
import {Link} from 'react-router-dom'

const SubplebbitInfo = ({subplebbitAddress}) => {
  const subplebbit = useSubplebbit({subplebbitAddress})
  const stats = useSubplebbitStats({subplebbitAddress})
  const {subscribed, subscribe, unsubscribe} = useSubscribe({subplebbitAddress})
  const toggleSubscribe = () => !subscribed ? subscribe() : unsubscribe()

  let description = subplebbit?.title || ''
  if (subplebbit?.description) {
    if (description) {
      description += ': '
    }
    description += subplebbit?.description || ''
  }
  description = description.trim()

  return <div className={styles.info}>
    <div className={styles.header}>
      <div className={styles.title}><Link to={`/p/${subplebbitAddress}`}>{subplebbitAddress}</Link><img alt='' className={styles.avatar} src={subplebbit?.suggested?.avatarUrl} /></div>
      <div className={styles.stats}><button onClick={toggleSubscribe}className={styles.joinButton}>{!subscribed ? 'join' : 'leave'}</button> {stats.allActiveUserCount} members</div>
      <div className={styles.stats}>{stats.hourActiveUserCount} users here now</div>
    </div>
    {description && <div className={styles.description}>{description}</div>}
    {subplebbit.rules && <ol className={styles.rules}>{subplebbit.rules.map?.(rule => <li>{rule?.trim?.()}</li>)}</ol>}
  </div>
}

const lastVirtuosoStates = {}

const Loading = () => 'loading...'

function Subplebbit() {
  const params = useParams()
  const subplebbitAddress = params.subplebbitAddress
  const subplebbitAddresses = useMemo(() => [subplebbitAddress], [subplebbitAddress])
  const sortType = params?.sortType || 'hot'
  const {feed, hasMore, loadMore} = useFeed({subplebbitAddresses, sortType})

  const Footer = hasMore ? Loading : undefined

  // save last virtuoso state on each scroll
  const virtuosoRef = useRef()
  useEffect(() => {
    const setLastVirtuosoState = () => virtuosoRef.current?.getState((snapshot) => {
      // TODO: not sure if checking for empty snapshot.ranges works for all scenarios
      if (snapshot?.ranges?.length) {
        if (!lastVirtuosoStates[subplebbitAddress]) {
          lastVirtuosoStates[subplebbitAddress] = {}
        }
        lastVirtuosoStates[subplebbitAddress][sortType] = snapshot
      }
    })
    // TODO: doesn't work if the user hasn't scrolled
    window.addEventListener('scroll', setLastVirtuosoState)
    // clean listener on unmount
    return () => window.removeEventListener('scroll', setLastVirtuosoState)
  }, [subplebbitAddress, sortType])
  const lastVirtuosoState = lastVirtuosoStates?.[subplebbitAddress]?.[sortType]

  return (
    <div>
      <SubplebbitInfo subplebbitAddress={subplebbitAddress} />
      <Virtuoso
        increaseViewportBy={ { bottom: 600, top: 600 } }
        totalCount={ feed?.length || 0 }
        data={ feed }
        style={ { maxWidth: '100%' } }
        itemContent={(index, post) => <FeedPost index={index} post={post} />}
        useWindowScroll={ true }
        components={ {Footer} }
        endReached={ loadMore }
        ref={virtuosoRef}
        restoreStateFrom={lastVirtuosoState}
        initialScrollTop={lastVirtuosoState?.scrollTop}
      />

    </div>
  )
}

export default Subplebbit
