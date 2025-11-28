import { ExtendedPurchase, Purchase } from 'src/types/cart.type'

export const setExtendedPurchasesToLS = (extendedPurchases: ExtendedPurchase[]) => {
  localStorage.setItem('extended_purchases', JSON.stringify(extendedPurchases))
}

export const getExtendedPurchasesFromLS = (): ExtendedPurchase[] => {
  const res = localStorage.getItem('extended_purchases')
  return res ? JSON.parse(res) : []
}

export const setTemporaryPurchasesToLS = (extendedPurchases: Purchase[]) => {
  localStorage.setItem('temp_purchases', JSON.stringify(extendedPurchases))
}

export const getTemporaryPurchasesFromLS = (): Purchase[] => {
  const res = localStorage.getItem('temp_purchases')
  return res ? JSON.parse(res) : []
}

export const setExtendedTempPurchasesToLS = (extendedPurchases: ExtendedPurchase[]) => {
  localStorage.setItem('extended_temp_purchases', JSON.stringify(extendedPurchases))
}

export const getExtendedTempPurchasesFromLS = (): ExtendedPurchase[] => {
  const res = localStorage.getItem('extended_temp_purchases')
  return res ? JSON.parse(res) : []
}
