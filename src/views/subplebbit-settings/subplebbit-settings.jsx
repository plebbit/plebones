import {useMemo, useState, useEffect} from 'react'
import styles from './subplebbit-settings.module.css'
import {useSubplebbit, usePublishSubplebbitEdit, deleteSubplebbit} from '@plebbit/plebbit-react-hooks'
import stringify from 'json-stringify-pretty-compact'
import {useParams, useNavigate} from 'react-router-dom'
import {alertChallengeVerificationFailed} from '../../lib/utils.js'
import useChallenges from '../../hooks/use-challenges.js'

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

function SubplebbitSettings() {
  const {addChallenge} = useChallenges()
  const navigate = useNavigate()
  const {subplebbitAddress} = useParams()
  const subplebbit = useSubplebbit({subplebbitAddress})
  const subplebbitEditable = {
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
    lastCommentCid: undefined,
    updateCid: undefined,
    shortAddress: undefined,
    postUpdates: undefined,
    started: undefined,
    raw: undefined,
    ipnsName: undefined,
    ipnsPubsubTopic: undefined,
    ipnsPubsubTopicDhtKey: undefined,
    pubsubTopicPeersCid: undefined,
    // could be useful to show public subplebbit.challenges data if private subplebbit.settings.challenges isn't defined
    challenges: !subplebbit?.settings ? subplebbit?.challenges : undefined,
  }
  // eslint-disable-next-line
  const subplebbitJson = useMemo(() => stringify(subplebbitEditable), [subplebbit])

  const [text, setText] = useState('')

  let editedPropsOnly
  try {
    editedPropsOnly = {...getEditedPropsOnly(subplebbitEditable, JSON.parse(text))}
  } catch (e) {}

  const {publishSubplebbitEdit} = usePublishSubplebbitEdit({
    ...editedPropsOnly,
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
      <textarea onChange={(e) => setText(e.target.value)} autoCorrect="off" rows="24" value={text} />
      <button onClick={saveSubplebbit}>save</button>
      <button disabled={deleteButtonDisabled} onClick={_deleteSubplebbit}>
        delete p/{subplebbit?.shortAddress}
      </button>
    </div>
  )
}

export default SubplebbitSettings
