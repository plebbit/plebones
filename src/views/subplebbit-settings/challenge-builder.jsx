import DragAndDrop from './drag-and-drop'
import plebbitRpcChallenges from './challenges-mock'
import {useState} from 'react'
import createStore from 'zustand'
import {immer} from 'zustand/middleware/immer'
import styles from './challenge-builder.module.css'
import ChallengeExcludeGroups from './challenge-builder-exclude'

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

export const useChallengesStore = createStore(
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

  const onChallengeMoreButton = (e) => {
    if (e.target.value === 'challenge') {
      appendChallenge(challengesTreePath, {name: '', exclude: []})
    }
    if (e.target.value === 'group') {
      appendChildChallenge(challengesTreePath, {name: '', exclude: []})
    }
    if (e.target.value === 'exclude') {
      appendExclude()
    }
    if (e.target.value === 'remove') {
      removeChallenge(challengesTreePath)
    }
  }

  return (
    <div className={styles.challenge}>
      {isSingleChallenge && (
        <div>
          <select onChange={onChallengeMoreButton} className={styles.challengeMoreButton} value="">
            <option hidden value="">
              ⋮
            </option>
            <option value="group">add challenge group</option>
            <option value="exclude">add exclude group</option>
            <option value="remove">remove challenge</option>
          </select>
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
          <ChallengeExcludeGroups challenge={challenge} challengesTreePath={challengesTreePath} />
        </div>
      )}

      {!isSingleChallenge && (
        <div>
          <select onChange={onChallengeMoreButton} className={styles.challengeMoreButton} value="">
            <option hidden value="">
              ⋮
            </option>
            <option value="challenge">add challenge</option>
            <option value="remove">remove challenge group</option>
          </select>
          <div>
            <select value={challenges.combinator} onChange={(e) => updateChallenge(challengesTreePath, {combinator: e.target.value})}>
              <option value="and">AND</option>
              <option value="or">OR</option>
            </select>
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

  console.log(challenges)

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
