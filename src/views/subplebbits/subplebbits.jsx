import {useMemo, useState} from 'react'
import styles from './subplebbits.module.css'
import {useAccountSubplebbits, useCreateSubplebbit} from '@plebbit/plebbit-react-hooks'
import Subplebbit from './subplebbit'

function Subplebbits() {
  const [title, setTitle] = useState()
  const {createSubplebbit} = useCreateSubplebbit({title})
  const {accountSubplebbits} = useAccountSubplebbits()
  const accountSubplebbitsArray = useMemo(() => Object.values(accountSubplebbits), [accountSubplebbits])

  return (
    <div className={styles.subplebbits}>
      <input onChange={(e) => setTitle(e.target.value)} placeholder="sub title" />
      <button onClick={createSubplebbit}>+create</button>
      {accountSubplebbitsArray.map((subplebbit) => (
        <Subplebbit key={subplebbit.address} subplebbit={subplebbit} />
      ))}
    </div>
  )
}

export default Subplebbits
