export const getPublicationType = (publication) => {
  if (!publication) {
    return
  }
  if (typeof publication.vote === 'number') {
    return 'vote'
  }
  if (publication.parentCid) {
    return 'reply'
  }
  if (publication.commentCid) {
    return 'edit'
  }
  return 'post'
}

export const getVotePreview = (publication) => {
 if (typeof publication?.vote !== 'number') {
    return ''
  }
  let votePreview = ''
  if (publication.vote === -1) {
    votePreview += ' -1'
  }
  else {
    votePreview += ` +${publication.vote}`
  }
  return votePreview
}

export const getPublicationPreview = (publication) => {
  if (!publication) {
    return ''
  }
  let publicationPreview = ''
  if (publication.title) {
    publicationPreview += publication.title
  }
  if (publication.content) {
    if (publicationPreview) {
      publicationPreview += ': '
    }
    publicationPreview += publication.content
  }
  if (!publicationPreview && publication.link) {
    publicationPreview += publication.link
  }

  if (publicationPreview.length > 300) {
    publicationPreview = publicationPreview.substring(0, 300) + '...'
  }
  return publicationPreview
}