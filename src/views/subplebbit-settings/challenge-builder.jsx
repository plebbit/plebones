import DragAndDrop from './drag-and-drop'
import plebbitRpcChallenges from './challenges-mock'
import {useState} from 'react'
import createStore from 'zustand'
import {immer} from 'zustand/middleware/immer'
import styles from './challenge-builder.module.css'

// const challenges = {
//   combinator: 'or',
//   challenges: [
//     {
//       name: 'whitelist',
//       exclude: [{...}],
//       etc...
//     },
//     {
//       combinator: 'and',
//       challenges: [
//         {
//           name: 'whitelist',
//           exclude: [{...}],
//           etc...
//         },
//         {
//           name: 'mintpass',
//           etc...
//         }
//       ]
//       exclude: [{...}]
//     }
//   ],
//   exclude: [{...}]
// }

// const challengeErrors = {
//   0: undefined,
//   1: {
//     0: 'this is some error',
//     1: undefined
//   }
// }

// TODO think of api for pending approval

const useChallengesStore = createStore(
  immer((setState, getState) => ({
    challengesTree: {
      combinator: 'and',
      challenges: [],
    },
    appendChildChallenge: (challengesTreePath, newChallenge = {}) =>
      setState((state) => {
        let challenge = state.challengesTree
        for (const index of challengesTreePath) {
          if (!challenge.challenges) challenge.challenges = []
          challenge = challenge.challenges[index]
        }
        // if it's a single challenge, upgrade it into a challenge group
        if (!challenge.challenges) {
          const singleChallenge = {...challenge}
          // reset props of challenge leaf with immer
          Object.keys(challenge).forEach((key) => delete challenge[key])
          challenge.combinator = 'and'
          challenge.challenges = [singleChallenge]
        }
        challenge.challenges.push(newChallenge)
      }),
    appendChallenge: (challengesTreePath, newChallenge = {}) =>
      setState((state) => {
        if (!challengesTreePath || challengesTreePath.length === 0) {
          // append at root level
          state.challengesTree.challenges.push(newChallenge)
          return
        }
        // walk down to target node
        let challenge = state.challengesTree
        for (const index of challengesTreePath) {
          challenge = challenge.challenges?.[index]
        }
        if (!challenge.challenges) challenge.challenges = []
        challenge.challenges.push(newChallenge)
      }),
    updateChallenge: (challengesTreePath, updates) =>
      setState((state) => {
        let challenge = state.challengesTree
        for (const index of challengesTreePath) {
          challenge = challenge.challenges?.[index]
        }
        Object.assign(challenge, updates)
      }),
    removeChallenge: (challengesTreePath) =>
      setState((state) => {
        if (challengesTreePath.length === 0) return // prevent deleting the whole tree
        let challenge = state.challengesTree
        for (let i = 0; i < challengesTreePath.length - 1; i++) {
          challenge = challenge.challenges?.[challengesTreePath[i]]
        }
        challenge.challenges?.splice(challengesTreePath[challengesTreePath.length - 1], 1)
      }),
  }))
)

const excludeInputs = {
  postScore: {
    label: 'post score',
    description: 'exclude if author post score is greater or equal',
    default: 10,
    placeholder: '',
    component: 'number',
  },
  replyScore: {
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
  rateLimit: {
    label: 'rate limit',
    description: 'exclude if publication per hour is lower than rate limit',
    default: 3,
    placeholder: '3',
    component: 'number',
  },
}

const ChallengeExcludeGroup = ({challenge, challengesTreePath, exclude, excludeIndex}) => {
  const updateChallenge = useChallengesStore((state) => state.updateChallenge)
  const removeExclude = () => updateChallenge(challengesTreePath, {exclude: challenge.exclude.filter((_, i) => i !== excludeIndex)})

  return (
    <div className={styles.challengeExclude}>
      <button className={styles.removeButton} onClick={removeExclude}>
        ✕
      </button>
      <details className={styles.challengeOption}>
        <summary className={styles.challengeTitle}>exclude {excludeInputs.postScore.label}</summary>
        <div>{excludeInputs.postScore.description}</div>
        <input type="text" inputmode="numeric" defaultValue={exclude.postScore} />
      </details>

      <details className={styles.challengeOption}>
        <summary className={styles.challengeTitle}>exclude {excludeInputs.replyScore.label}</summary>
        <div>{excludeInputs.replyScore.description}</div>
        <input type="text" inputmode="numeric" defaultValue={exclude.replyScore} />
      </details>

      <details className={styles.challengeOption}>
        <summary className={styles.challengeTitle}>exclude {excludeInputs.firstCommentTimestamp.label}</summary>
        <div>{excludeInputs.firstCommentTimestamp.description}</div>
        <input type="text" inputmode="numeric" defaultValue={exclude.firstCommentTimestamp} />
      </details>

      <details className={styles.challengeOption}>
        <summary className={styles.challengeTitle}>exclude {excludeInputs.publicationType.label}</summary>
        <div>{excludeInputs.publicationType.description}</div>
        <span>
          {Object.keys(excludeInputs.publicationType.default).map((type) => (
            <label>
              <input type="checkbox" name={type} checked={exclude.publicationType?.[type]} />
              {type}
            </label>
          ))}{' '}
        </span>
      </details>

      <details className={styles.challengeOption}>
        <summary className={styles.challengeTitle}>exclude {excludeInputs.role.label}</summary>
        <div>{excludeInputs.role.description}</div>
        <input type="text" placeholder={excludeInputs.role.placeholder} defaultValue={exclude.role} />
      </details>

      <details className={styles.challengeOption}>
        <summary className={styles.challengeTitle}>exclude {excludeInputs.address.label}</summary>
        <div>{excludeInputs.address.description}</div>
        <input type="text" placeholder={excludeInputs.address.placeholder} defaultValue={exclude.address} />
      </details>

      <details className={styles.challengeOption}>
        <summary className={styles.challengeTitle}>exclude {excludeInputs.rateLimit.label}</summary>
        <div>{excludeInputs.rateLimit.description}</div>
        <input type="text" inputmode="numeric" defaultValue={exclude.rateLimit} />
      </details>
    </div>
  )
}

const ChallengeExclude = ({challenge, challengesTreePath}) => {
  return (
    <div>
      {challenge.exclude?.map((exclude, i) => (
        <ChallengeExcludeGroup challenge={challenge} challengesTreePath={challengesTreePath} exclude={exclude} excludeIndex={i} />
      ))}
    </div>
  )
}

const ChallengeOptions = ({challenge, challengesTreePath}) => {
  const optionInputs = plebbitRpcChallenges?.[challenge?.name]?.optionInputs || {}
  const updateChallenge = useChallengesStore((state) => state.updateChallenge)

  if (!challenge?.name) {
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
              onChange={(e) => updateChallenge(challengesTreePath, {options: {...challenge.options, [optionInput.option]: e.target.value}})}
              placeholder={optionInput?.placeholder}
              defaultValue={challenge?.options?.[optionInput.option]}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

const Challenge = ({challengesTree, challengesTreePath}) => {
  // the challenges tree node is either a single challenge leaf, or multiple challenges node
  const challenges = challengesTree.challenges
  const challenge = !challenges ? challengesTree : undefined
  const isSingleChallenge = !!challenge

  const appendChildChallenge = useChallengesStore((state) => state.appendChildChallenge)
  const appendChallenge = useChallengesStore((state) => state.appendChallenge)
  const updateChallenge = useChallengesStore((state) => state.updateChallenge)
  const removeChallenge = useChallengesStore((state) => state.removeChallenge)
  const appendExclude = () => updateChallenge(challengesTreePath, {exclude: [...(challenge.exclude || []), {}]})

  const challengeNames = Object.keys(plebbitRpcChallenges || {})

  return (
    <div className={styles.challenge}>
      <button className={styles.removeButton} onClick={() => removeChallenge(challengesTreePath)}>
        ✕
      </button>
      {/*<div>challenge {challengesTreePath.join('-')} {challenge?.name}</div>*/}
      {isSingleChallenge && (
        <div>
          <select onChange={(e) => updateChallenge(challengesTreePath, {name: e.target.value})} value={challenge.name || ''}>
            <option value="" disabled selected hidden>
              select challenge
            </option>
            {challengeNames.map((challengeName) => (
              <option key={challengeName} value={challengeName}>
                {challengeName}
              </option>
            ))}
          </select>
          <ChallengeOptions challenge={challenge} challengesTreePath={challengesTreePath} />
          <div>
            <button onClick={appendExclude}>+exclude</button>
            {/* the tree 'leaf' is 'split' into a 'node' with 2 'leaves', 
            could also be called 'group', 'nest', '+subchallenge', etc. */}
            <button onClick={() => appendChildChallenge(challengesTreePath, {name: '', exclude: []})}>split</button>
          </div>
          <ChallengeExclude challenge={challenge} challengesTreePath={challengesTreePath} />
        </div>
      )}

      {!isSingleChallenge && (
        <div>
          <div>
            <select value={challenges.combinator} onChange={(e) => updateChallenge(challengesTreePath, {combinator: e.target.value})}>
              <option value="and">AND</option>
              <option value="or">OR</option>
            </select>
            <button onClick={() => appendChallenge(challengesTreePath, {name: '', exclude: []})}>+challenge</button>
          </div>
          {challenges.map((challengesTree, i) => (
            <Challenge key={i} challengesTree={challengesTree} challengesTreePath={[...challengesTreePath, i]} />
          ))}
        </div>
      )}
    </div>
  )
}

const ChallengeBuilder = () => {
  const challengesTree = useChallengesStore((state) => state.challengesTree)
  const challenges = challengesTree.challenges
  const appendChallenge = useChallengesStore((state) => state.appendChallenge)
  const updateChallenge = useChallengesStore((state) => state.updateChallenge)

  return (
    <div>
      <div>
        <select value={challengesTree.combinator} onChange={(e) => updateChallenge([], {combinator: e.target.value})}>
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>
        <button onClick={() => appendChallenge([], {name: '', exclude: []})}>+challenge</button>
      </div>
      {challenges.map((challengesTree, i) => (
        <Challenge key={i} challengesTree={challengesTree} challengesTreePath={[i]} />
      ))}
    </div>
  )
}

export default ChallengeBuilder
