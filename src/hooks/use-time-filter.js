import assert from 'assert'

// the timestamp the last time the user visited
const lastVisitTimestamp = localStorage.getItem('plebonesLastVisitTimestamp')

// TODO: remove debug, test setting some older date in console
// localStorage.setItem('plebonesLastVisitTimestamp', Date.now() - 20 * 24 * 60 * 60 * 1000)
console.log('lastVisitTimestamp', lastVisitTimestamp, ((Date.now() - lastVisitTimestamp) / (60 * 60 * 1000)).toFixed(2) + ' hours ago')

// update the last visited timestamp every n seconds
setInterval(() => {
  localStorage.setItem('plebonesLastVisitTimestamp', Date.now())
}, 60 * 1000)

const timeFilters = {
  '1h': (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60,
  '12h': (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 12,
  '24h': (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 24,
  '48h': (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 24 * 2,
  week: (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 24 * 7,
  month: (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 24 * 30,
  year: (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 24 * 365,
  '1h-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60,
  '12h-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 12,
  '24h-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 24,
  '48h-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 24 * 2,
  'week-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 24 * 7,
  'month-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 24 * 30,
  'year-active': (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 24 * 365,
  all: undefined,
}

// calculate the last visit filter
const secondsSinceLastVisit = lastVisitTimestamp ? (Date.now() - lastVisitTimestamp) / 1000 : Infinity
const day = 24 * 60 * 60
let lastVisitTimeFilterName
if (secondsSinceLastVisit > 30 * day) {
  lastVisitTimeFilterName = 'month'
  timeFilters[lastVisitTimeFilterName] = timeFilters['month']
  timeFilters[`${lastVisitTimeFilterName}-active`] = timeFilters['month-active']
} else if (secondsSinceLastVisit > 7 * day) {
  const weeks = Math.ceil(secondsSinceLastVisit / day / 7)
  lastVisitTimeFilterName = `${weeks}w`
  timeFilters[lastVisitTimeFilterName] = (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 24 * 7 * weeks
  timeFilters[`${lastVisitTimeFilterName}-active`] = (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 24 * 7 * weeks
} else if (secondsSinceLastVisit > day) {
  const days = Math.ceil(secondsSinceLastVisit / day)
  lastVisitTimeFilterName = `${days}d`
  timeFilters[lastVisitTimeFilterName] = (comment) => comment.timestamp > Date.now() / 1000 - 60 * 60 * 24 * days
  timeFilters[`${lastVisitTimeFilterName}-active`] = (comment) => (comment.lastReplyTimestamp || comment.timestamp) > Date.now() / 1000 - 60 * 60 * 24 * days
} else {
  lastVisitTimeFilterName = '24h'
  timeFilters[lastVisitTimeFilterName] = timeFilters['24h']
  timeFilters[`${lastVisitTimeFilterName}-active`] = timeFilters['24h-active']
}

const timeFilterNames = [lastVisitTimeFilterName, '1h', '12h', '24h', '48h', 'week', 'month', 'year', 'all']

const useTimeFilter = (sortType, timeFilterName) => {
  // the default time filter is the last visit time filter
  if (!timeFilterName) {
    timeFilterName = lastVisitTimeFilterName
  }

  assert(!sortType || typeof sortType === 'string', `useTimeFilter sortType argument '${sortType}' not a string`)
  assert(!timeFilterName || typeof timeFilterName === 'string', `useTimeFilter timeFilterName argument '${timeFilterName}' not a string`)
  const timeFilter = sortType === 'active' ? timeFilters[timeFilterName + '-active'] : timeFilters[timeFilterName]
  assert(!timeFilterName || timeFilterName === 'all' || timeFilter !== undefined, `useTimeFilter no filter for timeFilterName '${timeFilterName}'`)
  return {timeFilter, timeFilterNames}
}

export default useTimeFilter
