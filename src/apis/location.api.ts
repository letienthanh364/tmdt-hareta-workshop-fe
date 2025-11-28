import axios from 'axios'
import { AddressCountry, AddressState, AddressCity } from 'src/types/location.type'

const url = 'https://api.countrystatecity.in/v1/countries'

const headers = {
  'X-CSCAPI-KEY': 'WUI2T21EejlBNXRpaDZuaFl6d1NsTUJjZ3ZTYjE1bWc0N250VDBwUg=='
}

export const locationApi = {
  getCountryList() {
    return axios.get<AddressCountry[]>(url, {
      headers: headers
    })
  },
  getStatesByCountry(countryIso2: string) {
    return axios.get<AddressState[]>(`${url}/${countryIso2}/states`, { headers: headers })
  },
  getCitiesByStateAndCountry(countryIso2: string, stateIso2: string) {
    return axios.get<AddressCity[]>(`${url}/${countryIso2}/states/${stateIso2}/cities`, { headers: headers })
  }
}
