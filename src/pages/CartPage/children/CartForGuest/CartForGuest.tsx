import { produce } from 'immer'
import keyBy from 'lodash/keyBy'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { CartContext } from 'src/contexts/cart.context'
import { useViewport } from 'src/hooks/useViewport'
import { OrderContext } from 'src/contexts/order.context'
import { setTempOrderListToLS } from 'src/utils/order'
import CartMobileForGuest from '../CartMobileForGuest'
import CartDesktopForGuest from '../CartDesktopForGuest'
import { setTemporaryPurchasesToLS } from 'src/utils/cartInLS'
import { ExtendedPurchase } from 'src/types/cart.type'

export default function CartForGuest() {
  const viewport = useViewport()
  const isMobile = viewport.width <= 768
  const { setTemporaryPurchases, temporaryPurchases } = useContext(CartContext)
  const [extendedTempPurchases, setExtendedTempPurchases] = useState<ExtendedPurchase[]>([])
  const { setTempOrderList } = useContext(OrderContext)

  useEffect(() => {
    setExtendedTempPurchases((prev) => {
      const extendedTempPurchasesObject = keyBy(prev, 'id')
      return (
        temporaryPurchases?.map((purchase) => ({
          ...purchase,
          disabled: false,
          checked: Boolean(extendedTempPurchasesObject[purchase.id]?.checked),
          previousQuantity: purchase.quantity,
          discount: purchase.item.discount
        })) || []
      )
    })
  }, [temporaryPurchases])

  const isAllChecked = extendedTempPurchases.every((purchase) => purchase.checked)
  const checkedPurchases = extendedTempPurchases.filter((purchase) => purchase.checked)

  const handleChecking = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedTempPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  const handleSelectAll = () => {
    setExtendedTempPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      setExtendedTempPurchases(
        produce((draft) => {
          draft[purchaseIndex].quantity = value
        })
      )
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedTempPurchases(
      produce((draft) => {
        draft[purchaseIndex].quantity = value
      })
    )
  }

  const handleRemove = (purchaseIndex: number) => () => {
    const purchaseId = extendedTempPurchases[purchaseIndex].id
    const newPurchaseList = temporaryPurchases.filter((purchase) => purchase.id !== purchaseId)
    setTemporaryPurchases(newPurchaseList)
    setTemporaryPurchasesToLS(newPurchaseList)
  }

  //! HANDLE CHECKOUT
  const handleCheckout = () => {
    setTempOrderList(checkedPurchases)
    setTempOrderListToLS(checkedPurchases)
  }

  return (
    <Fragment>
      {!isMobile && (
        <CartDesktopForGuest
          extendedTempPurchases={extendedTempPurchases}
          handleChecking={handleChecking}
          handleQuantity={handleQuantity}
          handleRemove={handleRemove}
          handleSelectAll={handleSelectAll}
          handleTypeQuantity={handleTypeQuantity}
          handleCheckout={handleCheckout}
        />
      )}

      {isMobile && (
        <CartMobileForGuest
          extendedTempPurchases={extendedTempPurchases}
          handleChecking={handleChecking}
          handleQuantity={handleQuantity}
          handleRemove={handleRemove}
          handleSelectAll={handleSelectAll}
          handleTypeQuantity={handleTypeQuantity}
          handleCheckout={handleCheckout}
        />
      )}
    </Fragment>
  )
}
