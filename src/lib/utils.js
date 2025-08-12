import extName from 'ext-name'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import memoize from 'memoizee'

// cache media type because it takes on average 5ms
const getCommentLinkMediaTypeNoCache = (link) => {
  if (!link) return
  let mime
  try {
    mime = extName(new URL(link).pathname.toLowerCase().replace('/', ''))[0]?.mime
  } catch (e) {
    return
  }
  if (mime?.startsWith('image')) return 'image'
  if (mime?.startsWith('video')) return 'video'
  if (mime?.startsWith('audio')) return 'audio'
}
const getCommentLinkMediaType = memoize(getCommentLinkMediaTypeNoCache, {max: 1000})

export const getCommentMediaType = (comment) => {
  if (!comment?.link) return
  if (comment.linkHtmlTagName === 'img') return 'image'
  if (comment.linkHtmlTagName === 'video') return 'video'
  if (comment.linkHtmlTagName === 'audio') return 'audio'
  // never cache getCommentMediaType, only cache getCommentLinkMediaType
  // which uses extName because it's slow
  return getCommentLinkMediaType(comment.link)
}

// plebones catalog is image/video only, not including thumbnail urls
export const catalogFilter = (comment) => {
  const mediaType = getCommentMediaType(comment)
  return mediaType === 'image' || mediaType === 'video'
}

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')
export const getFormattedTime = (timestamp) => {
  try {
    return timeAgo.format(timestamp * 1000)
  } catch (e) {}
}

export const alertChallengeVerificationFailed = (challengeVerification, publication) => {
  if (challengeVerification?.challengeSuccess === false) {
    console.warn(challengeVerification, publication)

    alert(
      `p/${publication?.subplebbitAddress} challenge errors: ${[...Object.values(challengeVerification?.challengeErrors || {}), challengeVerification?.reason].join(' ')}`
    )
  } else {
    console.log(challengeVerification, publication)
  }
}

const utils = {
  getCommentMediaType,
  catalogFilter,
  getFormattedTime,
  alertChallengeVerificationFailed,
}

export default utils
