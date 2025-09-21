import {useState} from 'react'
import {useAccount, setAccount} from '@plebbit/plebbit-react-hooks'

const getWalletMessageToSign = (authorAddress, timestamp) => {
  // use plain JSON so the user can read what he's signing
  // property names must always be in this order for signature to match so don't use JSON.stringify
  return `{"domainSeparator":"plebbit-author-wallet","authorAddress":"${authorAddress}","timestamp":${timestamp}}`
}

const CryptoWalletsForm = ({account}) => {
  // force account to be defined to be able to use account as default values
  if (!account) {
    throw Error('CryptoWalletsForm account prop must be defined')
  }
  const authorAddress = account?.author?.address
  const defaultWalletsArray = Object.keys(account?.author?.wallets || {}).map((chainTicker) => ({
    chainTicker,
    address: account?.author?.wallets?.[chainTicker]?.address,
    timestamp: account?.author?.wallets?.[chainTicker]?.timestamp,
    signature: account?.author?.wallets?.[chainTicker]?.signature?.signature,
  }))
  if (!defaultWalletsArray.length) {
    defaultWalletsArray.push({})
  }
  const [walletsArray, setWalletsArray] = useState(defaultWalletsArray)
  const setWalletsArrayProperty = (index, property, value) => {
    const newArray = [...walletsArray]
    newArray[index] = {...newArray[index], [property]: value}
    setWalletsArray(newArray)
  }

  const walletsInputs = walletsArray.map((wallet, index) => {
    const blockExplorerUrl = wallet.chainTicker === 'sol' ? 'https://solscan.io/verifiedsignatures' : 'https://etherscan.io/verifiedSignatures'
    return (
      <div>
        <input onChange={(e) => setWalletsArrayProperty(index, 'chainTicker', e.target.value)} value={wallet.chainTicker} placeholder="chain ticker e.g. eth, matic..." />
        <input onChange={(e) => setWalletsArrayProperty(index, 'address', e.target.value)} value={wallet.address} placeholder="wallet address e.g. 0x..." />
        <button
          onClick={() => {
            if (!wallet.chainTicker) {
              return alert('missing chain ticker')
            }
            if (!wallet.address) {
              return alert('missing address')
            }
            const timestamp = wallet.timestamp || Math.floor(Date.now() / 1000)
            const messageToSign = getWalletMessageToSign(authorAddress, timestamp)

            // if timestamp changed, update it so it gets saved properly
            if (timestamp !== wallet.timestamp) {
              setWalletsArrayProperty(index, 'timestamp', timestamp)
            }

            navigator.clipboard.writeText(messageToSign)
            alert(messageToSign)
          }}
        >
          copy message to sign
        </button>
        <input onChange={(e) => setWalletsArrayProperty(index, 'signature', e.target.value)} value={wallet.signature} placeholder="signature e.g. 0x..." />
        <div>
          go to{' '}
          <a href={blockExplorerUrl} target="_blank" rel="noreferrer">
            {blockExplorerUrl}
          </a>{' '}
          and sign, then paste signature
        </div>
      </div>
    )
  })

  const save = () => {
    const wallets = {}
    for (const wallet of walletsArray) {
      if (!wallet.chainTicker) {
        continue
      }
      if (!wallet.address) {
        return alert(`${wallet.chainTicker} missing address`)
      }
      if (!wallet.signature) {
        return alert(`${wallet.chainTicker} missing signature`)
      }
      if (!wallet.timestamp) {
        return alert(`${wallet.chainTicker} missing timestamp, must click "copy message to sign" again and resign`)
      }
      const type = wallet.chainTicker === 'sol' ? 'sol' : 'eip191'
      wallets[wallet.chainTicker] = {
        address: wallet.address,
        timestamp: wallet.timestamp,
        signature: {
          signature: wallet.signature,
          type,
        },
      }
    }
    setAccount({...account, author: {...account?.author, wallets}})
    alert(`saved`)
  }

  return (
    <>
      {walletsInputs}
      <button onClick={() => setWalletsArray([...walletsArray, {}])}>+add</button>
      <button onClick={save}>save</button>
    </>
  )
}

const CryptoWallets = () => {
  const account = useAccount()
  if (!account) {
    return (
      <div>
        <div>wallets:</div>
      </div>
    )
  }
  return (
    <div>
      <div>wallets:</div>
      <CryptoWalletsForm account={account} />
    </div>
  )
}

export default CryptoWallets
