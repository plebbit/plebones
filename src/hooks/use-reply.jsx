import {usePublishComment} from '@plebbit/plebbit-react-hooks'
import { useMemo } from "react"
import createStore from 'zustand'
import challengesStore from './use-challenges'

const {addChallenge} = challengesStore.getState()

const useReplyStore = createStore((setState, getState) => ({
  content: {},
  publishCommentOptions: {},
  setReplyStore: ({subplebbitAddress, parentCid, content}) => setState(state => {
    const parsedContent = parseContent(content)
    const publishCommentOptions = {
      subplebbitAddress,
      parentCid,
      content: parsedContent.content,
      link: parsedContent.link,
      onChallenge: (...args) => addChallenge(args),
      onChallengeVerification: console.log,
      onError: error => {
        console.error(error)
        alert(error.message)
      }
    }
    return {
      content: {...state.content, [parentCid]: content}, 
      publishCommentOptions: {...state.publishCommentOptions, [parentCid]: publishCommentOptions}
    }
  }),
  resetReplyStore: (parentCid) => setState(state => ({
    content: {...state.content, [parentCid]: undefined}, 
    publishCommentOptions: {...state.publishCommentOptions, [parentCid]: undefined}
  }))
}))

const useReply = ({subplebbitAddress, parentCid}) => {
  const content = useReplyStore(state => state.content[parentCid])
  const publishCommentOptions = useReplyStore(state => state.publishCommentOptions[parentCid])
  const setReplyStore = useReplyStore(state => state.setReplyStore)
  const resetReplyStore = useReplyStore(state => state.resetReplyStore)

  const setContent = useMemo(() => 
    (content) => setReplyStore({subplebbitAddress, parentCid, content}),
  [subplebbitAddress, parentCid, setReplyStore])

  const resetContent = useMemo(() => 
    () => resetReplyStore(parentCid),
  [parentCid, resetReplyStore])

  const {index, publishComment} = usePublishComment(publishCommentOptions)

  return {content, setContent, resetContent, replyIndex: index, publishReply: publishComment}
}

export default useReply

const parseContent = (content) => {
  const parsed = {}
  if (!content) {
    return parsed
  }

  // starts with https:// so contains link
  if (/^https:\/\//i.test(content)) {
    const separatorIndex = content.match(/[ \n]/)?.index

    // has both content and link
    if (separatorIndex) {
      parsed.link = content.substring(0, separatorIndex)
      const parsedContent = content.substring(separatorIndex)?.trim()
      // content isn't empty
      if (parsedContent) {
        parsed.content = parsedContent
      }
    }
    // only has link
    else {
      parsed.link = content
    }
  }
  else {
    parsed.content = content
  }
  return parsed
}