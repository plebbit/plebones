import {useState} from 'react'
import styles from './challenge-builder.module.css'
import {useChallengesStore} from './challenge-builder'
import plebbitRpcSettings from './plebbit-rpc-settings-mock'

export const ChallengeExcludeSelect = ({challenge, challengesTreePath, excludeIndex, excludeName}) => {
  const excludeNames = Object.keys(plebbitRpcSettings?.challengeExcludes || {})
  const updateChallenge = useChallengesStore((state) => state.updateChallenge)
  const setChallengeExclude = (e) => {
    if (!e.target.value) return
    const excludeCopy = structuredClone(challenge.exclude || [])
    excludeCopy[excludeIndex] = {name: e.target.value}
    updateChallenge(challengesTreePath, {exclude: excludeCopy})
  }

  // no excludes found in plebbit rpc settings
  if (!excludeNames.length) {
    return (
      <select>
        <option>no excludes found in plebbit rpc settings</option>
      </select>
    )
  }

  return (
    <select onChange={setChallengeExclude} value={excludeName || ''}>
      <option value="" disabled hidden>
        select exclude
      </option>
      {excludeNames.map((name) => (
        <option key={name} value={name}>
          {plebbitRpcSettings?.challengeExcludes?.optionInputs?.[name]?.label || name}
        </option>
      ))}
    </select>
  )
}

const ChallengeExcludeOptions = ({challenge, challengesTreePath, excludeIndex, excludeName}) => {
  const optionInputs = plebbitRpcSettings?.challengeExcludes?.[excludeName]?.optionInputs || []
  const exclude = challenge?.exclude?.[excludeIndex] || {}

  const updateChallenge = useChallengesStore((state) => state.updateChallenge)
  const updateChallengeExclude = (option, newValue) => {
    const excludeCopy = structuredClone(challenge.exclude || [])
    if (!excludeCopy[excludeIndex]) excludeCopy[excludeIndex] = {name: excludeName, options: {}}
    if (!excludeCopy[excludeIndex].options) excludeCopy[excludeIndex].options = {}
    excludeCopy[excludeIndex].options[option] = newValue
    updateChallenge(challengesTreePath, {exclude: excludeCopy})
  }

  if (!excludeName) {
    return ''
  }

  return (
    <div className={styles.challengeOptions}>
      {optionInputs?.map((optionInput) => (
        <div className={styles.challengeOption}>
          <div className={styles.challengeTitle}>{optionInput?.label}</div>
          <div>{optionInput?.description}</div>
          <div>
            <input
              className={styles.challengeInput}
              onChange={(e) => updateChallengeExclude(optionInput.option, e.target.value)}
              placeholder={optionInput?.placeholder}
              defaultValue={exclude?.options?.[optionInput.option]}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

const ChallengeExclude = ({challenge, challengesTreePath, excludeIndex}) => {
  const excludeName = challenge?.exclude?.[excludeIndex]?.name
  const {label, description} = plebbitRpcSettings?.challengeExcludes?.[excludeName] || {}
  const updateChallenge = useChallengesStore((state) => state.updateChallenge)
  const removeExclude = () => updateChallenge(challengesTreePath, {exclude: challenge.exclude.filter((_, i) => i !== excludeIndex)})

  const onChallengeMoreButton = (e) => {
    if (e.target.value === 'remove') {
      removeExclude()
    }
  }

  return (
    <div className={styles.challenge}>
      <select onChange={onChallengeMoreButton} className={styles.challengeMoreButton} value="">
        <option hidden value="">
          ⋮
        </option>
        <option value="remove">remove exclude</option>
      </select>

      <div>
        {excludeName && <div className={styles.challengeTitle}>exclude {excludeName}</div>}
        {description && <div>{description}</div>}
        <ChallengeExcludeOptions challenge={challenge} challengesTreePath={challengesTreePath} excludeIndex={excludeIndex} excludeName={excludeName} />

        {!excludeName && <ChallengeExcludeSelect challenge={challenge} challengesTreePath={challengesTreePath} excludeIndex={excludeIndex} />}
      </div>
    </div>
  )
}

const ChallengeExcludeArray = ({challenge, challengesTreePath}) => {
  return (
    <div>
      {challenge.exclude?.map((exclude, i) => (
        <ChallengeExclude challenge={challenge} challengesTreePath={challengesTreePath} exclude={exclude} excludeIndex={i} />
      ))}
    </div>
  )
}

export default ChallengeExcludeArray
