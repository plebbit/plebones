import {useState, useEffect} from 'react'

let cache

const useDefaultSubplebbits = () => {
  const [subplebbits, setSubplebbits] = useState([])

  useEffect(() => {
    if (cache) {
      return
    }
    ;(async () => {
      try {
        const multisub = await fetch(
          'https://raw.githubusercontent.com/plebbit/temporary-default-subplebbits/master/multisub.json'
          // { cache: 'no-cache' }
        ).then((res) => res.json())
        cache = multisub.subplebbits
        setSubplebbits(multisub.subplebbits)
      } catch (e) {
        console.warn(e)
      }
    })()
  }, [])

  return cache || subplebbits
}

export default useDefaultSubplebbits
