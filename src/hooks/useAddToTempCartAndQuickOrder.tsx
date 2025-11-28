import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import purchaseApi from 'src/apis/cart.api'
import mainPath from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { CartContext } from 'src/contexts/cart.context'
import { OrderContext } from 'src/contexts/order.context'
import { ExtendedPurchase, Purchase } from 'src/types/cart.type'
import { ProductType } from 'src/types/product.type'
import { setTemporaryPurchasesToLS } from 'src/utils/cartInLS'
import { setOrderListToLS } from 'src/utils/order'
import { showSuccessDialog } from 'src/utils/utils'

interface Props {
  activeProduct: ProductType
  quantity: number
  currentDateString: string
  setQuantity: React.Dispatch<React.SetStateAction<number>>
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setErrorDialog: React.Dispatch<React.SetStateAction<boolean>>
  setOrderingDialog: React.Dispatch<React.SetStateAction<boolean>>
  setCreateTempCart: React.Dispatch<React.SetStateAction<boolean>>
}

export default function useAddToTempCartAndQuickOrder({
  activeProduct,
  quantity,
  currentDateString,
  setQuantity,
  setErrorDialog,
  setOrderingDialog,
  setCreateTempCart,
  setVisible,
  setDialogIsOpen
}: Props) {
  const { isAuthenticated } = useContext(AppContext)
  const { extendedPurchases, temporaryPurchases, setTemporaryPurchases, setExtendedPurchases } = useContext(CartContext)
  const { setOrderList, setTempOrderList } = useContext(OrderContext)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  //! Create temporary cart
  const createTemporaryCart = () => {
    const newPurchase: Purchase = {
      id: activeProduct.id,
      created_at: currentDateString,
      updated_at: currentDateString,
      status: 0,
      quantity: quantity,
      item: activeProduct
    }
    const newTemporaryPurchases = [...temporaryPurchases, newPurchase]

    setTemporaryPurchasesToLS(newTemporaryPurchases)
    setTemporaryPurchases(newTemporaryPurchases)

    setCreateTempCart(false)
    setVisible && setVisible(false)
    setQuantity(1)
    showSuccessDialog(setDialogIsOpen)
  }

  //! Add to temporary cart
  const addToTemporaryCart = (replace?: boolean) => {
    const newPurchase: Purchase = {
      id: activeProduct.id,
      created_at: currentDateString,
      updated_at: currentDateString,
      status: 0,
      quantity: quantity,
      item: activeProduct
    }
    const purchaseIndex = temporaryPurchases.findIndex((purchase) => purchase.item.id === newPurchase.item.id)
    if (purchaseIndex !== -1) {
      const purchase = temporaryPurchases[purchaseIndex]
      const maxQuanityInStore = purchase.item.quantity
      const currentQuantityInCart = purchase.quantity
      const newQuantity = replace ? quantity : currentQuantityInCart + quantity
      if (newQuantity <= maxQuanityInStore) {
        const newPurchasesList = temporaryPurchases.map((purchase, index) => {
          if (index === purchaseIndex) {
            return { ...purchase, quantity: newQuantity }
          } else return purchase
        })
        setTemporaryPurchases(newPurchasesList)
        setTemporaryPurchasesToLS(newPurchasesList)
        setQuantity(1)
      } else {
        setErrorDialog(true)
        setQuantity(1)
      }
    } else {
      setTemporaryPurchases([...temporaryPurchases, newPurchase])
      setTemporaryPurchasesToLS([...temporaryPurchases, newPurchase])
    }
    setVisible && setVisible(false)
    showSuccessDialog(setDialogIsOpen)
  }

  //! Handle order
  const handleExtendedPurchaseListAndNavigating = (newExtendedPurchase: ExtendedPurchase) => {
    const newExtendedPurchaseList = [newExtendedPurchase]

    setExtendedPurchases(newExtendedPurchaseList)

    if (isAuthenticated) {
      setOrderList(newExtendedPurchaseList)
      setOrderListToLS(newExtendedPurchaseList)
    } else {
      setTempOrderList(newExtendedPurchaseList)
    }
    navigate(mainPath.order)
  }

  const addToCartMutation = useMutation({ mutationFn: purchaseApi.addToCart })
  const removePurchaseMutation = useMutation({
    mutationFn: purchaseApi.removePurchases
  })
  const handleOrder = async () => {
    setOrderingDialog(true)
    if (isAuthenticated) {
      const existedPurchase = extendedPurchases.find((purchase) => purchase.item.id == activeProduct.id)

      if (existedPurchase) {
        await removePurchaseMutation.mutateAsync({ id: existedPurchase.id })
      }
      addToCartMutation.mutate(
        { item_id: activeProduct.id, quantity: quantity },
        {
          onSettled: () => {
            setOrderingDialog(false)
          },
          onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] })
            const newPurchase = response.data.data
            const newExtendedPurchase: ExtendedPurchase = {
              ...newPurchase,
              item: activeProduct,
              disabled: false,
              checked: true,
              previousQuantity: quantity,
              discount: activeProduct.discount
            }
            handleExtendedPurchaseListAndNavigating(newExtendedPurchase)
          },
          onError: (error) => {
            console.error(error)
          }
        }
      )
    } else {
      temporaryPurchases.length == 0 ? createTemporaryCart() : addToTemporaryCart(true)
      const newExtendedPurchase: ExtendedPurchase = {
        id: currentDateString,
        created_at: currentDateString,
        updated_at: currentDateString,
        status: 0,
        quantity: quantity,
        item: activeProduct,
        disabled: false,
        checked: true,
        previousQuantity: quantity,
        discount: activeProduct.discount
      }
      handleExtendedPurchaseListAndNavigating(newExtendedPurchase)
    }
  }

  return {
    createTemporaryCart,
    addToTemporaryCart,
    handleOrder
  }
}
