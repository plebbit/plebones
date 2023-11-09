import {useState} from 'react'
import {useFloating, autoUpdate, offset, flip, shift, useDismiss, useRole, useClick, useInteractions, FloatingFocusManager, useId} from '@floating-ui/react'
import styles from './account-menu.module.css'
import {useAccount, useAccounts, createAccount, setActiveAccount} from '@plebbit/plebbit-react-hooks'
import {Link} from 'react-router-dom'
import packageJson from '../../../../package.json'
const commitRef = process?.env?.REACT_APP_COMMIT_REF?.slice(0, 7)
const version = commitRef || `v${packageJson.version}`

const Menu = ({onMenuLinkClick}) => {
  const {accounts} = useAccounts()
  const accountsOptions = accounts.map((account) => (
    <option key={account?.id} value={account?.name}>
      u/{account?.author?.shortAddress?.toLowerCase?.().substring(0, 8) || ''}
    </option>
  ))
  accountsOptions[accountsOptions.length] = (
    <option key="create" value="createAccount">
      +create
    </option>
  )
  const account = useAccount()

  const onAccountSelectChange = async (event) => {
    if (event.target.value === 'createAccount') {
      createAccount()
    } else {
      setActiveAccount(event.target.value)
    }
  }

  const unreadNotificationCount = account?.unreadNotificationCount ? ` (${account.unreadNotificationCount})` : ''

  return (
    <div className={styles.accountMenu}>
      <div className={styles.menuItem}>
        <select onChange={onAccountSelectChange} value={account?.name}>
          {accountsOptions}
        </select>
      </div>
      <Link to="/inbox">
        <div onClick={onMenuLinkClick} className={styles.menuItem}>
          inbox{unreadNotificationCount}
        </div>
      </Link>
      <Link to="/profile">
        <div onClick={onMenuLinkClick} className={styles.menuItem}>
          profile
        </div>
      </Link>
      <Link to="/subplebbits">
        <div onClick={onMenuLinkClick} className={styles.menuItem}>
          subs
        </div>
      </Link>
      <Link to="/settings">
        <div onClick={onMenuLinkClick} className={styles.menuItem}>
          settings
        </div>
      </Link>
      <Link to="/about">
        <div onClick={onMenuLinkClick} className={styles.menuItem}>
          about
        </div>
      </Link>
      <div className={styles.version}>{version}</div>
    </div>
  )
}

function AccountMenu({className}) {
  // modal stuff
  const [isOpen, setIsOpen] = useState(false)

  const {refs, floatingStyles, context} = useFloating({
    placement: 'bottom',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(2), flip({fallbackAxisSideDirection: 'end'}), shift()],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const {getReferenceProps, getFloatingProps} = useInteractions([click, dismiss, role])

  const headingId = useId()

  // plebbit stuff
  const account = useAccount()
  let authorAddress = account?.author?.shortAddress?.toLowerCase?.().substring(0, 8)
  if (authorAddress && !authorAddress.match('.')) {
    authorAddress = authorAddress.substring(0, 8)
  }

  const onMenuLinkClick = () => setIsOpen(false)

  return (
    <>
      <span className={className} ref={refs.setReference} {...getReferenceProps()}>
        u/{authorAddress}
      </span>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div className={styles.modal} ref={refs.setFloating} style={floatingStyles} aria-labelledby={headingId} {...getFloatingProps()}>
            <Menu onMenuLinkClick={onMenuLinkClick} />
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export default AccountMenu
