import { describe, expect, test } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

import { renderWithRouter } from './utils/__test__/testUtils'
import mainPath from './constants/path'

describe('App', () => {
  test('App render and navigate', async () => {
    const { user } = renderWithRouter()

    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe('Hareta Workshop')
    })

    await user.click(screen.getByText(/Login/i))
    await waitFor(() => {
      expect(screen.queryByText(/Don't have an account?/i)).toBeDefined()
      expect(document.querySelector('title')?.textContent).toBe('Login | Hareta Workshop')
    })

    // screen.debug(document.body.parentElement as HTMLElement, 999999)
  })

  test('Return Page not found', async () => {
    const badRoute = '/badroute/test'
    renderWithRouter({ route: badRoute })
    await waitFor(() => {
      expect(screen.getByText(/page not found/i)).toBeDefined()
    })

    // await logScreen()
  })

  test('Render register page', async () => {
    renderWithRouter({ route: mainPath.register })
    await waitFor(() => {
      expect(screen.getByText(/Already have an account?/i)).toBeDefined()
    })

    // await logScreen()
  })
})
