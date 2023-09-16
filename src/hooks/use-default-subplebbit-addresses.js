import useDefaultSubplebbits from './use-default-subplebbits'
import {useMemo} from 'react'

const useDefaultSubplebbitAddresses = () => {
  const defaultSubplebbits = useDefaultSubplebbits()
  return useMemo(() => defaultSubplebbits.map((subplebbit) => subplebbit.address), [defaultSubplebbits])
}

export default useDefaultSubplebbitAddresses
