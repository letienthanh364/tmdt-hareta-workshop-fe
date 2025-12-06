import { SuccessRespone } from 'src/types/utils.type'
import http from 'src/utils/http'

interface CreateCheckoutPayload {
  order_id: string
}

interface StripeCheckoutData {
  checkout_url: string
  session_id?: string
}

const authCheckoutUrl = '/auth/payment/checkout'
const guestCheckoutUrl = '/payment/checkout'

const paymentApi = {
  createCheckoutSession(body: CreateCheckoutPayload, options?: { isGuest?: boolean }) {
    const url = options?.isGuest ? guestCheckoutUrl : authCheckoutUrl
    return http.post<SuccessRespone<StripeCheckoutData>>(url, body)
  }
}

export default paymentApi
