import createStore from 'zustand'

const repliesSortTypes = ['nested', 'new', 'old', 'new (nested)', 'old (nested)']

const repliesSortTypesToUseRepliesOptions = {
  nested: {sortType: 'best', flat: false},
  new: {sortType: 'new', flat: true},
  old: {sortType: 'old', flat: true},
  'new (nested)': {sortType: 'new', flat: false},
  'old (nested)': {sortType: 'old', flat: false},
}

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
