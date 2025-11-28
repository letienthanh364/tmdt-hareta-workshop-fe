import { Dialog, Transition } from '@headlessui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import React, { Fragment, useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import userLikeProductApi from 'src/apis/userLikeProduct.api'
import { AppContext } from 'src/contexts/app.context'

interface Props {
  isOpen: boolean
  handleClose: () => void
  unlikeItemId: string
  setUnlikeItemId: React.Dispatch<React.SetStateAction<string>>
  children?: React.ReactNode
  classNameWrapper?: string
}

export default function UserUnlikeProductDialog({
  isOpen,
  handleClose,
  unlikeItemId,
  setUnlikeItemId,
  classNameWrapper
}: Props) {
  const { theme } = useContext(AppContext)
  const queryClient = useQueryClient()
  const unlikeItemMutation = useMutation({ mutationFn: userLikeProductApi.unlikeProduct })
  const unlikeItem = () => {
    unlikeItemMutation.mutate(
      { group_id: unlikeItemId as string },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['user_wish_list'] })
        }
      }
    )
    setUnlikeItemId('')
    handleClose()
  }

  //! Multi languages
  const { t } = useTranslation('user')

  const completeButtonRef = useRef(null)
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={handleClose} initialFocus={completeButtonRef}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/10' />
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
                  'bg-white/70 text-darkText': theme === 'light',
                  'bg-black/80 text-lightText': theme === 'dark'
                })}
              >
                <p className='text-lg font-semibold'>{t('wishlist.remove message')}</p>

                <div className='mt-8 flex justify-between'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={unlikeItem}
                  >
                    {t('wishlist.remove')}
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-orange-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={handleClose}
                    ref={completeButtonRef}
                  >
                    {t('wishlist.cancel')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
