import { useState } from "react"
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId
} from "@floating-ui/react"
import styles from './account-menu.module.css'
import {useAccount, useAccounts, createAccount} from '@plebbit/plebbit-react-hooks'
import {Link} from 'react-router-dom'

let lastCreatedAccountTimestsamp

function AccountMenu() {
  const {accounts} = useAccounts()
  const accountsOptions = accounts.map(account => <option value={account?.id}>u/{account?.author?.shortAddress?.toLowerCase?.().substring(0, 8) || ''}</option>)
  const account = useAccount()
  let authorAddress = account?.author?.shortAddress?.toLowerCase?.().substring(0, 8)
  if (authorAddress && !authorAddress.match('.')) {
    authorAddress = authorAddress.substring(0, 8)
  }

  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(2),
      flip({ fallbackAxisSideDirection: "end" }),
      shift()
    ],
    whileElementsMounted: autoUpdate
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role
  ])

  const headingId = useId()

  const _createAccount = () => {
    if (lastCreatedAccountTimestsamp > Date.now() - 10000) {
      console.log(`you're doing this too much`)
      return
    }
    lastCreatedAccountTimestsamp = Date.now()
    createAccount()
    console.log('creating account...')
  }

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()}>
        u/{authorAddress}
      </span>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={styles.accountMenu}
            ref={refs.setFloating}
            style={floatingStyles}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <div className={styles.menuItem}>
              <select value={accounts?.[0]?.id}>
                {accountsOptions}
              </select>
            </div>
            <div className={styles.menuItem} onClick={() => _createAccount()}>create account</div>
            <div className={styles.menuItem}><Link to='/settings'>settings</Link></div>
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export default AccountMenu
