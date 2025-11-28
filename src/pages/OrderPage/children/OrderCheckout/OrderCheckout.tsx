import { Link, useNavigate } from 'react-router-dom'
import mainPath, { orderPath } from 'src/constants/path'
import { useViewport } from 'src/hooks/useViewport'
import { OrderSchema, OrderSchemaForGuest, orderSchema } from 'src/utils/rules'
import { FormProvider, useForm } from 'react-hook-form'
import { useContext, useEffect, useState } from 'react'
import { OrderContext } from 'src/contexts/order.context'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderApi } from 'src/apis/order.api'
import { AppContext } from 'src/contexts/app.context'
import { setOrderListToLS, setTempOrderListToLS } from 'src/utils/order'
import PathBar from 'src/components/PathBar'
import userApi from 'src/apis/user.api'
import { CartContext } from 'src/contexts/cart.context'
import { useTranslation } from 'react-i18next'
import productApi from 'src/apis/product.api'
import purchaseApi from 'src/apis/cart.api'
import OrderSuccessDialog from '../../components/OrderSuccessDialog'
import OrderProcessingDialog from '../../components/OrderProcessingDialog'
import OrderUnavailableDialog from '../../components/OrderUnavailableDialog'
import OrderCheckoutDesktop from '../OrderCheckoutDesktop'
import OrderCheckoutMobile from '../OrderCheckoutMobile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { formatDate, generateNameId, isAxiosBadRequestError } from 'src/utils/utils'
import { Order } from 'src/types/order.type'
import OrderErrorDialog from '../../components/OrderErrorDialog'
import { HttpStatusMessage } from 'src/constants/httpStatusMessage'
import { ErrorRespone } from 'src/types/utils.type'

export default function OrderCheckout() {
  const {
    orderList,
    addressCountry,
    addressState,
    addressCity,
    setOrderList,
    setConfirmPayment,
    tempOrderList,
    setTempOrderList
  } = useContext(OrderContext)
  const { isAuthenticated } = useContext(AppContext)
  const { temporaryPurchases, setTemporaryPurchases, setUnavailablePurchaseIds } = useContext(CartContext)

  const [successDialog, setSuccesDialog] = useState(false)
  const [orderId, setOrderId] = useState<string>('')
  const [processingDialog, setProcessingDialog] = useState<boolean>(false)
  const [unavailableOrder, setUnavailableOrder] = useState<boolean>(false)
  const [successOrder, setSuccessOrder] = useState<Order | null>(null)
  const [errorDialog, setErrorDialog] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const viewPort = useViewport()
  const isMobile = viewPort.width <= 768

  //! ORDER FORM
  const idList = orderList.map((orderItem) => orderItem.id)
  const methods = useForm<OrderSchema>({
    defaultValues: {
      // name: '',
      // phone: '',
      // email: '',
      // address: '',
      id: idList
    },
    resolver: yupResolver(orderSchema)
  })
  const { getValues, handleSubmit, setValue, clearErrors } = methods

  //? ORDER FORM FOR GUEST
  const itemList = tempOrderList.map((purchase) => ({ id: purchase.item.id, quantity: purchase.quantity }))

  //! GET USER INFO
  const { data: userData } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile,
    staleTime: 1000 * 60 * 3,
    enabled: isAuthenticated
  })
  const profile = userData?.data.data

  //! HANDLE FILL USER INFO
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name || '')
      setValue('phone', profile.phone || '')
      setValue('email', profile.email || '')
    }
  }, [profile, setValue, clearErrors])

  //! GET CART DATA AND HANDLE CONFILCT QUANTITY
  const { data: cartData, refetch: refetchCartData } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => purchaseApi.getPurchases(),

    enabled: isAuthenticated
  })
  const cartItemList = cartData?.data.data || []
  const purchaseList = cartItemList.filter((cartItem) => {
    return idList.includes(cartItem.id)
  })
  const unavailablepurchases = purchaseList.filter((purchase) => {
    return purchase.quantity > purchase.item.quantity
  })

  //! Placing order for user
  const queryClient = useQueryClient()
  const createOrderMutation = useMutation({ mutationFn: orderApi.createOrderForUser })
  const onPlaceOrder = handleSubmit(async (data) => {
    setProcessingDialog(true)
    //? fetch data from store to check if available quantity
    refetchCartData()
    if (unavailablepurchases.length > 0) {
      setProcessingDialog(false)
      setUnavailableOrder(true)
      const unavailablePurchaseIds = unavailablepurchases.map((purchase) => purchase.id)
      setUnavailablePurchaseIds(unavailablePurchaseIds)
      return
    }
    try {
      const fullAddress = `${getValues('address')}, ${addressCity?.name}, ${addressState?.name}, ${
        addressCountry?.name
      }`
      createOrderMutation.mutate(
        { ...data, address: fullAddress },
        {
          onSuccess: (response) => {
            setSuccessOrder(response.data.data)
            setOrderId(response.data.data.id)
            queryClient.invalidateQueries({ queryKey: ['purchases'] })
            setProcessingDialog(false)
            setSuccesDialog(true)
          },
          onError: (error) => {
            let errMsg = ''
            if (isAxiosBadRequestError<ErrorRespone>(error)) {
              const formError = error.response?.data
              if (formError) {
                errMsg = HttpStatusMessage.get(formError.error_key) || ''
              }
            }
            setErrorMessage(errMsg || t('error.Something went wrong'))
            setErrorDialog(true)
          }
        }
      )
    } catch (error) {
      let errMsg = ''
      if (isAxiosBadRequestError<ErrorRespone>(error)) {
        const formError = error.response?.data
        if (formError) {
          errMsg = HttpStatusMessage.get(formError.error_key) || ''
        }
      }
      setErrorMessage(errMsg || t('error.Something went wrong'))
      setErrorDialog(true)
    }
  })

  //! Placing order for guest
  const getProductDataMutation = useMutation({ mutationFn: productApi.getProductDetail })
  const createOrderForGuestMutation = useMutation({ mutationFn: orderApi.createOrderForGuest })
  const placeOrderWithoutLogin = handleSubmit(async (data) => {
    setProcessingDialog(true)
    setErrorDialog(false)
    setSuccesDialog(false)
    //? fetch data to check quantity
    const unavailableTempPurchases = itemList.filter((item) => {
      getProductDataMutation.mutateAsync(item.id).then((productData) => {
        return productData.data.data.quantity < item.quantity
      })
      return false
    })
    if (unavailableTempPurchases.length > 0) {
      setProcessingDialog(false)
      setUnavailableOrder(true)
      const unavailableTempPurchaseIds = unavailableTempPurchases.map((purchase) => purchase.id)
      setUnavailablePurchaseIds(unavailableTempPurchaseIds)
      return
    }

    const fullAddress = `${getValues('address')}, ${addressCity?.name}, ${addressState?.name}, ${addressCountry?.name}`
    const formData: OrderSchemaForGuest = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: fullAddress,
      item: itemList
    }
    try {
      createOrderForGuestMutation.mutate(formData, {
        onSuccess: (response) => {
          setOrderId(response.data.data.id)
          queryClient.invalidateQueries({ queryKey: ['purchases'] })
          setProcessingDialog(false)
          setSuccesDialog(true)
          setErrorDialog(false)
        },
        onError: (error) => {
          let errMsg = ''
          if (isAxiosBadRequestError<ErrorRespone>(error)) {
            const formError = error.response?.data
            if (formError) {
              errMsg = HttpStatusMessage.get(formError.error_key) || ''
            }
          }
          setErrorMessage(errMsg || t('error.Something went wrong'))
          setErrorDialog(true)
        }
      })
    } catch (error) {
      let errMsg = ''
      if (isAxiosBadRequestError<ErrorRespone>(error)) {
        const formError = error.response?.data
        if (formError) {
          errMsg = HttpStatusMessage.get(formError.error_key) || ''
        }
      }
      setErrorMessage(errMsg || t('error.Something went wrong'))
      setErrorDialog(true)
    }
  })

  //! Handle confirm
  const navigate = useNavigate()

  const userConfirm = (failed: boolean) => {
    setSuccesDialog(false)
    setOrderList([])
    setOrderListToLS([])
    setConfirmPayment(false)
    if (failed) {
      navigate(mainPath.cart)
    } else {
      navigate(
        `${mainPath.orderTracking}/${generateNameId({
          name: formatDate(successOrder?.created_at as string),
          id: successOrder?.id as string
        })}/payment`
      )
    }
  }

  const guestConfirm = (failed: boolean) => {
    const orderIdList = tempOrderList.map((tempOrderItem) => tempOrderItem.id)
    setSuccesDialog(false)
    if (!failed) {
      setTemporaryPurchases(temporaryPurchases.filter((tempPurchase) => !orderIdList.includes(tempPurchase.id)))
    }
    setTempOrderList([])
    setTempOrderListToLS([])
    setConfirmPayment(false)
    if (failed) {
      navigate(mainPath.cart)
    } else {
      navigate(
        `${mainPath.orderTracking}/${generateNameId({
          name: formatDate(successOrder?.created_at as string),
          id: successOrder?.id as string
        })}/payment`
      )
    }
  }

  const handleConfirm = (failed: boolean) => () => {
    isAuthenticated ? userConfirm(failed) : guestConfirm(failed)
  }

  //! Multi languages
  const { t } = useTranslation('order')

  return (
    <div className='bg-lightBg py-2 duration-200 dark:bg-darkBg desktop:py-3 desktopLarge:py-4'>
      <div className='container space-y-6'>
        <PathBar
          pathList={[
            { pathName: t('path.Cart'), url: mainPath.cart },
            { pathName: t('path.Order'), url: orderPath.order },
            { pathName: t('path.Checkout'), url: orderPath.checkout }
          ]}
        />
        <div className='flex w-full items-center justify-start'>
          <Link
            to={isMobile ? mainPath.order : mainPath.cart}
            className='flex items-center justify-center space-x-2 rounded-xl bg-unhoveringBg px-4 py-2 font-medium text-darkText hover:bg-hoveringBg'
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            <span className=''>{isMobile ? t('bill.Back to order') : t('bill.Back to cart')}</span>
          </Link>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={isAuthenticated ? onPlaceOrder : placeOrderWithoutLogin}>
            {!isMobile && <OrderCheckoutDesktop />}

            {isMobile && <OrderCheckoutMobile />}
          </form>
        </FormProvider>
      </div>

      {/*  success dialog */}
      <OrderSuccessDialog
        handleConfirm={handleConfirm}
        isOpen={successDialog}
        handleClose={() => setSuccesDialog(false)}
        orderId={orderId}
      />

      {/*  Processing dialog */}
      {processingDialog && <OrderProcessingDialog />}

      {/*  Unavailable dialog */}
      <OrderUnavailableDialog
        handleConfirm={handleConfirm}
        isOpen={unavailableOrder}
        handleClose={() => setUnavailableOrder(false)}
      />

      <OrderErrorDialog
        isOpen={errorDialog}
        handleClose={() => {
          setErrorDialog(false)
        }}
        errorMessage={errorMessage}
      />
    </div>
  )
}
