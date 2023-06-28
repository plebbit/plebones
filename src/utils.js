import extName from 'ext-name'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

export const getCommentMediaInfo = (post) => {
  let mime
  if (!post?.link) {
    return
  }
  try {
    mime = extName(new URL(post?.link).pathname.replace('/', ''))[0]?.mime
  } catch (error) {

  }
  if (mime?.startsWith('image')) {
    return {
      url: post?.link,
      type: 'image',
    }
  }
  if (mime?.startsWith('video')) {
    return {
      url: post?.link,
      type: 'video',
    }
  }
  if (mime?.startsWith('audio')) {
    return {
      url: post?.link,
      type: 'audio',
    }
  }
}

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')
export const getFormattedTime = (timestamp) => {
  try {
    return timeAgo.format(timestamp * 1000)
  }
  catch (e) {}
}

const utils = {
  getCommentMediaInfo,
  getFormattedTime
}

export default utils
