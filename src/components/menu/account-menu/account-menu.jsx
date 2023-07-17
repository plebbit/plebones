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
import {useAccount} from '@plebbit/plebbit-react-hooks'

function AccountMenu() {
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
              <select value='Account 1'>
                <option value="Account 1">Account 1</option>
                <option value="Account 2">Account 2</option>
              </select>
            </div>
            <div className={styles.menuItem}>create account</div>
            <div className={styles.menuItem}>edit account</div>
            <div className={styles.menuItem}>settings</div>
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export default AccountMenu
