import { useTranslation } from 'react-i18next'
import { useViewport } from 'src/hooks/useViewport'
import { Order } from 'src/types/order.type'
import useOrderStatus from 'src/hooks/useOrderStatus'
import classNames from 'classnames'
import OrderTrackingNavigateToPayment from '../OrderTrackingNavigateToPayment'

interface Props {
  orderDetail: Order
}

interface Status {
  stateNumber: number
  stateTitle: string
  stateDescription: string
}

export default function OrderTrackingOrderStatus({ orderDetail }: Props) {
  const isMobile = useViewport().width < 768

  //! Multi languages
  const { t } = useTranslation('support')
  const OrderState = useOrderStatus()

  //! Handle status
  const orderStatus = orderDetail.status
  const statusList: Status[] = [
    {
      stateNumber: 0,
      stateTitle: OrderState[0],
      stateDescription: t('Order state.Payment information is being confirmed.')
    },
    {
      stateNumber: 1,
      stateTitle: OrderState[1],
      stateDescription: t('Order state.Your order is being prepared.')
    },
    {
      stateNumber: 2,
      stateTitle: OrderState[2],
      stateDescription: t('Order state.Your order has been packed and handed over to the shipping unit.')
    },
    {
      stateNumber: 3,
      stateTitle: OrderState[3],
      stateDescription: t(
        'Order state.Your order has been successfully delivered! We hope you have a pleasant experience.'
      )
    }
  ]

  return (
    <div className='space-y-6 pb-6'>
      <p className='flex justify-center space-x-2 font-semibold tablet:text-lg desktop:space-x-4 desktop:text-xl'>
        <span className='uppercase'>{t('orderDetail.Order id')}</span>
        <span className='text-haretaColor'>{orderDetail.id}</span>
      </p>
      {!isMobile && (
        <div className='grid w-full grid-cols-4 gap-2'>
          {statusList.map((status, index) => {
            const isHead = index == 0
            const isTail = index == 3
            return (
              <div
                key={status.stateNumber}
                className={classNames('col-span-1 space-y-6', {
                  'opacity-20': orderStatus < index
                })}
              >
                <div className='relative flex h-12 items-center justify-center desktop:h-16'>
                  <div className='flex h-full w-full '>
                    {!isHead && (
                      <div className='border-[24px] border-y-successGreen border-l-transparent border-r-successGreen desktop:border-[32px]' />
                    )}
                    <div className={classNames('h-full w-full bg-successGreen')} />
                  </div>
                  {!isTail && (
                    <div
                      className={classNames(
                        'absolute right-0 translate-x-12 border-[24px] border-y-transparent border-l-successGreen border-r-transparent desktop:translate-x-16 desktop:border-[32px]'
                      )}
                    />
                  )}
                  <div
                    className={classNames(
                      'absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center truncate',
                      {
                        'pl-8 pr-2 desktop:pl-12 desktop:pr-4': !isHead,
                        'pl-2 pr-2 desktop:pl-4 desktop:pr-4': isHead
                      }
                    )}
                  >
                    <span
                      className={classNames(
                        'w-full overflow-hidden text-center font-bold uppercase text-darkText tablet:text-lg desktop:text-xl'
                      )}
                    >
                      {status.stateTitle}
                    </span>
                  </div>
                </div>
                <div className='space-y-4 text-pretty pl-8'>
                  <p className='text-sm tablet:text-base desktop:text-lg'>{status.stateDescription}</p>
                  {isHead && orderStatus == 0 && <OrderTrackingNavigateToPayment order={orderDetail} />}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {isMobile && (
        <div className='w-full space-y-6'>
          {statusList.map((status, index) => {
            const isHead = index == 0
            const isTail = index == 3
            return (
              <div
                key={status.stateNumber}
                className={classNames('col-span-1 space-y-2', {
                  'opacity-20': orderStatus < index
                })}
              >
                <div className='relative flex h-10 items-center justify-center'>
                  <div className='flex h-full w-full '>
                    {!isHead && (
                      <div className='border-[20px] border-y-successGreen border-l-transparent border-r-successGreen' />
                    )}
                    <div className={classNames('h-full w-full bg-successGreen')} />
                    {isTail ? (
                      <div className='h-full w-5 bg-transparent' />
                    ) : (
                      <div
                        className={classNames(
                          'border-[20px] border-y-transparent border-l-successGreen border-r-transparent'
                        )}
                      />
                    )}
                  </div>
                  <div
                    className={classNames(
                      'absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center truncate',
                      {
                        'px-10': !isHead,
                        'pl-5 pr-10': isHead
                      }
                    )}
                  >
                    <span
                      className={classNames(
                        'w-full overflow-hidden text-center font-bold uppercase text-darkText tablet:text-lg desktop:text-xl'
                      )}
                    >
                      {status.stateTitle}
                    </span>
                  </div>
                </div>
                <div className='space-y-4 text-pretty pl-5 pr-10'>
                  <p className=''>{status.stateDescription}</p>
                  {isHead && orderStatus == 0 && <OrderTrackingNavigateToPayment order={orderDetail} />}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
