import {useState} from 'react'
import styles from './challenge-builder.module.css'
import {useChallengesStore} from './challenge-builder'

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
  // rateLimit: {
  //   label: 'rate limit',
  //   description: 'exclude if publication per hour is lower than rate limit',
  //   default: 3,
  //   placeholder: '3',
  //   component: 'number',
  // },
}

const ChallengeExcludeInput = ({challenge, challengesTreePath, excludeIndex, excludeName}) => {
  const excludeValue = challenge?.exclude?.[excludeIndex]?.[excludeName]
  const {label, placeholder, component} = excludeInputs[excludeName] || {}

  const updateChallenge = useChallengesStore((state) => state.updateChallenge)
  const updateChallengeExclude = (excludeName, newValue) => {
    const excludeCopy = structuredClone(challenge.exclude || [])
    if (!excludeCopy[excludeIndex]) excludeCopy[excludeIndex] = {}
    excludeCopy[excludeIndex][excludeName] = newValue
    updateChallenge(challengesTreePath, {exclude: excludeCopy})
  }

  let excludeInputComponent
  if (component === 'number') {
    excludeInputComponent = (
      <input type="text" inputmode="numeric" defaultValue={excludeValue} onChange={(event) => updateChallengeExclude(excludeName, event.target.value)} />
    )
  }

  if (component === 'stringArray') {
    excludeInputComponent = (
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={excludeValue}
        onChange={(event) =>
          updateChallengeExclude(
            excludeName,
            event.target.value.split(',').map((item) => item.trim())
          )
        }
      />
    )
  }

  if (component === 'numberArray') {
    excludeInputComponent = (
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={excludeValue}
        onChange={(event) =>
          updateChallengeExclude(
            excludeName,
            event.target.value.split(',').map((item) => Number(item))
          )
        }
      />
    )
  }

  if (component === 'publicationType') {
    const onChange = (event) => updateChallengeExclude('publicationType', {...excludeValue, [event.target.name]: event.target.checked})
    excludeInputComponent = (
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

  return excludeInputComponent
}

export const ChallengeExcludeSelect = ({challenge, challengesTreePath, excludeIndex, excludeName, onChange}) => {
  const excludeGroupCurrentNames = Object.keys(challenge.exclude?.[excludeIndex] || {})
  const excludeGroupAvailableNames = Object.keys(excludeInputs).filter((name) => name === excludeName || !excludeGroupCurrentNames.includes(name))

  const updateChallenge = useChallengesStore((state) => state.updateChallenge)
  const addChallengeExclude = (e) => {
    if (!e.target.value) return
    const excludeCopy = structuredClone(challenge.exclude || [])
    const group = excludeCopy[excludeIndex] || {}
    group[e.target.value] = structuredClone(excludeInputs[e.target.value].default)
    excludeCopy[excludeIndex] = group
    updateChallenge(challengesTreePath, {exclude: excludeCopy})
    onChange?.()
  }

  // all excludes already added
  if (!excludeGroupAvailableNames.length && !excludeName) {
    return ''
  }

  return (
    <select onChange={addChallengeExclude} value={excludeName || ''}>
      <option value="" disabled hidden>
        select exclude
      </option>
      {excludeGroupAvailableNames.map((name) => (
        <option key={name} value={name}>
          {excludeInputs[name].label}
        </option>
      ))}
    </select>
  )
}

const ChallengeExclude = ({challenge, challengesTreePath, excludeIndex, excludeName}) => {
  const updateChallenge = useChallengesStore((state) => state.updateChallenge)
  const removeExclude = () => {
    const excludeCopy = structuredClone(challenge.exclude || [])
    delete excludeCopy[excludeIndex]?.[excludeName]
    updateChallenge(challengesTreePath, {exclude: excludeCopy})
  }
  const {label, description} = excludeInputs[excludeName] || {}

  return (
    <div className={styles.challengeExclude}>
      <div className={styles.challengeOption}>
        <div className={styles.challengeTitle}>
          exclude {label || excludeName}{' '}
          <span class={styles.challengeExcludeRemoveButton} onClick={removeExclude}>
            ✕
          </span>
        </div>
        {description && <div>{description}</div>}
        <ChallengeExcludeInput challenge={challenge} challengesTreePath={challengesTreePath} excludeIndex={excludeIndex} excludeName={excludeName} />
      </div>
    </div>
  )
}

const ChallengeExcludeGroup = ({challenge, challengesTreePath, excludeIndex}) => {
  const updateChallenge = useChallengesStore((state) => state.updateChallenge)
  const removeExclude = () => updateChallenge(challengesTreePath, {exclude: challenge.exclude.filter((_, i) => i !== excludeIndex)})
  const challengeExcludeGroup = challenge?.exclude?.[excludeIndex] || {}
  const challengeExcludeComponents = Object.keys(challengeExcludeGroup).map((excludeName) => (
    <ChallengeExclude key={excludeName} challenge={challenge} challengesTreePath={challengesTreePath} excludeIndex={excludeIndex} excludeName={excludeName} />
  ))

  const [challengeExcludeSelectCount, setChallengeExcludeSelectCount] = useState(1)
  const incrementChallengeExcludeSelectCount = () => setChallengeExcludeSelectCount((previousCount) => previousCount + 1)
  const decrementChallengeExcludeSelectCount = () => setChallengeExcludeSelectCount((previousCount) => previousCount - 1)

  const challengeExcludeSelectComponents = []
  while (challengeExcludeSelectComponents.length < challengeExcludeSelectCount) {
    challengeExcludeSelectComponents.push(
      <div>
        <ChallengeExcludeSelect
          key={challengeExcludeSelectComponents.length}
          challenge={challenge}
          challengesTreePath={challengesTreePath}
          excludeIndex={excludeIndex}
          onChange={decrementChallengeExcludeSelectCount}
        />
      </div>
    )
  }

  const onChallengeMoreButton = (e) => {
    if (e.target.value === 'exclude') {
      incrementChallengeExcludeSelectCount()
    }
    if (e.target.value === 'remove') {
      removeExclude()
    }
  }

  return (
    <div className={styles.challengeExcludeGroup}>
      <select onChange={onChallengeMoreButton} className={styles.challengeMoreButton} value="">
        <option hidden value="">
          ⋮
        </option>
        <option value="exclude">add exclude</option>
        <option value="remove">remove exclude group</option>
      </select>
      {challengeExcludeComponents}
      {challengeExcludeSelectComponents}
    </div>
  )
}

const ChallengeExcludeGroups = ({challenge, challengesTreePath}) => {
  return (
    <div>
      {challenge.exclude?.map((exclude, i) => (
        <ChallengeExcludeGroup challenge={challenge} challengesTreePath={challengesTreePath} exclude={exclude} excludeIndex={i} />
      ))}
    </div>
  )
}

export default ChallengeExcludeGroups
