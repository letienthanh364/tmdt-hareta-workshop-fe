import { HttpResponse, http } from 'msw'
import config from 'src/constants/config'

const loginRes = {
  data: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJfaWQiOiJpVjdSVGo0Y1NzcEQiLCJyb2xlIjoiYWRtaW4iLCJzZXNzaW9uX2lkIjoia3lWZkVTQlNPdXlxc0t2ckNtcHoifSwiZXhwIjoxNzM1NTE2MzY5LCJpYXQiOjE3MTk3NDgzNjl9.KdRECz3ReAopLcCWDzUkqIwbgZzo5o9M82zBl4M9zcM',
    created: '2024-06-30T18:52:49.637081357+07:00',
    expiry: 15768000
  }
}

const loginRequest = http.post(`${config.ApiURL}login`, () => {
  return HttpResponse.json(loginRes)
})

const authRequest = [loginRequest]

export default authRequest
