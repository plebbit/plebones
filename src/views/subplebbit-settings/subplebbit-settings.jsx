import {useMemo, useState, useEffect} from 'react'
import styles from './subplebbit-settings.module.css'
import {useSubplebbit, usePublishSubplebbitEdit, deleteSubplebbit} from '@plebbit/plebbit-react-hooks'
import stringify from 'json-stringify-pretty-compact'
import {useParams, useNavigate} from 'react-router-dom'

function SubplebbitSettings() {
  const navigate = useNavigate()
  const {subplebbitAddress} = useParams()
  const subplebbit = useSubplebbit({subplebbitAddress})
  const subplebbitJson = useMemo(
    () =>
      stringify({
        ...subplebbit,
        // remove fields that cant be edited
        posts: undefined,
        clients: undefined,
        state: undefined,
        startedState: undefined,
        updatingState: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        fetchedAt: undefined,
        signature: undefined,
        errors: undefined,
        error: undefined,
        encryption: undefined,
        statsCid: undefined,
        pubsubTopic: undefined,
        lastPostCid: undefined,
        shortAddress: undefined,
        challenges: undefined,
      }),
    [subplebbit]
  )

  const [text, setText] = useState('')
  let usePublishSubplebbitEditOptions
  try {
    usePublishSubplebbitEditOptions = {...JSON.parse(text), subplebbitAddress}
  } catch (e) {}
  const {publishSubplebbitEdit} = usePublishSubplebbitEdit(usePublishSubplebbitEditOptions)

  // set the initial subplebbit json
  useEffect(() => {
    setText(subplebbitJson)
  }, [subplebbitJson])

  const saveSubplebbit = async () => {
    try {
      // test parsing the options before saving
      JSON.parse(text)

      await publishSubplebbitEdit()
      alert(`saved`)
    } catch (e) {
      console.warn(e)
      alert(`failed editing subplebbit: ${e.message}`)
    }
  }

  const _deleteSubplebbit = async () => {
    const confirmed = window.confirm(`delete p/${subplebbitAddress} permanently?`)
    if (!confirmed) {
      return
    }
    try {
      console.log(`deleting ${subplebbitAddress}...`)
      await deleteSubplebbit(subplebbitAddress)
      navigate(`/subplebbits`, {replace: true})
    } catch (e) {
      console.warn(e)
      alert(`failed deleting subplebbit: ${e.message}`)
    }
  }

  return (
    <div className={styles.settings}>
      <textarea onChange={(e) => setText(e.target.value)} autoCorrect="off" rows="24" value={text} />
      <button onClick={saveSubplebbit}>save</button>
      <button onClick={_deleteSubplebbit}>delete p/{subplebbit?.shortAddress}</button>
    </div>
  )
}

export default SubplebbitSettings
