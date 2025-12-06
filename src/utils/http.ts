import axios, { AxiosError, type AxiosInstance } from 'axios'
import { clearLS, getAccessTokenFromLS, setAccessTokenToLS } from './auth'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { toast } from 'react-toastify'
import { ErrorRespone } from 'src/types/utils.type'
import { HttpErrorKeys } from 'src/constants/httpResponeErrorKey'
import { HttpResponseLogs } from 'src/constants/httpResponseLog'
import { HttpStatusMessage } from 'src/constants/httpStatusMessage'
import { t } from 'i18next'

// export const ApiURL = 'https://api.haretaworkshop.com/'
export const ApiURL = 'http://localhost:3000/'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: ApiURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = 'Bearer ' + this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === '/login') {
          const accessToken = response.data.data.token
          if (accessToken !== undefined) {
            this.accessToken = accessToken
            setAccessTokenToLS(accessToken)
          }
        }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.BadRequest) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const code = data?.error_key || error.code
          const message = HttpStatusMessage.get(code) || t('error messages.Network Error', { ns: 'utils' })
          toast.error(message)
        }

        const errorResponse = error.response?.data as ErrorRespone
        const errorKey = errorResponse.error_key
        const errorLog = errorResponse.log
        if (
          (error.response?.data as ErrorRespone).status_code === HttpStatusCode.InternalServerError ||
          errorKey == HttpErrorKeys.NoPermission ||
          errorLog == HttpResponseLogs.InvalidToken
        ) {
          clearLS()
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
