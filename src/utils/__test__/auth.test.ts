import { beforeEach, describe, expect, it } from 'vitest'
import { clearLS, getAccessTokenFromLS, getProfileFromLS, setAccessTokenToLS, setProfileToLS } from '../auth'
import { getCountryAddressFromLS, getOrderListFromLS, getStateAddressFromLS } from '../order'

const access_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJfaWQiOiJpVjdSVGo0Y1NzcEQiLCJyb2xlIjoiYWRtaW4iLCJzZXNzaW9uX2lkIjoiTGZDcGdYRXNORk5MZlpnekhIa08ifSwiZXhwIjoxNzM1MTQxNDU4LCJpYXQiOjE3MTkzNzM0NTh9.bE-7kX5EIkCwuqelmPJooBk62eO_mXcvN_kv_--rvhQ'

const profile = {
  id: 'iV7RTj4cSspD',
  status: 1,
  created_at: '2024-06-09T17:17:13.111+07:00',
  updated_at: '2024-06-09T17:17:13.111+07:00',
  name: 'Le Tien Thanh',
  email: 'letienthanh364@gmail.com',
  role: 'admin',
  phone: '0394030604',
  avatar: {
    id: '',
    status: 0,
    created_at: '',
    updated_at: '',
    url: '',
    filename: '',
    width: 100,
    height: 100,
    cloud_name: '',
    extension: ''
  }
}

beforeEach(() => {
  localStorage.clear()
})

describe('setAccessTokenToLS', () => {
  it('access_token must be set to local storage', () => {
    setAccessTokenToLS(access_token)
    expect(localStorage.getItem('access_token')).toBe(access_token)
  })
})

describe('getAccessTokenFromLS', () => {
  it('access_token can be get from local storage', () => {
    localStorage.setItem('access_token', access_token)
    expect(getAccessTokenFromLS()).toBe(access_token)
  })
})

describe('setProfileTokenToLS', () => {
  it('profile must be set to local storage', () => {
    setProfileToLS(profile)
    expect(JSON.parse(localStorage.getItem('profile') || '')).toStrictEqual(profile)
  })
})

describe('getProfileFromLS', () => {
  it('profile can be get from local storage', () => {
    localStorage.setItem('profile', JSON.stringify(profile))
    expect(getProfileFromLS()).toStrictEqual(profile)
  })
})

describe('clearLS', () => {
  it('Clear access_token, profile, country_address, state_address, order_list in local storage', () => {
    clearLS()
    expect(getAccessTokenFromLS()).toBe('')
    expect(getProfileFromLS()).toBe(null)
    expect(getCountryAddressFromLS()).toBe(null)
    expect(getStateAddressFromLS()).toBe(null)
    expect(getOrderListFromLS()).toStrictEqual([])
  })
})
