import {useMemo, useState, useEffect} from 'react'
import styles from './subplebbit-settings.module.css'
import {useSubplebbit, usePublishSubplebbitEdit, deleteSubplebbit} from '@plebbit/plebbit-react-hooks'
import stringify from 'json-stringify-pretty-compact'
import {useParams, useNavigate} from 'react-router-dom'
import {alertChallengeVerificationFailed} from '../../lib/utils.js'
import useChallenges from '../../hooks/use-challenges.js'
import ChallengeBuilder from './challenge-builder'

// don't publish props that haven't changed, saves bandwidth and avoids uneditable props
const getEditedPropsOnly = (original, edited) => {
  const editedProps = {}
  const allProps = new Set([...Object.keys(original), ...Object.keys(edited)])
  for (const prop of allProps) {
    if (original[prop] === undefined && edited[prop] === undefined) {
      continue
    }
    // remove prop
    else if (edited[prop] === undefined) {
      editedProps[prop] = null
    }
    // add prop
    else if (original[prop] === undefined) {
      editedProps[prop] = edited[prop]
    }
    // edit prop
    else if (JSON.stringify(original[prop]) !== JSON.stringify(edited[prop])) {
      editedProps[prop] = edited[prop]
    }
  }
  return editedProps
}

const tryJsonParse = (string) => {
  try {
    return JSON.parse(string)
  } catch (e) {}
}

function SubplebbitSettings() {
  const {addChallenge} = useChallenges()
  const navigate = useNavigate()
  const {subplebbitAddress} = useParams()
  const subplebbit = useSubplebbit({subplebbitAddress})
  const subplebbitEditable = {
    ...subplebbit.editable,
    // could be useful to show public subplebbit.challenges data if private subplebbit.settings.challenges isn't defined
    challenges: !subplebbit?.settings ? subplebbit?.challenges : undefined,
  }
  // eslint-disable-next-line
  const subplebbitJson = useMemo(() => stringify(subplebbit.editable), [subplebbit])

  const [text, setText] = useState('')
  const editedSubplebbit = tryJsonParse(text) || {}

  const {publishSubplebbitEdit} = usePublishSubplebbitEdit({
    ...getEditedPropsOnly(subplebbitEditable, editedSubplebbit),
    subplebbitAddress,
    onChallenge: (...args) => addChallenge([...args, subplebbit]),
    onChallengeVerification: alertChallengeVerificationFailed,
    onError: console.warn,
  })

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

  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(false)
  const _deleteSubplebbit = async () => {
    const confirmed = window.confirm(`delete p/${subplebbitAddress} permanently?`)
    if (!confirmed) {
      return
    }
    try {
      setDeleteButtonDisabled(true)
      console.log(`deleting ${subplebbitAddress}...`)
      await deleteSubplebbit(subplebbitAddress)
      console.log(`deleted ${subplebbitAddress}`)
      navigate(`/subplebbits`, {replace: true})
    } catch (e) {
      console.warn(e)
      alert(`failed deleting subplebbit: ${e.message}`)
    }
  }

  return (
    <div className={styles.settings}>
      <ChallengeBuilder />
      <textarea onChange={(e) => setText(e.target.value)} autoCorrect="off" rows="24" value={text} />
      <button onClick={saveSubplebbit}>save</button>
      <button disabled={deleteButtonDisabled} onClick={_deleteSubplebbit}>
        delete p/{subplebbit?.shortAddress}
      </button>
    </div>
  )
}

export default SubplebbitSettings
