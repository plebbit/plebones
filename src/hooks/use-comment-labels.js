import {useMemo} from 'react'

const useCommentLabels = (comment, editedCommentState) => {
  return useMemo(() => {
    let editLabel
    if (editedCommentState === 'succeeded') editLabel = 'edited'
    if (editedCommentState === 'pending') editLabel = 'pending edit'
    if (editedCommentState === 'failed') editLabel = 'failed edit'

    const commentLabels = []
    if (comment?.removed) commentLabels.push('removed')
    if (comment?.locked) commentLabels.push('locked')
    if (comment?.spoiler) commentLabels.push('spoiler')
    if (comment?.pinned) commentLabels.push('pinned')
    if (editLabel) commentLabels.push(editLabel)

    return commentLabels
  }, [comment, editedCommentState])
}

export default useCommentLabels
