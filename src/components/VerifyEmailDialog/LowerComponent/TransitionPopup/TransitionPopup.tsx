import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import React, { Fragment, useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'

interface Props {
  isOpen: boolean
  handleClose: () => void
  classNameWrapper?: string
  children?: React.ReactNode
}

export default function TransitionPopup({
  isOpen,
  handleClose,
  classNameWrapper = 'w-60 max-w-md transform overflow-hidden rounded-2xl p-6 align-middle shadow-xl transition-all bg-black/90',
  children = (
    <div className=''>
      <div className='flex'>
        <Dialog.Title as='h3' className='text-center text-xl font-medium leading-6 text-gray-900'>
          Added successful
        </Dialog.Title>
        <button
          type='button'
          className='inline-flex justify-center rounded-md border border-transparent  p-2 text-sm font-medium text-lightText/50 hover:text-red-600  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
        >
          <FontAwesomeIcon icon={faXmark} fontSize={20} />
        </button>
      </div>
      <div className='mt-2  text-center'>
        <FontAwesomeIcon
          icon={faCheck}
          fontSize={36}
          className='text- rounded-full bg-black/10 p-4 text-center text-successGreen'
        />
      </div>
    </div>
  )
}: Props) {
  const { theme } = useContext(AppContext)

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          {/* <div className='fixed inset-0 bg-black bg-opacity-25' /> */}
          <div className='fixed inset-0 bg-black/70' aria-hidden='true' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-200'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel
                className={classNames(classNameWrapper, {
                  'bg-white text-darkText': theme === 'light',
                  'bg-[#404040] text-lightText': theme === 'dark'
                })}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
