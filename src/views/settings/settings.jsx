import {useMemo, useState, useEffect} from 'react'
import styles from './settings.module.css'
import {useAccount, setAccount, deleteAccount, useResolvedAuthorAddress, useAuthorAvatar} from '@plebbit/plebbit-react-hooks'
import stringify from 'json-stringify-pretty-compact'
import useTheme from '../../hooks/use-theme'
// import useSetting from '../../hooks/use-setting'

const Theme = () => {
  const [theme, setTheme] = useTheme()
  return (
    <div>
      <div>theme:</div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="dark">dark</option>
        <option value="light">light</option>
      </select>
    </div>
  )
}

const PlebonesSettings = () => {
  // const [nonImagesInCatalog, setNonImagesInCatalog] = useSetting('nonImagesInCatalog')

  return (
    <div className={styles.plebonesSettings}>
      {/*<div><input onChange={(e) => setNonImagesInCatalog(e.target.checked)} checked={nonImagesInCatalog} type='checkbox' id='nonImagesInCatalog'/ ><label for='nonImagesInCatalog'>non images in catalog</label></div>*/}
    </div>
  )
}

const AuthorAddress = () => {
  const account = useAccount()
  const {resolvedAddress, state, error} = useResolvedAuthorAddress({author: account?.author, cache: false})
  let helpText = ''
  if (resolvedAddress) {
    if (resolvedAddress === account?.signer?.address) {
      helpText = 'crypto name set correctly'
    } else {
      helpText = `failed: crypto name text record plebbit-author-address set to wrong address (set to ${resolvedAddress} instead of ${account?.signer?.address})`
    }
  }
  if (state === 'succeeded') {
    if (!resolvedAddress) {
      helpText = `failed: crypto name text record plebbit-author-address not set`
    }
  } else if (state === 'failed') {
    helpText = `failed resolving crypto name with error: ${error?.message}`
  } else {
    if (helpText) {
      helpText += ', '
    }
    helpText += state + '...'
  }

  // default ipfs author address, do nothing
  if (account?.author?.address?.startsWith('12D3KooW')) {
    helpText = undefined
  }

  const [inputValue, setInputValue] = useState()

  return (
    <div>
      <div>address:</div>
      <input defaultValue={account?.author?.address} onChange={(e) => setInputValue(e.target.value)} />
      <button onClick={() => setAccount({...account, author: {...account?.author, address: inputValue}})}>save</button> <span>{helpText}</span>
    </div>
  )
}

const getMessageToSign = (authorAddress, timestamp, tokenAddress, tokenId) => {
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

const NftAvatarPreview = ({avatar}) => {
  const account = useAccount()
  let author = useMemo(() => ({...account?.author, avatar}), [account, avatar])

  // if avatar already set, and user hasn't typed anything yet, preview already set author
  if (account?.author?.avatar && !avatar?.chainTicker && !avatar?.address && !avatar?.id && !avatar?.signature) {
    author = account.author
    console.log('using old avatar', author)
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

const NftAvatarWithAccount = ({account}) => {
  // force account to be defined to be able to use account as default values
  if (!account) {
    throw Error('NftAvatarWithAccount account must be defined')
  }
  const authorAddress = account?.author?.address
  const [chainTicker, setChainTicker] = useState(account?.author?.avatar?.chainTicker)
  const [tokenAddress, setTokenAddress] = useState(account?.author?.avatar?.address)
  const [tokenId, setTokenId] = useState(account?.author?.avatar?.id)
  const [timestamp, setTimestamp] = useState(account?.author?.avatar?.timestamp)
  const [signature, setSignature] = useState(account?.author?.avatar?.signature?.signature)

  const sign = () => {
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
    const messageToSign = getMessageToSign(authorAddress, newTimestamp, tokenAddress, tokenId)
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
  }

  return (
    <div>
      <div>avatar:</div>
      <div>
        <input onChange={(e) => setChainTicker(e.target.value)} defaultValue={account?.author?.avatar?.chainTicker} placeholder="chain ticker e.g. eth, matic..." />
        <input onChange={(e) => setTokenAddress(e.target.value)} defaultValue={account?.author?.avatar?.address} placeholder="token address e.g. 0x..." />
        <input onChange={(e) => setTokenId(e.target.value)} defaultValue={account?.author?.avatar?.id} placeholder="token id e.g. 1001" />
        <button onClick={sign}>copy message to sign</button>
        <div>
          go to{' '}
          <a href="https://etherscan.io/verifiedSignatures" target="_blank" rel="noreferrer">
            https://etherscan.io/verifiedSignatures
          </a>{' '}
          and sign, then paste signature below
        </div>
      </div>
      <div>
        <input onChange={(e) => setSignature(e.target.value)} defaultValue={account?.author?.avatar?.signature?.signature} placeholder="signature" />
        <button onClick={save}>save</button>
      </div>
      <NftAvatarPreview avatar={avatar} />
    </div>
  )
}

const NftAvatar = () => {
  const account = useAccount()
  if (!account) {
    return
  }
  return <NftAvatarWithAccount account={account} />
}

const AccountSettings = () => {
  const account = useAccount()
  const accountJson = useMemo(() => stringify({account: {...account, plebbit: undefined, karma: undefined, unreadNotificationCount: undefined}}), [account])

  const [text, setText] = useState('')

  // set the initial account json
  useEffect(() => {
    setText(accountJson)
  }, [accountJson])

  const saveAccount = async () => {
    try {
      const oldAccount = account
      const newAccount = JSON.parse(text).account
      // force keeping the same id, makes it easier to copy paste
      await setAccount({...newAccount, id: account?.id})
      alert(`saved`)

      // editing plebbitOptions requires a page reload
      if (JSON.stringify(oldAccount.plebbitOptions) !== JSON.stringify(newAccount.plebbitOptions)) {
        window.location.reload()
      }
    } catch (e) {
      console.warn(e)
      alert(`failed editing account: ${e.message}`)
    }
  }

  const _deleteAccount = (accountName) => {
    if (!accountName) {
      return
    }
    deleteAccount(accountName)
    console.log('deleting account...')
  }

  return (
    <div>
      <div>account:</div>
      <textarea onChange={(e) => setText(e.target.value)} autoCorrect="off" rows="32" value={text} />
      <button onClick={saveAccount}>save</button>
      <button onClick={() => _deleteAccount(account?.name)}>delete account u/{account?.author?.shortAddress?.toLowerCase?.().substring(0, 8) || ''}</button>
    </div>
  )
}

function Settings() {
  return (
    <div className={styles.settings}>
      <Theme />
      <PlebonesSettings />
      <AuthorAddress />
      <NftAvatar />
      <AccountSettings />
    </div>
  )
}

export default Settings
