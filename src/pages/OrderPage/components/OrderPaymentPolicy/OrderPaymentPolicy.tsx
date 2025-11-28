import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import orderScreens from 'src/constants/orderScreens'
import mainPath from 'src/constants/path'
import { OrderContext } from 'src/contexts/order.context'
import { useViewport } from 'src/hooks/useViewport'

interface Props {
  isOrderTrackingPayment?: boolean
}

export default function OrderPaymentPolicy({ isOrderTrackingPayment }: Props) {
  const { setScreen } = useContext(OrderContext)

  const viewPort = useViewport()
  const isMobile = viewPort.width <= 768

  //! Multi languages
  const { t } = useTranslation('order')
  return (
    <div className='p-3 text-darkText dark:text-lightText desktopLarge:p-4'>
      <p className='w-full text-center text-xl font-bold uppercase desktop:text-2xl desktopLarge:text-4xl'>
        {t('layout.Payment method')}
      </p>
      <div className='my-6 w-full border-t border-black/60 dark:border-white/60'></div>
      <div className='h-full py-4 text-base uppercase desktop:text-lg desktopLarge:text-xl'>
        <div className=''>
          <p className=''>
            {t('payment.At the moment we only accept')}{' '}
            <span className='font-medium text-haretaColor'>{t('payment.Online payment')}</span>{' '}
            {t('payment.due to our')}{' '}
            <Link to={mainPath.privacyAndTerms} className='font-medium text-haretaColor hover:text-primaryColor'>
              {t('layout.payment policy')}
            </Link>
          </p>
        </div>
        <div className='mt-4'>
          <p className='font-medium uppercase'>
            {t('payment.PLEASE COMPLETE YOUR PAYMENT IN 48 HOURS AFTER PLACING YOUR ORDER')}
          </p>
          <div className='mt-6 grid grid-cols-1 gap-6 text-base tablet:grid-cols-2 desktop:gap-12 desktopLarge:text-lg'>
            <div className='col-span-1 justify-center space-y-2'>
              <div className='w-full text-center text-lg font-bold desktopLarge:text-xl'>
                {t('payment.NATIONAL PAYMENT')}
              </div>
              <div className='w-full text-center text-lg font-bold desktopLarge:text-xl'>{t('payment.(VIETNAM)')}</div>

              <div className='relative w-full pt-[100%]'>
                <img src='/images/hareta_qrcode.png' alt='QR CODE' className='absolute left-0 top-0 h-full w-full' />
              </div>
              <div className='w-full text-center'>{t('payment.or')}</div>
              <div className='w-full justify-center text-lg font-medium desktop:text-xl'>
                <p className='w-full text-center'>vietcombank</p>
                <p className='w-full text-center'>1027710352</p>
                <p className='w-full text-center'>le quoc viet</p>
              </div>
            </div>
            <div className='col-span-1 justify-center space-y-2'>
              <div className='w-full text-center text-lg font-bold desktopLarge:text-xl'>
                {t('payment.INTERNATIONAL PAYMENT')}
              </div>
              <div className='w-full text-center text-lg font-bold desktopLarge:text-xl'>(paypal)</div>

              <div className='relative w-full pt-[100%]'>
                <img src='/images/hareta_qrcode.png' alt='QR CODE' className='absolute left-0 top-0 h-full w-full' />
              </div>
              <div className='w-full text-center'>{t('payment.or')}</div>
              <p className='w-full text-center font-medium normal-case'>paypal.me/thanhletien364</p>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-4 text-lg font-semibold desktopLarge:text-xl'>
        <p className='text-pretty'>
          {t('payment.Any transactions made before placing an order will')}{' '}
          <span className='text-alertRed dark:text-alertRed'>{t('payment.NOT BE ACCEPTED')}</span>
        </p>
      </div>
      {!isOrderTrackingPayment && !isMobile && (
        <div className='flex w-full justify-start py-8'>
          <button
            onClick={() => {
              setScreen(orderScreens.shipping)
            }}
            type='button'
            className='flex items-center justify-center rounded-xl bg-haretaColor px-4 py-2 text-base font-medium capitalize text-darkText hover:bg-primaryColor desktopLarge:text-lg'
          >
            {t('layout.Back to shipping information')}
          </button>
        </div>
      )}
    </div>
  )
}
