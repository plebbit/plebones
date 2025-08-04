import {useState, useEffect} from 'react'

let cache, pending

const useDefaultSubplebbits = () => {
  const [subplebbits, setSubplebbits] = useState([])

  useEffect(() => {
    if (cache || pending) {
      return
    }
    pending = true
    ;(async () => {
      try {
        const multisub = await fetch(
          'https://raw.githubusercontent.com/plebbit/lists/master/default-multisub.json',
          // { cache: 'no-cache' }
        ).then((res) => res.json())
        cache = multisub.subplebbits
        setSubplebbits(multisub.subplebbits)
      } catch (e) {
        console.warn(e)
      }
      pending = false
    })()
  }, [])

  return cache || subplebbits
}

export default useDefaultSubplebbits
