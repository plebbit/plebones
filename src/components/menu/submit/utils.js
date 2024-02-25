import {useAccount} from '@plebbit/plebbit-react-hooks'
import useDefaultSubplebbits from '../../../hooks/use-default-subplebbits.js'
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js'
import {useMemo} from 'react'
import {useParams} from 'react-router-dom'
const {getShortAddress} = Plebbit

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
  const {subplebbitAddress: subplebbitAddressParam} = useParams()
  const account = useAccount()
  const defaultSubplebbits = useDefaultSubplebbits()
  return useMemo(() => {
    const subplebbits = {}
    // add subplebbit from params first so easily visible
    if (subplebbitAddressParam) {
      subplebbits[subplebbitAddressParam] = {address: subplebbitAddressParam, displayAddress: subplebbitAddressParam}
    }
    for (const address of account.subscriptions) {
      subplebbits[address] = {address, displayAddress: getShortAddress(address)}
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
  }, [account.subscriptions, defaultSubplebbits, subplebbitAddressParam])
}
