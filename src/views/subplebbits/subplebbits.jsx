import {useMemo, useState, useRef} from 'react'
import styles from './subplebbits.module.css'
import {useAccountSubplebbits, useCreateSubplebbit} from '@plebbit/plebbit-react-hooks'
import Subplebbit from './subplebbit'

function Subplebbits() {
  const [title, setTitle] = useState()
  const {createSubplebbit} = useCreateSubplebbit({title})
  const {accountSubplebbits} = useAccountSubplebbits()
  const accountSubplebbitsArray = useMemo(() => Object.values(accountSubplebbits), [accountSubplebbits])

  const inputRef = useRef()

  const create = () => {
    createSubplebbit()
    setTitle('')
    inputRef.current.value = ''
  }

  return (
    <div className={styles.subplebbits}>
      <input ref={inputRef} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
      <button onClick={create}>+create</button>
      {accountSubplebbitsArray.map((subplebbit) => (
        <Subplebbit key={subplebbit.address} subplebbit={subplebbit} />
      ))}
    </div>
  )
}

export default Subplebbits
