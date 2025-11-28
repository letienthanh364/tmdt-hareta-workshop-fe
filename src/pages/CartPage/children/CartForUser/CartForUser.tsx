import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import React, { Fragment, useContext } from 'react'
import { CartContext } from 'src/contexts/cart.context'
import { useViewport } from 'src/hooks/useViewport'
import purchaseApi from 'src/apis/cart.api'
import { OrderContext } from 'src/contexts/order.context'
import { setOrderListToLS } from 'src/utils/order'
import CartDesktopForUser from '../CartDesktopForUser'
import CartMobileForUser from '../CartMobileForUser'

export default function CartForUser() {
  const viewport = useViewport()
  const isMobile = viewport.width <= 768
  const { extendedPurchases, setExtendedPurchases } = useContext(CartContext)
  const { setOrderList } = useContext(OrderContext)

  const isAllChecked = extendedPurchases.every((purchase) => purchase.checked)
  const checkedPurchases = extendedPurchases.filter((purchase) => purchase.checked)

  //! Choose purchase
  const handleChecking = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  const handleSelectAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  //! Remove purchase
  const queryClient = useQueryClient()
  const removePurchasesMutation = useMutation({
    mutationFn: purchaseApi.removePurchases,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
    }
  })

  const handleRemove = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex].id
    removePurchasesMutation.mutate({ id: purchaseId })
  }

  //! HANDLE CHECKOUT
  const handleCheckout = () => {
    setOrderList(checkedPurchases)
    setOrderListToLS(checkedPurchases)
  }

  return (
    <Fragment>
      {!isMobile && (
        <CartDesktopForUser
          handleCheckout={handleCheckout}
          handleChecking={handleChecking}
          handleRemove={handleRemove}
          handleSelectAll={handleSelectAll}
        />
      )}

      {isMobile && (
        <CartMobileForUser
          handleCheckout={handleCheckout}
          handleChecking={handleChecking}
          handleRemove={handleRemove}
          handleSelectAll={handleSelectAll}
        />
      )}
    </Fragment>
  )
}
