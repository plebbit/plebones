import {useMemo, useState, useEffect} from 'react'
import styles from './settings.module.css'
import {useAccount, setAccount, deleteAccount, useResolvedAuthorAddress} from '@plebbit/plebbit-react-hooks'
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
      <AccountSettings />
    </div>
  )
}

export default Settings
