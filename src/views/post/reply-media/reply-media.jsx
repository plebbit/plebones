import utils from '../../../lib/utils'
import styles from './reply-media.module.css'
import { useState } from "react"
import {
  useFloating,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId,
  FloatingOverlay,
  FloatingPortal
} from "@floating-ui/react"

function ImageModal({url}) {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen
  })

  const click = useClick(context)
  const role = useRole(context)
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    role,
    dismiss
  ])

  const refProps = getReferenceProps()
  // prevent opening the reply modal on click
  const onClickAndStopPropagation = (e) => {
    refProps.onClick(e)
    e.stopPropagation()
  }
  const stopPropagation = (e) => e.stopPropagation()

  const headingId = useId()
  const descriptionId = useId()

  return (
    <>
      <div className={styles.replyMediaWrapper}><img ref={refs.setReference} {...refProps} onClick={onClickAndStopPropagation} className={styles.replyMedia} src={url} alt='' /></div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay>
            <FloatingFocusManager context={context}>
              <div
                className={[styles.modal, styles.modalMediaWrapper].join(' ')}
                ref={refs.setFloating}
                aria-labelledby={headingId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                <img onClick={stopPropagation} className={styles.modalMedia} src={url} alt='' />
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  )
}

function VideoModal({url}) {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen
  })

  const click = useClick(context)
  const role = useRole(context)
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    role,
    dismiss
  ])

  const refProps = getReferenceProps()
  // prevent opening the reply modal on click
  const onClickAndStopPropagation = (e) => {
    refProps.onClick(e)
    e.stopPropagation()
  }
  const stopPropagation = (e) => e.stopPropagation()

  const headingId = useId()
  const descriptionId = useId()

  return (
    <>
      <div className={styles.replyMediaWrapper}><video ref={refs.setReference} {...refProps} onClick={onClickAndStopPropagation} className={styles.replyMedia} controls={false} autoPlay={false} src={url} /></div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay>
            <FloatingFocusManager context={context}>
              <div
                className={[styles.modal, styles.modalMediaWrapper].join(' ')}
                ref={refs.setFloating}
                aria-labelledby={headingId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                <video onClick={stopPropagation} className={styles.replyMedia} controls={true} autoPlay={false} src={url} />
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  )
}

const ReplyMedia = ({reply}) => {
  if (!reply?.link) {
    return ''
  }
  const mediaType = utils.getCommentLinkMediaType(reply?.link)
  if (mediaType === 'image') {
    return <ImageModal url={reply?.link} />
  }
  if (mediaType === 'video') {
    return <VideoModal url={reply?.link} />
  }
  return <div className={styles.replyLink}><a href={reply?.link} target='_blank' rel='noreferrer'>{reply?.link?.trim?.()}</a></div>
}

export default ReplyMedia
