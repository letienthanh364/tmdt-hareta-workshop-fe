import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation, useQuery } from '@tanstack/react-query'
import { keyBy } from 'lodash'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import purchaseApi from 'src/apis/cart.api'
import mainPath from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { CartContext } from 'src/contexts/cart.context'
import { PurchaseList } from 'src/types/cart.type'
import HeaderPurchaseCard from '../HeaderPurchaseCard'
import FloatingOnClick from 'src/components/FoatingOnClick'

interface Props {
  refetch: () => void
  cartData: PurchaseList | undefined
}

function PopoverSection({ refetch, cartData }: Props) {
  const { extendedPurchases } = useContext(CartContext)
  const { isAuthenticated } = useContext(AppContext)

  const removePurchasesMutation = useMutation({
    mutationFn: purchaseApi.removePurchases,
    onSuccess: () => {
      refetch()
    }
  })

  const handleRemove = (purchaseIndex: number) => () => {
    if (!isAuthenticated) return
    const purchaseId = extendedPurchases[purchaseIndex].id
    removePurchasesMutation.mutate({ id: purchaseId })
  }

  //! Multi languages
  const { t } = useTranslation('header')
  const purchaseList = cartData?.data || []

  return (
    <div className='relative -top-1 w-[360px] rounded-xl bg-lightColor700 py-2 text-sm text-darkText shadow-md dark:bg-darkColor700 dark:text-lightText desktop:top-0'>
      <Fragment>
        <div className='flex space-x-1.5 px-3 py-1 text-base desktop:text-lg'>
          <span className='text-haretaColor'>{cartData ? cartData?.paging.total : 0}</span>
          <span className='text-gray-500 dark:text-gray-300'>{t('cart button.items in cart')}</span>
        </div>
        <div className='m-2 overflow-y-auto overflow-x-hidden rounded-md bg-lightColor900 outline outline-1 outline-black/20 dark:bg-darkColor900 dark:outline-white/20'>
          {purchaseList.length > 0 ? (
            <div className='max-h-[360px] min-h-[240px] overflow-y-auto'>
              {purchaseList.map((purchase, index) => (
                <HeaderPurchaseCard
                  key={purchase.id}
                  purchase={purchase}
                  handleRemove={handleRemove(index)}
                  isDisabled={removePurchasesMutation.isPending}
                />
              ))}
            </div>
          ) : (
            <div className=''>
              <img src='/images/empty_cart.png' alt='Empty cart' className='m-2' />
            </div>
          )}
        </div>
      </Fragment>

      <div className='mx-3 mb-2 mt-4 flex items-center justify-between font-medium text-black'>
        <NavLink to={mainPath.store}>
          <button className='justify-self-start rounded-md bg-haretaColor px-4 py-1 text-sm hover:bg-primaryColor '>
            {t('cart button.store')}
          </button>
        </NavLink>
        <NavLink to={mainPath.cart}>
          <button className='justify-self-start rounded-md bg-haretaColor px-4 py-1 text-sm hover:bg-primaryColor'>
            {t('cart button.enter cart')}
          </button>
        </NavLink>
      </div>
      <div className='absolute -top-4 right-0 h-4 w-1/4 bg-none'></div>
    </div>
  )
}

export default function HeaderDesktopCartLogged() {
  const { extendedPurchases, setExtendedPurchases } = useContext(CartContext)
  const { isAuthenticated } = useContext(AppContext)

  //! Handle floating
  const [isOpen, setIsOpen] = useState<boolean>(false)

  //! Handle cart data
  const { data: cartDataResponese, refetch } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => purchaseApi.getPurchases(),
    staleTime: 1000 * 60 * 3,
    enabled: isAuthenticated
  })
  const cartData = cartDataResponese?.data
  const purchasesInCart = cartDataResponese?.data.data

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, 'id')
      return (
        purchasesInCart?.map((purchase) => ({
          ...purchase,
          disabled: false,
          checked: Boolean(extendedPurchasesObject[purchase.id]?.checked),
          previousQuantity: purchase.quantity,
          discount: purchase.item.discount
        })) || []
      )
    })
  }, [purchasesInCart, setExtendedPurchases])

  return (
    <div className='rounded-lg bg-haretaColor duration-200 dark:bg-haretaColor'>
      <FloatingOnClick
        renderPopover={<PopoverSection refetch={refetch} cartData={cartData} />}
        className='flex border border-none px-1.5 py-1 desktop:px-2'
        placement='bottom-end'
        offsetValue={12}
        isOpen={isOpen}
        openChange={setIsOpen}
      >
        <div className='flex items-center space-x-2 px-2 py-0.5 text-black'>
          <FontAwesomeIcon icon={faCartShopping} />
          {extendedPurchases.length > 0 && (
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-medium text-darkText desktop:text-sm desktopLarge:text-base'>
              {extendedPurchases.length}
            </div>
          )}
        </div>
      </FloatingOnClick>
    </div>
  )
}
