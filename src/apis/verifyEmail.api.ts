import { SuccessRespone } from 'src/types/utils.type'
import http from 'src/utils/http'

interface VerifyEmail {
  data?: string
  status_code?: number
  message?: string
  log?: string
  error_key?: string
}

const URL_CODE = '/check-verification-code'
const URL_REQUEST = '/send-verification-code'

const verifyEmail = {
  verifyCode(code: string) {
    return http.get<SuccessRespone<VerifyEmail>>(`${URL_CODE}/${code}`)
  },
  requestVerify(body: { email: string }) {
    return http.post<SuccessRespone<VerifyEmail>>(URL_REQUEST, body)
  }
}

export default verifyEmail
