import createStore from 'zustand'

const repliesSortTypesToUseRepliesOptions = {
  nested: {sortType: 'best', flat: false},
  flat: {sortType: 'old', flat: true},
  new: {sortType: 'new', flat: false},
  newflat: {sortType: 'new', flat: true},
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
