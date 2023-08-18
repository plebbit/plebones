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
  const mediaInfo = utils.getCommentMediaInfo(reply)
  if (!mediaInfo) {
    return ''
  }
  if (mediaInfo.type === 'image') {
    return <ImageModal url={mediaInfo.url} />
  }
  if (mediaInfo.type === 'video') {
    return <VideoModal url={mediaInfo.url} />
  }
  return ''
}

export default ReplyMedia
