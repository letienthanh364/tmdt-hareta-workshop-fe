import { PurchaseList } from 'src/types/cart.type'
import { Order, OrderList, OrderListConfig, OrderPurchaseListConfig } from 'src/types/order.type'
import { SuccessRespone } from 'src/types/utils.type'
import http from 'src/utils/http'
import { OrderSchema, OrderSchemaForGuest } from 'src/utils/rules'

const orderURL = '/auth/order/'
const itemOrderURL = '/auth/item-order/'

type CreateOrderForm = OrderSchema

type CreateOrderFormForGuest = OrderSchemaForGuest

export const orderApi = {
  getOrderList() {
    return http.get<OrderList>(orderURL)
  },
  createOrderForUser(body: CreateOrderForm) {
    return http.post<SuccessRespone<Order>>(orderURL, body)
  },
  createOrderForGuest(body: CreateOrderFormForGuest) {
    return http.post<SuccessRespone<Order>>('/order', body)
  },
  updateOrder(body: { id: string; status: string }) {
    return http.put<SuccessRespone<string>>(orderURL, body)
  },
  getPurchaseListOfOrderForUser(params: OrderPurchaseListConfig) {
    return http.get<PurchaseList>(itemOrderURL, { params })
  },
  getPurchaseListOfOrderForGuest(params: OrderPurchaseListConfig) {
    return http.get<PurchaseList>('/item-order', { params })
  },
  findOrderForUser(id: string) {
    return http.get<SuccessRespone<Order>>(`${orderURL}${id}`)
  },
  findOrderForGuest(id: string) {
    return http.get<SuccessRespone<Order>>(`/order/${id}`)
  },
  getOrderListForAdmin(params: OrderListConfig) {
    return http.get<OrderList>(`/auth/order/admin`, { params })
  },
  findOrderForAdmin(id: string) {
    return http.get<SuccessRespone<Order>>(`/auth/order/admin/${id}`)
  }
}
