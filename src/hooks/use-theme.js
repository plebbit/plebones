import { useEffect, useState } from 'react'

const useTheme = () => {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const localTheme = localStorage.getItem('theme')
    if (localTheme) {
      setTheme(localTheme)
    }
  }, [])

  return [theme, setTheme]
}

export default useTheme
