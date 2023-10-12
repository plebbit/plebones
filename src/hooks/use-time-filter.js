import createStore from 'zustand'
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
const defaultTimeFilterName = 'all'

const useTimeFilterStore = createStore((setState, getState) => ({
  timeFilterName: defaultTimeFilterName,
  timeFilter: timeFilters[defaultTimeFilterName],
  setTimeFilter: (sortType, timeFilterName) =>
    setState(() => {
      assert(typeof sortType === 'string', `useTimeFilterStore setTimeFilter sortType argument '${sortType}' not a string`)
      assert(typeof timeFilterName === 'string', `useTimeFilterStore setTimeFilter timeFilterName argument '${timeFilterName}' not a string`)
      const timeFilter = sortType === 'active' ? timeFilters[timeFilterName + '-active'] : timeFilters[timeFilterName]
      assert(timeFilter, `useTimeFilterStore no filter for sortType '${sortType}' timeFilterName '${timeFilterName}'`)
      return {timeFilterName, timeFilter}
    }),
}))

export default useTimeFilterStore
