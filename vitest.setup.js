import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import authRequest from './src/msw/auth.msw'
import productRequest from './src/msw/product.msw'

const server = setupServer(...authRequest, ...productRequest)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
