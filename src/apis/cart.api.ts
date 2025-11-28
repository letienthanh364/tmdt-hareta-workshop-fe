import { Purchase, PurchaseList } from 'src/types/cart.type'
import { SuccessRespone } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'auth/cart/'

const purchaseApi = {
  addToCart(body: { item_id: string; quantity: number }) {
    return http.post<SuccessRespone<Purchase>>(URL, body)
  },
  getPurchases() {
    return http.get<PurchaseList>(URL)
  },
  updatePurchases(body: { id: string; quantity: number }) {
    return http.put(URL, body)
  },
  removePurchases(body: { id: string }) {
    return http.delete(URL, {
      data: body
    })
  }
}

export default purchaseApi
