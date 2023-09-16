import {useState, useEffect} from 'react'

let cache

const useDefaultSubplebbits = () => {
  const [value, setValue] = useState([])

  useEffect(() => {
    if (cache) {
      return
    }
    ;(async () => {
      try {
        const value = await fetch(
          'https://raw.githubusercontent.com/plebbit/temporary-default-subplebbits/master/subplebbits.json'
          // { cache: 'no-cache' }
        ).then((res) => res.json())
        cache = value
        setValue(value)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  return cache || value
}

export default useDefaultSubplebbits
