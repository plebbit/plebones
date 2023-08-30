import {useMemo} from 'react'

const useFeedStateString = (subplebbits) => {
  return useMemo(() => {
    const getClientHost = (clientUrl) => {
      try {
        clientUrl = new URL(clientUrl).hostname || clientUrl
      }
      catch (e) {}
      return clientUrl
    }
    const getClientUrls = (regex) => {
      const clientUrls = new Set()
      const addClientUrl = (client, clientUrl) => client?.state?.match?.(regex) && clientUrls.add(getClientHost(clientUrl))
      for (const subplebbit of subplebbits) {
        for (const clientUrl in subplebbit?.clients?.ipfsGateways) {
          addClientUrl(subplebbit.clients.ipfsGateways[clientUrl], clientUrl)
        }
        for (const clientUrl in subplebbit?.clients?.ipfsClients) {
          addClientUrl(subplebbit.clients.ipfsClients[clientUrl], clientUrl)
        }
        for (const chainTicker in subplebbit?.clients?.chainProviders) {
          for (const clientUrl in subplebbit.clients.chainProviders[chainTicker]) {
            addClientUrl(subplebbit.clients.chainProviders[chainTicker][clientUrl], clientUrl)
          }
        }
        // find subplebbit pages states
        if (subplebbit?.posts?.clients) {
          for (const clientType in subplebbit.posts.clients) {
            for (const sortType in subplebbit.posts.clients[clientType]) {
              for (const clientUrl in subplebbit.posts.clients[clientType][sortType]) {
                addClientUrl(subplebbit.posts.clients[clientType][sortType][clientUrl], clientUrl)
              }
            }
          }
        }
      }
      return [...clientUrls]
    }

    if (!subplebbits) {
      return
    }

    const states = {}
    for (const subplebbit of subplebbits) {
      states[subplebbit?.updatingState] = (states[subplebbit?.updatingState] || 0) + 1
      // find subplebbit pages states
      for (const clientType in subplebbit?.posts?.clients) {
        for (const sortType in subplebbit.posts.clients[clientType]) {
          for (const clientUrl in subplebbit.posts.clients[clientType][sortType]) {
            const state = subplebbit.posts.clients[clientType][sortType][clientUrl].state
            states[state] = (states[state] || 0) + 1
          }
        }
      }
    }

    // e.g. infura.io: 2 resolving-address cloudflare-ipfs.com/ipfs.io: 2 fetching-ipns 1 fetching-ipfs
    let stateString = ''
    if (states['resolving-address']) {
      const clientUrls = getClientUrls(/address/)
      if (clientUrls.length) {
        stateString += `${clientUrls.join('/')}: ${states['resolving-address']} resolving-address`
      }
    }
    if (states['fetching-ipns'] || states['fetching-ipfs']) {
      if (stateString) {
        stateString += ' '
      }
      const clientUrls = getClientUrls(/ipfs|ipns/)
      if (clientUrls.length) {
        stateString += `${clientUrls.join('/')}: `
        if (states['fetching-ipns']) {
          stateString += `${states['fetching-ipns']} fetching-ipns`
        }
        if (states['fetching-ipfs']) {
          if (states['fetching-ipns']) {
            stateString += ' '
          }
          stateString += `${states['fetching-ipfs']} fetching-ipfs`
        }
      }
    }

    // if string is empty, return undefined instead
    return stateString || undefined
  }, [subplebbits])
}

export default useFeedStateString
