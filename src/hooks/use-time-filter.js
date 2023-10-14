import assert from 'assert'

const timeFilters = {
  '1h': (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60,
  '12h': (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 12,
  '24h': (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 24,
  '48h': (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 24 * 2,
  '1w': (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 24 * 7,
  '1m': (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 24 * 30,
  '1y': (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 24 * 365,
  '1h-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60,
  '12h-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 12,
  '24h-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 24,
  '48h-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 24 * 2,
  '1w-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 24 * 7,
  '1m-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 24 * 30,
  '1y-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 24 * 365,
  all: undefined,
}

const timeFilterNames = ['1h', '12h', '24h', '48h', '1w', '1m', '1y', 'all']

const useTimeFilter = (sortType, timeFilterName) => {
  assert(!sortType || typeof sortType === 'string', `useTimeFilterStore setTimeFilter sortType argument '${sortType}' not a string`)
  assert(!timeFilterName || typeof timeFilterName === 'string', `useTimeFilterStore setTimeFilter timeFilterName argument '${timeFilterName}' not a string`)
  const timeFilter = sortType === 'active' ? timeFilters[timeFilterName + '-active'] : timeFilters[timeFilterName]
  return {timeFilter, timeFilterNames}
}

export default useTimeFilter
