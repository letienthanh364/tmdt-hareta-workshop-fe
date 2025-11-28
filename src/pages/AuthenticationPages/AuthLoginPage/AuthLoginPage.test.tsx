import { screen, waitFor, fireEvent } from '@testing-library/react'
import mainPath from 'src/constants/path'
import { renderWithRouter } from 'src/utils/__test__/testUtils'
import { beforeAll, describe, expect, it, test } from 'vitest'

describe('Login test', () => {
  let emailInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  let submitButton: HTMLButtonElement
  beforeAll(async () => {
    renderWithRouter({ route: mainPath.login })
    await waitFor(() => {
      expect(screen.getByLabelText('Email address')).toBeDefined()
    })
    emailInput = document.querySelector('form input[name="email"]') as HTMLInputElement
    passwordInput = document.querySelector('form input[name="password"]') as HTMLInputElement
    submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement
  })

  it('Hiển thị lỗi khi không nhập email và password', async () => {
    fireEvent.submit(submitButton)

    await waitFor(() => {
      expect(screen.queryByText('Email address is required')).toBeTruthy()
      expect(screen.queryByText('Password is required')).toBeTruthy()
    })
  })

  test('Hiển thị lỗi khi email không đúng định dạng', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'test@mail.co'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '123'
      }
    })

    fireEvent.submit(submitButton)

    await waitFor(() => {
      expect(screen.queryByText('Incorrect email format')).toBeTruthy()
    })
  })

  it('Tài khoản, mật khẩu không chính xác', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'test@gmail.com'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '123'
      }
    })
    fireEvent.submit(submitButton)

    await waitFor(() => {
      expect(screen.queryByText('Your email or password is invalid')).toBeTruthy()
    })
  })

  // it('Đăng nhập thành công', async () => {
  //   fireEvent.change(emailInput, {
  //     target: {
  //       value: 'letienthanh364@gmail.com'
  //     }
  //   })
  //   fireEvent.change(passwordInput, {
  //     target: {
  //       value: '1'
  //     }
  //   })
  //   fireEvent.submit(submitButton)

  //   await waitFor(() => {
  //     expect(screen.queryByText('Email address is required')).toBeFalsy()
  //     expect(screen.queryByText('Password is required')).toBeFalsy()
  //     expect(screen.queryByText('Incorrect email format')).toBeFalsy()
  //     expect(screen.queryByText('Your email or password is invalid')).toBeFalsy()
  //     expect(document.querySelector('title')?.textContent).toBe('Hareta Workshopasdasd')
  //   })

  //   await logScreen()
  // })
})
