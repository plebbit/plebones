export const isLink = (content) => {
  if (!content) {
    return false
  }
  content = content.trim()
  if (
    // starts with https://
    /^https:\/\//i.test(content) && 
    // doesn't contain spaces or line breaks
    !/[ \n]/.test(content)
  ) {
    return true
  }
  return false
}
