import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import classNames from 'classnames'
import { AnimatePresence } from 'framer-motion'
import React, { useContext, useRef } from 'react'
import { AppContext } from 'src/contexts/app.context'

interface Props {
  isOpen: boolean
  handleClose: () => void
  classNameWrapper?: string
  children: React.ReactNode
  closeButton?: boolean
}

export default function DialogPopup({
  isOpen,
  handleClose,
  classNameWrapper = 'min-w-80 relative max-w-md transform overflow-hidden rounded-2xl p-10 align-middle shadow-xl transition-all',
  children,
  closeButton = true
}: Props) {
  const { theme } = useContext(AppContext)

  const completeButtonRef = useRef(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as='div'
          static
          open={isOpen}
          className='fixed z-50'
          onClose={handleClose}
          initialFocus={completeButtonRef}
        >
          <DialogBackdrop className='fixed inset-0 bg-black/60' />

          <div className='fixed inset-0 w-screen overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center text-center'>
              <DialogPanel
                className={classNames(classNameWrapper, 'relative z-50', {
                  'bg-white/95 text-darkText': theme === 'light',
                  'bg-black/95 text-lightText': theme === 'dark'
                })}
              >
                {children}
                <button
                  type='button'
                  className={classNames(
                    'absolute right-2 top-2 flex justify-center rounded-md p-2 text-sm font-medium  hover:text-red-600 ',
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
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
