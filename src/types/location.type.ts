export interface AddressCountry {
  capital: string
  currency: string
  emoji: string
  id: number
  iso2: string
  iso3: string
  name: string
  native: string
  phonecode: string
}

export interface AddressState {
  id: number
  name: string
  country_id: number
  country_code: string
  iso2: string
}
export interface AddressCity {
  id: number
  name: string
}

export const VietnamCountry: AddressCountry = {
  capital: 'Hanoi',
  currency: 'VND',
  emoji: '🇻🇳',
  id: 240,
  iso2: 'VN',
  iso3: 'VNM',
  name: 'Vietnam',
  native: 'Việt Nam',
  phonecode: '84'
}
