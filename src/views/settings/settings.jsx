import { useMemo } from 'react'
import styles from './settings.module.css'
import {useAccount, setAccount, deleteAccount} from '@plebbit/plebbit-react-hooks'
import stringifyObject from 'stringify-object'

let lastDeletedAccountTimestsamp

function Settings() {
  const account = useAccount()

  const json = useMemo(() => stringifyObject(
    JSON.parse(JSON.stringify({...account, plebbit: undefined, karma: undefined, unreadNotificationCount: undefined})), 
    {indent: '  ', singleQuotes: false})
  , [account])

  const _setAccount = async () => {
    try {
      const newAccount = JSON.parse(document.querySelector('#editAccount').textContent)
      await setAccount(newAccount)
    }
    catch (e) {
      console.error(e)
      alert(`failed editing account: ${e.message}`)
    }
  }

  const _deleteAccount = (accountName) => {
    if (lastDeletedAccountTimestsamp > Date.now() - 10000) {
      console.log(`you're doing this too much`)
      return
    }
    if (!accountName) {
      return
    }
    lastDeletedAccountTimestsamp = Date.now()
    deleteAccount(accountName)
    console.log('deleting account...')
  }

  return (
    <div className={styles.settings}>
      <textarea autocorrect='off' id='editAccount' rows="32" value={json} />
      <button>save</button>
      <button onClick={() => _deleteAccount(account?.name)} >delete account u/{account?.author?.shortAddress?.toLowerCase?.().substring(0, 8) || ''}</button>
    </div>
  )
}

export default Settings
