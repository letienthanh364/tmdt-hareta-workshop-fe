import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import { orderApi } from 'src/apis/order.api'
import paymentApi from 'src/apis/payment.api'
import LoadingSection from 'src/components/LoadingSection'
import PathBar from 'src/components/PathBar'
import { orderTrackingPath } from 'src/constants/path'
import { HttpStatusMessage } from 'src/constants/httpStatusMessage'
import { AppContext } from 'src/contexts/app.context'
import { getOrderIdInOrderTrackingPayment } from 'src/utils/order'
import { isAxiosBadRequestError } from 'src/utils/utils'
import { ErrorRespone } from 'src/types/utils.type'

function DividingBorder() {
  return (
    <div className='flex w-full items-center justify-center'>
      <div className='w-8/12 rounded-xl border-t border-black/80 dark:border-white/80 tablet:w-10/12 desktop:w-6/12' />
    </div>
  )
}

export default function OrderTrackingPayment() {
  const { isAuthenticated } = useContext(AppContext)

  //! Get order id and url
  const currentUrl = useLocation().pathname
  const { orderId: paramOrderId } = useParams()
  const orderId = getOrderIdInOrderTrackingPayment(paramOrderId as string)
  const orderUrl = currentUrl.split('/payment')[0]

  //! Get order information
  const { data: orderData } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => {
      return isAuthenticated ? orderApi.findOrderForUser(orderId) : orderApi.findOrderForGuest(orderId)
    },

    staleTime: 3 * 60 * 1000
  })
  const orderDetail = orderData?.data.data

  //! Multi languages
  const { t } = useTranslation('support')
  const [stripeCheckoutError, setStripeCheckoutError] = useState('')

  const createStripeCheckoutMutation = useMutation({
    mutationFn: () => paymentApi.createCheckoutSession({ order_id: orderId }, { isGuest: !isAuthenticated }),
    onSuccess: (response) => {
      const checkoutUrl = response.data.data.checkout_url
      if (checkoutUrl) {
        window.location.href = checkoutUrl
        return
      }
      setStripeCheckoutError(t('Order payment.Unable to start Stripe checkout'))
    },
    onError: (error) => {
      let errMsg = ''
      if (isAxiosBadRequestError<ErrorRespone>(error)) {
        const formError = error.response?.data
        if (formError) {
          errMsg = HttpStatusMessage.get(formError.error_key) || ''
        }
      }
      setStripeCheckoutError(errMsg || t('Order payment.Stripe checkout error'))
    }
  })

  const handleStripeCheckout = () => {
    if (!orderId || createStripeCheckoutMutation.isPending) return
    setStripeCheckoutError('')
    createStripeCheckoutMutation.mutate()
  }

  return (
    <div className='bg-lightBg py-2 duration-200 dark:bg-darkBg tablet:py-3 desktopLarge:py-4'>
      {!orderDetail && <LoadingSection />}
      {orderDetail && (
        <div className='container space-y-6'>
          <PathBar
            pathList={[
              { pathName: t('path.order tracking'), url: orderTrackingPath.orderTracking },
              {
                pathName: orderId,
                url: orderUrl
              },
              { pathName: t('Order payment.Payment Page'), url: currentUrl }
            ]}
          />
          <p className='inline-block w-full text-pretty text-center text-xl font-bold uppercase leading-6 tracking-wider tablet:text-2xl desktop:text-3xl'>
            <span className=''>{t('Order payment.Payment Page')}</span>
          </p>

          <DividingBorder />

          <div className='space-y-4 desktop:text-lg'>
            <p className=''>
              <span className=''>{t('Order payment.Dear')}</span>{' '}
              <span className='font-semibold'>{orderDetail.name}</span>
            </p>
            <p className=''>
              <span className=''>{t('Order payment.Thank you for ordering from ')}</span>
              <span className='font-semibold text-haretaColor'>Hareta Workshop</span>{' '}
              <span className=''>
                {t('Order payment.. We appreciate your business and are delighted to serve you.')}
              </span>
            </p>
            <p className=''>
              <span className=''>
                {t('Order payment.To complete your purchase, please transfer the payment within ')}
              </span>{' '}
              <span className='font-semibold text-haretaColor'>{t('Order payment.48 hours')}</span>{' '}
              <span className=''>
                {t(
                  'Order payment. from the time you placed your order. Use the following details to make the payment:'
                )}
              </span>
            </p>
          </div>

          <DividingBorder />

          <div className='flex w-full justify-center'>
            <div className='w-full space-y-4 tablet:w-8/12 desktop:w-6/12 desktop:text-lg'>
              <p className='text-xl font-semibold uppercase desktop:text-2xl'>{t('Order payment.Order Information')}</p>
              <div className='grid grid-cols-3 gap-2'>
                <span className='col-span-1'>{t('Order payment.Order ID:')}</span>
                <span className='col-span-2 font-medium text-haretaColor'>{orderId}</span>
              </div>
              <div className='grid grid-cols-3 gap-2'>
                <span className='col-span-1'>{t('Order payment.Total Amount:')}</span>
                <span className='col-span-2 font-medium text-haretaColor'>${orderDetail.total}</span>
              </div>
            </div>
          </div>

          <DividingBorder />

          <div className='flex w-full flex-col items-center justify-center space-y-3 text-center'>
            <p className='text-base font-medium tablet:text-lg'>
              {t('Order payment.Have you not yet completed the payment?')}
            </p>
            <button
              disabled={createStripeCheckoutMutation.isPending}
              onClick={handleStripeCheckout}
              className='w-full rounded-2xl bg-haretaColor px-6 py-3 font-semibold text-darkText transition hover:bg-primaryColor disabled:cursor-not-allowed disabled:opacity-60 tablet:w-auto'
            >
              {createStripeCheckoutMutation.isPending
                ? t('Order payment.Redirecting to Stripe...')
                : t('Order payment.Pay with Stripe')}
            </button>
            {stripeCheckoutError && <p className='text-sm font-medium text-red-500'>{stripeCheckoutError}</p>}
          </div>

          <DividingBorder />

          <div className='w-full space-y-4  text-pretty desktop:text-lg'>
            <p className='text-center text-xl font-semibold uppercase desktop:text-2xl'>
              {t('Order payment.Payment option')}
            </p>
            <div className='grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:gap-6'>
              <div className='col-span-1 space-y-4 bg-lightColor900 p-4 dark:bg-darkColor900'>
                <p className='w-full text-center text-lg font-medium uppercase desktop:text-xl'>
                  {t('Order payment.National payment (Vietnam)')}
                </p>
                <div className='flex w-full items-center justify-center'>
                  <div className='w-8/12 mobileLarge:w-6/12 desktop:w-4/12'>
                    <div className='relative w-full pt-[100%]'>
                      <img
                        src='/images/hareta_qrcode.png'
                        alt='QR CODE'
                        className='absolute left-0 top-0 h-full w-full'
                      />
                    </div>
                  </div>
                </div>
                <p className=''>{t('Order payment.Please transfer the total amount to the following bank account:')}</p>
                <div className='grid grid-cols-3 gap-4'>
                  <span className='col-span-1'>{t('Order payment.Bank Name:')}</span>
                  <span className='col-span-2 font-semibold'>Vietcombank</span>
                </div>
                <div className='grid grid-cols-3 gap-2 desktop:gap-4'>
                  <span className='col-span-1'>{t('Order payment.Account Number:')}</span>
                  <span className='col-span-2 font-semibold'>9394030604</span>
                </div>
                <div className='grid grid-cols-3 gap-2 desktop:gap-4'>
                  <span className='col-span-1'>{t('Order payment.Account Name:')}</span>
                  <span className='col-span-2 font-semibold'>Le Tien Thanh</span>
                </div>
                <div className='grid grid-cols-3 gap-2 desktop:gap-4'>
                  <span className='col-span-1'>{t('Order payment.Reference:')}</span>
                  <span className='col-span-2 font-semibold text-haretaColor'>{orderId}</span>
                </div>
              </div>

              <div className='col-span-1 space-y-4 bg-lightColor900 p-4 dark:bg-darkColor900'>
                <p className='w-full text-center text-lg font-medium uppercase desktop:text-xl'>
                  {t('Order payment.International payment')}
                </p>
                <div className='flex w-full items-center justify-center'>
                  <div className='w-8/12 mobileLarge:w-6/12 desktop:w-4/12'>
                    <div className='relative w-full pt-[100%]'>
                      <img
                        src='/images/hareta_qrcode.png'
                        alt='QR CODE'
                        className='absolute left-0 top-0 h-full w-full'
                      />
                    </div>
                  </div>
                </div>
                <p className=''>
                  <span className=''>{t('Order payment.Please send the total amount to our PayPal account: ')}</span>
                  <span className='font-medium'>paypal.me/thanhletien364</span>
                </p>
                <p className=''>
                  <span className=''>{t('Order payment.Include the order ID ')}</span>
                  <span className='font-medium text-haretaColor'>{orderId}</span>
                  <span className=''>{t('Order payment. in the note.')}</span>
                </p>
              </div>
            </div>
          </div>

          <DividingBorder />

          <div className='w-full space-y-4  text-pretty desktop:text-lg'>
            <p className=''>
              <span className=''>{t('Order payment.Please ensure that the payment is completed within ')}</span>
              <span className='font-medium text-haretaColor'>{t('Order payment.48 hours')}</span>
              <span className=''>{t('Order payment. to avoid cancellation of your order.')}</span>
            </p>

            <p className=''>
              <span className=''>
                {t(
                  'Order payment.Once your payment is confirmed, we will proceed with preparing and shipping your order. You can track the status of your order on our website under the'
                )}{' '}
              </span>
              <Link to={orderUrl} className='font-medium text-haretaColor'>
                {t('Order payment.Order Tracking')}
              </Link>
              <span className=''>{t('Order payment. section.')}</span>
            </p>

            <p className=''>
              <span className=''>{t('Order payment.Thank you for trusting ')}</span>
              <span className='font-medium text-haretaColor'>Hareta Workshop</span>
              <span className=''>{t('Order payment.. We look forward to serving you again.')}</span>
            </p>

            <div className=''>
              <p className=''>{t('Order payment.Best regards,')}</p>
              <p className=''>{t('Order payment.Hareta Workshop Team')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
