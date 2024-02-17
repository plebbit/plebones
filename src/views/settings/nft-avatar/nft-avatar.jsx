import {useMemo, useState} from 'react'
import styles from './nft-avatar.module.css'
import {useAccount, setAccount, useAuthorAvatar} from '@plebbit/plebbit-react-hooks'

const NftAvatarPreview = ({avatar}) => {
  const account = useAccount()
  let author = useMemo(() => ({...account?.author, avatar}), [account, avatar])

  // if avatar already set, and user hasn't typed anything yet, preview already set author
  if (account?.author?.avatar && !avatar?.chainTicker && !avatar?.address && !avatar?.id && !avatar?.signature) {
    author = account.author
  }

  const {imageUrl, state, error} = useAuthorAvatar({author})

  // not enough data to preview yet
  if (!author?.avatar?.address && !author?.avatar?.signature) {
    return
  }

  const stateText = state !== 'succeeded' ? `${state}...` : undefined

  return (
    <div>
      <div>avatar preview:</div>
      <img className={styles.nftAvatarPreviewImage} alt="" src={imageUrl} /> {stateText} {error?.message}
    </div>
  )
}

const getNftMessageToSign = (authorAddress, timestamp, tokenAddress, tokenId) => {
  let messageToSign = {}
  // the property names must be in this order for the signature to match
  // insert props one at a time otherwise babel/webpack will reorder
  messageToSign.domainSeparator = 'plebbit-author-avatar'
  messageToSign.authorAddress = authorAddress
  messageToSign.timestamp = timestamp
  messageToSign.tokenAddress = tokenAddress
  messageToSign.tokenId = String(tokenId) // must be a type string, not number
  // use plain JSON so the user can read what he's signing
  messageToSign = JSON.stringify(messageToSign)
  return messageToSign
}

const NftAvatarForm = ({account}) => {
  // force account to be defined to be able to use account as default values
  if (!account) {
    throw Error('NftAvatarForm account prop must be defined')
  }
  const authorAddress = account?.author?.address
  const [chainTicker, setChainTicker] = useState(account?.author?.avatar?.chainTicker)
  const [tokenAddress, setTokenAddress] = useState(account?.author?.avatar?.address)
  const [tokenId, setTokenId] = useState(account?.author?.avatar?.id)
  const [timestamp, setTimestamp] = useState(account?.author?.avatar?.timestamp)
  const [signature, setSignature] = useState(account?.author?.avatar?.signature?.signature)

  const copyMessageToSign = () => {
    if (!chainTicker) {
      return alert('missing chain ticker')
    }
    if (!tokenAddress) {
      return alert('missing token address')
    }
    if (!tokenId) {
      return alert('missing token id')
    }
    const newTimestamp = Math.floor(Date.now() / 1000)
    const messageToSign = getNftMessageToSign(authorAddress, newTimestamp, tokenAddress, tokenId)
    // update timestamp every time the user gets a new message to sign
    setTimestamp(newTimestamp)
    navigator.clipboard.writeText(messageToSign)
    alert(messageToSign)
  }

  // how to resolve and verify NFT signatures https://github.com/plebbit/plebbit-js/blob/master/docs/nft.md
  const avatar = {
    chainTicker: chainTicker?.toLowerCase() || account?.author?.avatar?.chainTicker,
    timestamp,
    address: tokenAddress || account?.author?.avatar?.address,
    id: tokenId || account?.author?.avatar?.id,
    signature: {
      signature: signature || account?.author?.avatar?.signature?.signature,
      type: 'eip191',
    },
  }

  const save = () => {
    if (!chainTicker) {
      return alert('missing chain ticker')
    }
    if (!tokenAddress) {
      return alert('missing token address')
    }
    if (!tokenId) {
      return alert('missing token id')
    }
    if (!signature) {
      return alert('missing signature')
    }
    setAccount({...account, author: {...account?.author, avatar}})
    alert(`saved`)
  }

  return (
    <>
      <div>
        <input onChange={(e) => setChainTicker(e.target.value)} defaultValue={account?.author?.avatar?.chainTicker} placeholder="chain ticker e.g. eth, matic..." />
        <input onChange={(e) => setTokenAddress(e.target.value)} defaultValue={account?.author?.avatar?.address} placeholder="token address e.g. 0x..." />
        <input onChange={(e) => setTokenId(e.target.value)} defaultValue={account?.author?.avatar?.id} placeholder="token id e.g. 1001" />
        <button onClick={copyMessageToSign}>copy message to sign</button>
        <div>
          go to{' '}
          <a href="https://etherscan.io/verifiedSignatures" target="_blank" rel="noreferrer">
            https://etherscan.io/verifiedSignatures
          </a>{' '}
          and sign, then paste signature
        </div>
      </div>
      <div>
        <input onChange={(e) => setSignature(e.target.value)} defaultValue={account?.author?.avatar?.signature?.signature} placeholder="signature e.g. 0x..." />
        <button onClick={save}>save</button>
      </div>
      {chainTicker && tokenAddress && <NftAvatarPreview avatar={avatar} />}
    </>
  )
}

const NftAvatar = () => {
  const account = useAccount()
  if (!account) {
    return (
      <div>
        <div>avatar:</div>
      </div>
    )
  }
  return (
    <div>
      <div>avatar:</div>
      <NftAvatarForm account={account} />
    </div>
  )
}

export default NftAvatar
