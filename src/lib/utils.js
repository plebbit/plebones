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
  } 
  catch (e) {
    return
  }
  if (mime?.startsWith('image')) return 'image'
  if (mime?.startsWith('video')) return 'video'
  if (mime?.startsWith('audio')) return 'audio'
}
export const getCommentLinkMediaType = memoize(getCommentLinkMediaTypeNoCache, {max: 1000})

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')
export const getFormattedTime = (timestamp) => {
  try {
    return timeAgo.format(timestamp * 1000)
  }
  catch (e) {}
}

export const alertChallengeVerificationFailed = (challengeVerification, publication) => {
  if (challengeVerification?.challengeSuccess === false ) {
    console.error(challengeVerification, publication)
    alert(`p/${publication?.subplebbitAddress} challenge error: ${[...(challengeVerification?.challengeErrors || []), challengeVerification?.reason].join(' ')}`)
  }
  else {
    console.log(challengeVerification, publication)
  }
}

const utils = {
  getCommentLinkMediaType,
  getFormattedTime,
  alertChallengeVerificationFailed
}

export default utils
