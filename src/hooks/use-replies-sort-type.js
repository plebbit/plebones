import createStore from 'zustand'

const repliesPerPage = 50
const repliesSortTypesToUseRepliesOptions = {
  nested: {sortType: 'best', flat: false, repliesPerPage, accountComments: {newerThan: Infinity, append: false}},
  flat: {sortType: 'old', flat: true, repliesPerPage, accountComments: {newerThan: Infinity, append: true}}, // appending is more common when sorting by old
  new: {sortType: 'new', flat: false, repliesPerPage, accountComments: {newerThan: Infinity, append: false}},
  newflat: {sortType: 'new', flat: true, repliesPerPage, accountComments: {newerThan: Infinity, append: false}},
}
const repliesSortTypes = Object.keys(repliesSortTypesToUseRepliesOptions)

const useRepliesSortTypeStore = createStore((setState, getState) => ({
  repliesSortType: localStorage.getItem('plebonesRepliesSortType') || 'nested',
  setRepliesSortType: (repliesSortType) => {
    setState((state) => ({repliesSortType}))
    localStorage.setItem('plebonesRepliesSortType', repliesSortType)
  },
}))

const useRepliesSortType = () => {
  const {repliesSortType, setRepliesSortType} = useRepliesSortTypeStore()
  return {repliesSortType, repliesSortTypes, setRepliesSortType, useRepliesOptions: repliesSortTypesToUseRepliesOptions[repliesSortType]}
}

export default useRepliesSortType
