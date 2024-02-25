import useDefaultSubplebbits from './use-default-subplebbits.js'
import {useMemo} from 'react'

const useDefaultSubplebbitAddresses = () => {
  const defaultSubplebbits = useDefaultSubplebbits()
  return useMemo(() => defaultSubplebbits.map((subplebbit) => subplebbit.address), [defaultSubplebbits])
}

export default useDefaultSubplebbitAddresses
