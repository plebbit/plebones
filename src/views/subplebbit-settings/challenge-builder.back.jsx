import DragAndDrop from './drag-and-drop'
import plebbitRpcChallenges from './challenges-mock'
import {useState} from 'react'
import createStore from 'zustand'
import styles from './challenge-builder.module.css'

const useChallengesStore = createStore((setState, getState) => ({
  challenges: [],
  addChallenge: () => setState((state) => ({challenges: [...state.challenges, {}]})),
  setChallengeName: (challengeIndex, name) =>
    setState((state) => {
      const challenges = [...state.challenges]
      challenges[challengeIndex] = {...challenges[challengeIndex], name}
      return {challenges}
    }),
  setChallengeOption: (challengeIndex, optionName, optionValue) =>
    setState((state) => {
      const challenges = [...state.challenges]
      challenges[challengeIndex] = {
        ...challenges[challengeIndex],
        options: {...challenges[challengeIndex]?.options, [optionName]: optionValue},
      }
      return {challenges}
    }),
  setChallengeExclude: (challengeIndex, newExcludeName, excludeValue, oldExcludeName) =>
    setState((state) => {
      const challenges = [...state.challenges]
      challenges[challengeIndex] = {
        ...challenges[challengeIndex],
        exclude: {...challenges[challengeIndex]?.exclude, [newExcludeName]: excludeValue},
      }
      // replace value in object while keeping the same prop order
      if (oldExcludeName) {
        const exclude = {}
        for (const excludeName in challenges[challengeIndex].exclude) {
          if (excludeName === oldExcludeName) {
            exclude[newExcludeName] = excludeValue
          } else {
            exclude[excludeName] = challenges[challengeIndex].exclude[excludeName]
          }
        }
        challenges[challengeIndex].exclude = exclude
      }
      // deleting from object makes logic easier in components
      if (excludeValue === undefined || excludeValue === null) {
        delete challenges[challengeIndex].exclude[newExcludeName]
      }
      return {challenges}
    }),
}))

const excludeInputs = {
  postScore: {
    label: 'post score',
    description: 'exclude if author post score is greater or equal',
    default: 10,
    placeholder: '',
    component: 'number',
  },
  postReply: {
    label: 'post reply',
    description: 'exclude if author reply score is greater or equal',
    default: 10,
    placeholder: '',
    component: 'number',
  },
  firstCommentTimestamp: {
    label: 'first comment timestamp',
    description: 'exclude if author account age is greater or equal than now - first comment timestamp (in seconds)',
    default: 60 * 60 * 24 * 30,
    placeholder: '3600 (time in seconds)',
    component: 'number',
  },
  challenges: {
    label: 'challenges',
    description: 'exclude if all challenges with indexes passed, e.g. challenges: [0, 1] excludes if challenges at index 0 AND 1 passed',
    default: [],
    placeholder: '0,1,2,etc',
    component: 'numberArray',
  },
  publicationType: {
    label: 'publication type',
    // description: 'exclude post, reply, vote, etc',
    default: {post: true, reply: true, vote: true, commentEdit: true, commentModeration: true},
    component: 'publicationType',
  },
  role: {
    label: 'role',
    description: 'exclude challenge if author role equals one of the role',
    default: ['owner', 'admin', 'moderator'],
    placeholder: 'owner,admin,moderator,etc',
    component: 'stringArray',
  },
  address: {
    label: 'address',
    description: 'exclude challenge if author address equals one of the addresses',
    default: [],
    placeholder: '12D...,12D...,etc',
    component: 'stringArray',
  },
  rateLimit: {
    label: 'rate limit',
    description: 'exclude if publication per hour is lower than rate limit',
    default: 3,
    placeholder: '3',
    component: 'number',
  },
}

const ChallengeExcludeItemValue = ({challenge, challengeIndex, excludeName}) => {
  const setChallengeExclude = useChallengesStore((state) => state.setChallengeExclude)
  const changeChallengeExclude = (excludeName, excludeValue) => setChallengeExclude(challengeIndex, excludeName, excludeValue)
  const excludeValue = challenge?.exclude?.[excludeName]
  const {label, placeholder, component} = excludeInputs[excludeName] || {}

  let excludeValueComponent
  if (component === 'number') {
    excludeValueComponent = (
      <input type="text" inputmode="numeric" defaultValue={excludeValue} onChange={(event) => changeChallengeExclude(excludeName, event.target.value)} />
    )
  }

  if (component === 'stringArray') {
    excludeValueComponent = (
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={excludeValue}
        onChange={(event) =>
          changeChallengeExclude(
            excludeName,
            event.target.value.split(',').map((item) => item.trim())
          )
        }
      />
    )
  }

  if (component === 'numberArray') {
    excludeValueComponent = (
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={excludeValue}
        onChange={(event) =>
          changeChallengeExclude(
            excludeName,
            event.target.value.split(',').map((item) => Number(item))
          )
        }
      />
    )
  }

  if (component === 'publicationType') {
    const onChange = (event) => changeChallengeExclude('publicationType', {...excludeValue, [event.target.name]: event.target.checked})
    excludeValueComponent = (
      <span>
        {Object.keys(excludeInputs.publicationType.default).map((type) => (
          <label>
            <input type="checkbox" onChange={onChange} name={type} checked={excludeValue[type]} />
            {type}
          </label>
        ))}{' '}
      </span>
    )
  }

  return excludeValueComponent
}

const ChallengeExcludeItem = ({challenge, challengeIndex, excludeName}) => {
  const excludeNames = Object.keys(excludeInputs).filter((_excludeName) => _excludeName === excludeName || !challenge?.exclude || !(_excludeName in challenge.exclude))
  const setChallengeExclude = useChallengesStore((state) => state.setChallengeExclude)
  const addOrChangeChallengeExclude = (event) => setChallengeExclude(challengeIndex, event.target.value, excludeInputs[event.target.value].default, excludeName)
  const removeChallengeExclude = (event) => setChallengeExclude(challengeIndex, excludeName, undefined)
  const {label, description} = excludeInputs[excludeName] || {}

  // all exclude names already added to ui
  if (!excludeNames.length) {
    return
  }

  return (
    <div className={styles.challengeOption}>
      {label && <div className={styles.challengeTitle}>exclude {label}</div>}
      {description && <div>{description}</div>}
      {!excludeName && (
        <span>
          <select onChange={addOrChangeChallengeExclude} value={excludeName || ''}>
            <option value="" disabled selected hidden>
              +exclude
            </option>
            {excludeNames.map((excludeName) => (
              <option value={excludeName}>{excludeName}</option>
            ))}
          </select>
          <button>+challenge</button>
        </span>
      )}
      <ChallengeExcludeItemValue challengeIndex={challengeIndex} challenge={challenge} excludeName={excludeName} />
      {excludeName && <button onClick={removeChallengeExclude}>×</button>}
    </div>
  )
}

const ChallengeExclude = ({challenge, challengeIndex}) => {
  const challengeExcludeSelects = Object.keys(challenge.exclude || {}).map((excludeName) => (
    <ChallengeExcludeItem challengeIndex={challengeIndex} challenge={challenge} excludeName={excludeName} />
  ))

  return (
    <div className={styles.challengeExclude}>
      {/*<div className={styles.challengeTitle}>exclude</div>*/}
      {challengeExcludeSelects}
      <ChallengeExcludeItem challengeIndex={challengeIndex} challenge={challenge} />
    </div>
  )
}

const Challenge = ({challenge, challengeIndex}) => {
  const challengeNames = Object.keys(plebbitRpcChallenges || {})
  const optionInputs = plebbitRpcChallenges?.[challenge?.name]?.optionInputs || []

  const setChallengeName = useChallengesStore((state) => state.setChallengeName)
  const setChallengeOption = useChallengesStore((state) => state.setChallengeOption)

  const options = optionInputs?.map((optionInput) => (
    <div className={styles.challengeOption}>
      <div className={styles.challengeTitle}>{optionInput?.label}</div>
      <div>{optionInput?.description}</div>
      <div>
        <input
          className={styles.challengeInput}
          onChange={(event) => setChallengeOption(challengeIndex, optionInput.option, event.target.value)}
          placeholder={optionInput?.placeholder}
          defaultValue={challenge?.options?.[optionInput.name]}
        />
      </div>
    </div>
  ))

  return (
    <div className={styles.challenge}>
      <div className={styles.challengeOption}>
        <select onChange={(event) => setChallengeName(challengeIndex, event.target.value)} value={challenge.name}>
          <option value="" disabled selected hidden>
            select challenge
          </option>
          {challengeNames.map((challengeName) => (
            <option value={challengeName}>{challengeName}</option>
          ))}
        </select>
      </div>
      {options}
      {challenge.name && (
        <div className={styles.challengeOption}>
          <ChallengeExclude challengeIndex={challengeIndex} challenge={challenge} />
        </div>
      )}
      {/*{options.length ? <div><button>+challenge group</button></div> : ''}*/}
    </div>
  )
}

const ChallengeBuilder = () => {
  const challenges = useChallengesStore((state) => state.challenges)
  const addChallenge = useChallengesStore((state) => state.addChallenge)

  console.log(challenges)

  return (
    <div>
      <div>
        <select value="and">
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>
        <button onClick={addChallenge}>+challenge</button>
      </div>
      {challenges.map((challenge, i) => (
        <Challenge key={i} challengeIndex={i} challenge={challenge} plebbitRpcChallenges={plebbitRpcChallenges} />
      ))}
    </div>
  )
}

export default ChallengeBuilder
