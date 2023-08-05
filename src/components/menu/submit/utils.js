import {useAccount} from '@plebbit/plebbit-react-hooks'
import useDefaultSubplebbits from '../../../hooks/use-default-subplebbits'
import {getShortAddress} from '@plebbit/plebbit-js'
import {useMemo} from 'react'

export const isLink = (content) => {
  if (!content) {
    return false
  }
  content = content.trim()
  if (
    // starts with https://
    /^https:\/\//i.test(content) && 
    // doesn't contain spaces or line breaks
    !/[ \n]/.test(content)
  ) {
    return true
  }
  return false
}

export const useDefaultAndSubscriptionsSubplebbits = () => {
  const account = useAccount()
  const defaultSubplebbits = useDefaultSubplebbits()
  return useMemo(() => {
    const subplebbits = {}
    for (const address of account.subscriptions) {
      subplebbits[address] = {address, displayAddress: address}
    }
    for (const subplebbit of defaultSubplebbits) {
      if (!subplebbit.address) {
        continue
      }
      subplebbits[subplebbit.address] = {address: subplebbit.address, displayAddress: subplebbit.address}
      if (!subplebbit.address.includes('.')) {
        subplebbits[subplebbit.address].displayAddress = getShortAddress(subplebbit.address)
        if (subplebbit.title) {
          subplebbits[subplebbit.address].displayAddress += ` ${subplebbit.title}`
        }
        if (subplebbits[subplebbit.address].displayAddress.length > 40) {
          subplebbits[subplebbit.address].displayAddress = subplebbits[subplebbit.address].displayAddress.substring(0, 40) + '...'
        }
      }
    }
    return Object.values(subplebbits)
    }, [account.subscriptions, defaultSubplebbits]
  )
}
