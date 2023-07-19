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
import {useAccount, useAccounts, createAccount, setActiveAccount} from '@plebbit/plebbit-react-hooks'
import {Link} from 'react-router-dom'

function AccountMenu() {
  // modal stuff
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

  // plebbit stuff
  const account = useAccount()
  const {accounts} = useAccounts()
  const accountsOptions = accounts.map(account => <option value={account?.name}>u/{account?.author?.shortAddress?.toLowerCase?.().substring(0, 8) || ''}</option>)
  accountsOptions[accountsOptions.length] = <option value='createAccount'>+create</option>
  const account = useAccount()
  let authorAddress = account?.author?.shortAddress?.toLowerCase?.().substring(0, 8)
  if (authorAddress && !authorAddress.match('.')) {
    authorAddress = authorAddress.substring(0, 8)
  }

  const onAccountSelectChange = async (event) => {
    if (event.target.value === 'createAccount') {
      createAccount()
    }
    else {
      setActiveAccount(event.target.value)
    }
  }

  const onMenuLinkClick = () => {
    setIsOpen(false)
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
              <select onChange={onAccountSelectChange} value={account?.name}>
                {accountsOptions}
              </select>
            </div>
            <div onClick={onMenuLinkClick} className={styles.menuItem}><Link to='/profile'>profile</Link></div>
            <div onClick={onMenuLinkClick} className={styles.menuItem}><Link to='/settings'>settings</Link></div>
            <div onClick={onMenuLinkClick} className={styles.menuItem}><Link to='/about'>about</Link></div>
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export default AccountMenu
