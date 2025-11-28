import axios, { AxiosError } from 'axios'
import { floor } from 'lodash'
import moment from 'moment'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { locales } from 'src/i18n/i18n'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

export function isAxiosBadRequestError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.BadRequest
}

export function isAxiosUnprocessableError(error: unknown) {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i:${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i:')
  return arr[arr.length - 1]
}

export const setLanguageToLS = (lng: keyof typeof locales) => {
  localStorage.setItem('current_language', lng)
}

export const getLanguageFromLS = () => {
  return (localStorage.getItem('current_language') || 'en') as keyof typeof locales
}

export const formatDate = (timeStamp: string) => {
  return moment(timeStamp).format('YYYY-MM-DD')
}

export const formatDateEn = (timeStamp: string) => {
  return moment(timeStamp).format('MMM DD, YYYY')
}

export const formatDateVi = (timeStamp: string) => {
  return moment(timeStamp).format('DD-MM-YYYY')
}

export const formatTimeToSeconds = (time: number) => {
  return floor(time / 1000)
}

export const showSuccessDialog = (setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, time?: number) => {
  setIsOpen(true)
  setTimeout(() => {
    setIsOpen(false)
  }, time || 1500)
}

export function truncateString(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + '&hellip;' : str
}
