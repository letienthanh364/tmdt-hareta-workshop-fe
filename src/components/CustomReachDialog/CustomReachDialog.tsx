import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import '@reach/dialog/styles.css'
import classNames from 'classnames'
import { useContext, useRef } from 'react'
import { AppContext } from 'src/contexts/app.context'

interface Props {
  isOpen: boolean
  handleClose: () => void
  classNameWrapper?: string
  children: React.ReactNode
  closeButton?: boolean
}

export default function CustomReachDialog({
  isOpen,
  handleClose,
  classNameWrapper = 'min-w-80 relative max-w-md transform overflow-hidden rounded-2xl p-10 align-middle shadow-xl transition-all',
  children,
  closeButton
}: Props) {
  const { theme } = useContext(AppContext)

  const completeButtonRef = useRef(null)

  return (
    <DialogOverlay
      className={classNames(
        'z-50 flex items-center justify-center bg-black bg-opacity-25',
        theme == 'dark' ? 'dark' : 'light'
      )}
      isOpen={isOpen}
      onDismiss={handleClose}
      initialFocusRef={completeButtonRef}
    >
      <DialogContent
        className={classNames(classNameWrapper, ' bg-white text-darkText dark:bg-black dark:text-lightText')}
      >
        {children}
        <button
          type='button'
          className={classNames(
            'absolute right-2 top-2 flex justify-center rounded-md p-2 text-sm font-medium hover:text-alertRed tablet:text-base desktop:text-lg ',
            {
              'text-darkText/50': theme === 'light',
              'text-lightText/50': theme === 'dark',
              visible: closeButton,
              invisible: !closeButton
            }
          )}
          onClick={handleClose}
          ref={completeButtonRef}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </DialogContent>
    </DialogOverlay>
  )
}
