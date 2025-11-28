import { delay, renderWithRouter } from 'src/utils/__test__/testUtils'
import { describe, expect, test } from 'vitest'

describe('ProductDetail', () => {
  test('Render UI product detail', async () => {
    renderWithRouter({ route: '/store/Koenigsegg-Gemera-i:3mPHrsiPZbRLaq' })
    await delay(5000)
    expect(document.body).toMatchSnapshot()
  })
})
