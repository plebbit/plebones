import createStore from 'zustand'

const useFlatOrNestedStore = createStore((setState, getState) => ({
  flatOrNested: localStorage.getItem('plebonesFlatOrNested') || 'nested',
  toggleFlatOrNested: () => {
    if (getState().flatOrNested === 'nested') {
      localStorage.setItem('plebonesFlatOrNested', 'flat')
      setState((state) => ({flatOrNested: 'flat'}))
    } else {
      localStorage.setItem('plebonesFlatOrNested', 'nested')
      setState((state) => ({flatOrNested: 'nested'}))
    }
  },
}))

const useFlatOrNested = () => {
  const {flatOrNested, toggleFlatOrNested} = useFlatOrNestedStore()
  return [flatOrNested, toggleFlatOrNested]
}

export default useFlatOrNested
