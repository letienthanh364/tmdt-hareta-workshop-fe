import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import i18next from 'i18next'
import { Fragment, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { orderApi } from 'src/apis/order.api'
import LoadingSection from 'src/components/LoadingSection'
import mainPath from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import useOrderStatus from 'src/hooks/useOrderStatus'
import { useViewport } from 'src/hooks/useViewport'
import { OrderPurchaseListConfig, Order } from 'src/types/order.type'
import { formatDate, formatDateEn, formatDateVi, generateNameId } from 'src/utils/utils'

interface Props {
  order: Order
}

export default function OrderTrackingOrderItem({ order }: Props) {
  const { isAuthenticated } = useContext(AppContext)

  //! Responsive
  const isMobile = useViewport().width < 768

  //! Multi languages
  const { t } = useTranslation('support')
  const currentLan = i18next.language

  //! Order states
  const OrderStates = useOrderStatus()

  //! get products of order
  const orderPurchaseListConfig: OrderPurchaseListConfig = {
    order_id: order.id,
    page: 1,
    limit: 20
  }
  const { data: purchasesData } = useQuery({
    queryKey: ['orders', order.id, 'purchases'],
    queryFn: () => {
      return orderApi.getPurchaseListOfOrderForUser(orderPurchaseListConfig)
    },
    enabled: isAuthenticated,
    staleTime: 3 * 60 * 1000
  })
  const purchaseList = purchasesData?.data.data || []
  const totalPurchases = purchasesData?.data.paging.total as number
  const productList = purchaseList.map((purchase) => purchase.item)
  const remain = isMobile ? (totalPurchases > 1 ? totalPurchases - 1 : 0) : totalPurchases > 3 ? totalPurchases - 3 : 0
  const diplayedProducts = isMobile ? productList.splice(0, 1) : productList.splice(0, 3)

  //! HANDLE ENTER ITEM
  const navigate = useNavigate()
  const handleClickItem = () => {
    navigate({
      pathname: `${mainPath.orderTracking}/${generateNameId({ name: formatDate(order.created_at), id: order.id })}`
    })
  }

  //! Styles
  const wrapperClassname = classNames({
    'flex flex-col space-y-1': isMobile,
    'grid grid-cols-3 gap-2 tablet:gap-4 w-full': !isMobile
  })
  const titleClassname = 'text-sm tablet:text-sm desktop:text-base text-left col-span-1 truncate'
  const infoClassname = 'text-sm font-medium text-left tablet:text-sm desktop:text-base col-span-2'

  return (
    <Fragment>
      {!purchasesData && <LoadingSection />}
      {purchasesData && (
        <button
          className='w-full grid-cols-4 space-y-4 overflow-hidden px-4 py-4 tablet:px-6 desktop:px-8 desktop:py-8'
          onClick={handleClickItem}
        >
          {!isMobile && (
            <div className='grid grid-cols-6 gap-2 font-semibold uppercase tablet:gap-4 desktop:grid-cols-7 desktop:text-lg'>
              <div className='col-span-4 desktop:col-span-5'>
                <p className='text-center text-sm tablet:text-base desktop:text-lg'>{t('orderDetail.order')}</p>
              </div>
              <div className='cols-span-1'>
                <p className='text-center text-sm tablet:text-base desktop:text-lg'>{t('orderDetail.day created')}</p>
              </div>
              <div className='col-span-1'>
                <p className='text-center text-sm tablet:text-base desktop:text-lg'>{t('orderDetail.state')}</p>
              </div>
            </div>
          )}

          <div className='space-y-3 tablet:grid tablet:grid-cols-6 tablet:gap-2 desktop:grid-cols-7 desktop:gap-4'>
            <div className='col-span-4 space-y-3 text-pretty desktop:col-span-5'>
              <div className={wrapperClassname}>
                <span className={titleClassname}>{t('orderDetail.Order id')}</span>
                <span className={classNames(infoClassname, 'text-haretaColor')}>{order.id}</span>
              </div>
              <div className={wrapperClassname}>
                <span className={titleClassname}>{t('orderDetail.Customer')}</span>
                <div className={classNames(infoClassname, 'inline-block shrink-0 items-center')}>
                  <span className=''>{order.name}</span>
                  {'  -  '}
                  <span className=''>{order.phone}</span>
                </div>
              </div>
              <div className={wrapperClassname}>
                <span className={titleClassname}>{t('orderDetail.Email')}</span>
                <span className={infoClassname}>{order.email}</span>
              </div>
              <div className={wrapperClassname}>
                <span className={titleClassname}>{t('orderDetail.Address')}</span>
                <span className={infoClassname}>{order.address}</span>
              </div>
            </div>

            <div
              className={classNames({
                'flex flex-col space-y-1': isMobile,
                'col-span-1 flex min-h-full items-center justify-center text-sm desktop:text-base': !isMobile
              })}
            >
              {isMobile && <span className={titleClassname}>{t('orderDetail.day created')}</span>}
              <p
                className={classNames(
                  isMobile ? infoClassname : 'flex h-full flex-col items-center justify-center text-center font-medium'
                )}
              >
                {currentLan == 'en' ? formatDateEn(order.created_at) : formatDateVi(order.created_at)}
              </p>
            </div>
            <div
              className={classNames({
                'flex flex-col space-y-1': isMobile,
                'col-span-1 flex min-h-full items-center justify-center text-sm desktop:text-base': !isMobile
              })}
            >
              {isMobile && <span className={titleClassname}>{t('orderDetail.state')}</span>}
              <span
                className={classNames(
                  'text-haretaColor',
                  isMobile ? infoClassname : 'col-span-1 flex min-h-full items-center justify-center font-semibold'
                )}
              >
                {OrderStates[order.status]}
              </span>
            </div>
          </div>

          <div className='grid w-full grid-cols-2 gap-2 tablet:grid-cols-4 tablet:gap-4 desktop:gap-6'>
            <div className='cols-span-1 tablet:col-span-3'>
              <div className='grid w-full grid-cols-1 gap-2 tablet:grid-cols-3 tablet:gap-4 desktop:gap-6'>
                {diplayedProducts.map((product) => {
                  const avatarURL = product.avatar ? product.avatar.url : null
                  return (
                    <div className='col-span-1' key={product.id}>
                      <div className='relative w-full overflow-hidden rounded-md pt-[100%] tablet:rounded-lg'>
                        {avatarURL ? (
                          <img
                            src={avatarURL}
                            alt={product.name}
                            className='absolute left-0 top-0 h-full w-full object-cover'
                          />
                        ) : (
                          <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center bg-lightColor500 dark:bg-darkColor500'>
                            <FontAwesomeIcon icon={faTriangleExclamation} fontSize={60} />
                          </div>
                        )}
                      </div>
                      <p className='mt-2 w-full text-center text-xs font-medium tablet:text-sm desktopLarge:text-base'>
                        {product.name}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
            {remain > 0 && (
              <div className='col-span-1'>
                <div className='relative w-full rounded-md border border-black/60 pt-[100%] dark:border-white/60 tablet:rounded-lg'>
                  <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center text-center text-2xl font-bold text-haretaColor tablet:text-3xl desktop:text-4xl'>
                    + {remain}
                  </div>
                </div>
              </div>
            )}
          </div>
        </button>
      )}
    </Fragment>
  )
}
