import http from 'src/utils/http'
import { SuccessRespone } from 'src/types/utils.type'
interface PasswordRecovery {
  data?: string
  status_code?: number
  message?: string
  log?: string
  error_key?: string
  email?: string
}

const URL_CODE = '/password-recovery/'
const URL_REQUEST = '/password-recovery/'
const URL_CHANGEPASSWORD = '/password-recovery/recovery'

const passwordRecovery = {
  verifySlug(slug: string) {
    return http.get<SuccessRespone<PasswordRecovery>>(`${URL_CODE}?slug=${slug}`)
  },
  requestRecovery(body: { email: string }) {
    return http.post<SuccessRespone<PasswordRecovery>>(URL_REQUEST, body)
  },
  changePassword(body: { slug: string; password: string }) {
    return http.post<SuccessRespone<PasswordRecovery>>(URL_CHANGEPASSWORD, body)
  }
}

export default passwordRecovery
