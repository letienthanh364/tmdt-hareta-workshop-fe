import { describe, expect, it } from 'vitest'
import http from '../http'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'

describe(
  'http axios',
  () => {
    it('Call API', async () => {
      const res = await http.get('item/')
      expect(res.status).toBe(HttpStatusCode.Ok)
    })
    it('Auth Request', async () => {
      const loginRes = await http.post('login', {
        email: 'letienthanh364@gmail.com',
        password: '1'
      })
      const token = loginRes.data.data.token
      const profileRes = await http.get('auth/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      expect(profileRes.status).toBe(HttpStatusCode.Ok)
    })
  },
  { timeout: 30000 }
)
