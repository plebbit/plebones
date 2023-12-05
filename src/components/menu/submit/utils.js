import {useAccount} from '@plebbit/plebbit-react-hooks'
import useDefaultSubplebbits from '../../../hooks/use-default-subplebbits'
import {getShortAddress} from '@plebbit/plebbit-js'
import {useMemo} from 'react'
import {useParams} from 'react-router-dom'

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
    // add subplebbits from subscriptions
    for (const address of account.subscriptions) {
      subplebbits[address] = {address, displayAddress: address}
    }
    // add default subplebbits
    for (const address of defaultSubplebbits) {
      subplebbits[address] = {address, displayAddress: address}
    }
    // add title to display address if not crypto name
    for (const subplebbitAddress in subplebbits) {
      if (!subplebbitAddress.includes('.')) {
        subplebbits[subplebbitAddress].displayAddress = getShortAddress(subplebbitAddress)
        if (subplebbits[subplebbitAddress].title) {
          subplebbits[subplebbitAddress].displayAddress += ` ${subplebbits[subplebbitAddress].title}`
        }
        if (subplebbits[subplebbitAddress].displayAddress.length > 40) {
          subplebbits[subplebbitAddress].displayAddress = subplebbits[subplebbitAddress].displayAddress.substring(0, 40) + '...'
        }
      }
    }
    return Object.values(subplebbits)
  }, [account.subscriptions, defaultSubplebbits, subplebbitAddressParam])
}
