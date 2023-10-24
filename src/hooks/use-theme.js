import createStore from 'zustand'

const useThemeStore = createStore((setState, getState) => ({
  theme: localStorage.getItem('plebonesTheme') || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('plebonesTheme', theme)
    setState((state) => ({theme}))
  },
}))

const useTheme = () => {
  const {theme, setTheme} = useThemeStore()
  return [theme, setTheme]
}

export default useTheme
