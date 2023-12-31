import {Link} from 'react-router-dom'
import {Fragment} from 'react'
import utils from '../../../lib/utils'
import styles from './subplebbit.module.css'
import Arrow from '../../../components/icons/arrow'
import {useBlock, useSubplebbitStats} from '@plebbit/plebbit-react-hooks'
import useUpvote from '../../../hooks/use-upvote'
import useDownvote from '../../../hooks/use-downvote'

const SubplebbitMedia = ({mediaType, mediaUrl, link}) => {
  if (!mediaType) {
    return <div className={styles.noMedia}></div>
  }
  if (mediaType === 'image') {
    return (
      <div className={styles.mediaWrapper}>
        <Link to={link}>
          <img className={styles.media} src={mediaUrl} alt="" />
        </Link>
      </div>
    )
  }
  if (mediaType === 'video') {
    return (
      <div className={styles.mediaWrapper}>
        <Link to={link}>
          <video className={styles.media} controls={true} autoPlay={false} src={mediaUrl} />
        </Link>
      </div>
    )
  }
  if (mediaType === 'audio') {
    return (
      <Link to={link}>
        <audio controls={true} autoPlay={false} src={mediaUrl} />
      </Link>
    )
  }
  return <div className={styles.noMedia}></div>
}

const Subplebbit = ({subplebbit, index}) => {
  const stats = useSubplebbitStats({subplebbitAddress: subplebbit?.address})

  const mediaUrl = subplebbit?.suggested?.avatarUrl || subplebbit?.suggested?.bannerUrl
  const mediaType = mediaUrl ? 'image' : undefined

  const subplebbitLink = `/p/${subplebbit?.address}`
  const subplebbitSettingsLink = `${subplebbitLink}/settings`

  const {blocked: hidden} = useBlock({address: subplebbit?.address})

  const [upvoted] = useUpvote(subplebbit)
  const [downvoted] = useDownvote(subplebbit)

  let scoreNumber = subplebbit?.upvoteCount - subplebbit?.downvoteCount
  const negativeScoreNumber = scoreNumber < 0
  const largeScoreNumber = String(scoreNumber).length > 3
  if (isNaN(scoreNumber)) {
    scoreNumber = '-'
  }

  const labels = []
  // add created time as a label
  if (subplebbit?.createdAt) {
    labels.push(utils.getFormattedTime(subplebbit.createdAt).replace(' ago', ''))
  }
  // if you have a role, add it
  if (subplebbit?.role?.role) {
    labels.push(subplebbit.role.role)
  }

  let subplebbitAddress
  let title = subplebbit?.title?.trim?.()?.substring?.(0, 300)
  if (title) {
    subplebbitAddress = `p/${subplebbit?.shortAddress}`
  } else {
    title = subplebbit?.address
  }

  return (
    <div className={styles.feedPost}>
      <div className={styles.textWrapper}>
        <div className={styles.column}>
          <div className={styles.score}>
            <div className={[styles.upvote, upvoted ? styles.voteSelected : undefined].join(' ')}>
              <Arrow />
            </div>
            <div
              className={[styles.scoreNumber, largeScoreNumber ? styles.largeScoreNumber : undefined, negativeScoreNumber ? styles.negativeScoreNumber : undefined].join(
                ' '
              )}
            >
              {scoreNumber}
            </div>
            <div className={[styles.downvote, downvoted ? styles.voteSelected : undefined].join(' ')}>
              <Arrow />
            </div>
          </div>
        </div>
        <div className={[styles.secondColumn, hidden ? styles.hidden : undefined].join(' ')}>
          <div className={hidden || subplebbit?.removed ? styles.hidden : undefined}>
            <SubplebbitMedia mediaType={mediaType} mediaUrl={mediaUrl} link={subplebbitLink} />
          </div>
          <div className={styles.header}>
            <Link to={subplebbitLink} className={styles.title}>
              {title}
            </Link>
            {labels.map((label) => (
              <Fragment key={label}>
                {' '}
                <span className={styles.label}>{label}</span>
              </Fragment>
            ))}
            {subplebbitAddress && <Link to={subplebbitLink}> {subplebbitAddress}</Link>}
          </div>
          <div className={styles.content}>{subplebbit?.description?.substring?.(0, 300)}</div>
          <div className={styles.footer}>
            <Link to={subplebbitLink} className={[styles.button, styles.replyCount].join(' ')}>
              {stats.allPostCount} posts
            </Link>
            <Link to={subplebbitLink} className={[styles.button, styles.replyCount].join(' ')}>
              {stats.allActiveUserCount} users
            </Link>
            <Link to={subplebbitSettingsLink} className={[styles.button, styles.replyCount].join(' ')}>
              edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Subplebbit
