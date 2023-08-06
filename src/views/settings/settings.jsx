import { useMemo, useState, useEffect } from 'react'
import styles from './settings.module.css'
import {useAccount, setAccount, deleteAccount} from '@plebbit/plebbit-react-hooks'
import stringify from "json-stringify-pretty-compact"
import useTheme from '../../hooks/use-theme'

const Theme = () => {
  const [theme, setTheme] = useTheme()
  return <div>
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value='dark'>dark</option>
      <option value='light'>light</option>
    </select>
  </div>
}

function Settings() {
  const account = useAccount()
  const accountJson = useMemo(() => stringify({...account, plebbit: undefined, karma: undefined, unreadNotificationCount: undefined}), [account])

  const [text, setText] = useState('')

  // set the initial account json
  useEffect(() => {
    setText(accountJson)
  }, [accountJson])

  const saveAccount = async () => {
    try {
      const newAccount = JSON.parse(text)
      await setAccount(newAccount)
      alert(`saved`)
    }
    catch (e) {
      console.error(e)
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
    <div className={styles.settings}>
      <Theme />
      <textarea onChange={(e) => setText(e.target.value)} autocorrect='off' rows="32" value={text} />
      <button onClick={saveAccount}>save</button>
      <button onClick={() => _deleteAccount(account?.name)} >delete account u/{account?.author?.shortAddress?.toLowerCase?.().substring(0, 8) || ''}</button>
    </div>
  )
}

export default Settings
