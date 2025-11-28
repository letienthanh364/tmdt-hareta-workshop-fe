import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import DialogPopup from 'src/components/DialogPopup'
import { AppContext } from 'src/contexts/app.context'

interface Props {
  isOpen: boolean
  handleClose: () => void
  handleConfirm: (failed: boolean) => () => void
  orderId: string
}

export default function OrderSuccessDialog({ isOpen, handleClose, handleConfirm, orderId }: Props) {
  const { theme } = useContext(AppContext)

  //! Multi languages
  const { t } = useTranslation('order')

  return (
    <DialogPopup
      isOpen={isOpen}
      handleClose={handleClose}
      classNameWrapper='relative w-10/12 tablet:w-8/12 max-w:lg transform overflow-hidden rounded-2xl py-6 px-4 align-middle shadow-xl transition-all'
      closeButton={false}
    >
      <div className={classNames('space-y-4', theme === 'dark' ? 'dark' : 'light')}>
        <div className='mb-4 text-center'>
          <FontAwesomeIcon
            icon={faCheck}
            className='h-auto w-8 rounded-full text-center text-successGreen tablet:w-10 desktop:w-12 desktopLarge:w-16'
          />
        </div>
        <p className='mt-6 text-center text-base font-bold uppercase leading-6 tablet:text-lg desktop:text-2xl'>
          {t('layout.Your order was created successfully')}
        </p>

        <p className='flex justify-center space-x-2 font-semibold desktop:space-x-4'>
          <span>{t('layout.Your order ID')}:</span>
          <span className='text-haretaColor'>{orderId}</span>
        </p>
        <p className='font-semibold'>{t('layout.Please save this ID for Transaction and Order Tracking!')}</p>

        <div className='flex flex-col items-center justify-center space-y-2 text-sm tablet:text-base desktopLarge:text-lg'>
          <p className='text-center'>
            {t('layout.You will now be redirected to the payment page to complete your transaction.')}
          </p>
          <p className='text-center'>
            {t('layout.Please ensure to finalize your payment within the next 48 hours to avoid any cancellation.')}
          </p>
          <p className='text-center text-base font-semibold tablet:text-lg desktopLarge:text-xl'>
            {t('layout.Thank you for placing your order with Hareta Workshop.')}
          </p>
        </div>
        <div className='flex w-full items-center justify-center'>
          <button
            className='rounded-2xl bg-haretaColor px-4 py-2 font-medium text-darkText hover:bg-primaryColor'
            onClick={handleConfirm(false)}
          >
            {t('layout.Go to payment page')}
          </button>
        </div>
      </div>
    </DialogPopup>
  )
}
