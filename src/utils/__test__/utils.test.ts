import { describe, it, expect } from 'vitest'
import { isAxiosError, isAxiosUnprocessableError } from '../utils'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { AxiosError } from 'axios'

describe('isAxiosError', () => {
  it('isAxiosError return a boolean value', () => {
    expect(isAxiosError(new Error())).toBe(false)
    expect(isAxiosError(new AxiosError())).toBe(true)
  })
})

describe('isAxiosUnprocessableError', () => {
  it('isAxiosUnprocessableError return a boolean value', () => {
    expect(isAxiosUnprocessableError(new Error())).toBe(false)
    expect(
      isAxiosUnprocessableError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.InternalServerError,
          data: null
        } as any)
      )
    ).toBe(false)
    expect(
      isAxiosUnprocessableError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.UnprocessableEntity,
          data: null
        } as any)
      )
    ).toBe(true)
  })
})
