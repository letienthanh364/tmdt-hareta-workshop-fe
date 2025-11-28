import { createContext, useState } from 'react'
import {
  getCountryAddressFromLS,
  getOrderListFromLS,
  getStateAddressFromLS,
  getTempOrderListFromLS,
  setCountryAddressToLS,
  setStateAddressToLS
} from 'src/utils/order'
import orderScreens from 'src/constants/orderScreens'
import { ExtendedPurchase } from 'src/types/cart.type'
import { AddressCountry, AddressState, AddressCity, VietnamCountry } from 'src/types/location.type'

interface OrderContextInterface {
  orderList: ExtendedPurchase[]
  setOrderList: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>
  tempOrderList: ExtendedPurchase[]
  setTempOrderList: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>
  addressCountry: AddressCountry | null
  addressState: AddressState | null
  addressCity: AddressCity | null
  setCountryAddress: (country: AddressCountry | null) => void
  setStateAddress: (state: AddressState | null) => void
  setAddressCity: React.Dispatch<React.SetStateAction<AddressCity | null>>
  confirmPayment: boolean
  setConfirmPayment: React.Dispatch<React.SetStateAction<boolean>>
  noneCity: boolean
  noneState: boolean
  noneCountry: boolean
  setNoneCity: React.Dispatch<React.SetStateAction<boolean>>
  setNoneState: React.Dispatch<React.SetStateAction<boolean>>
  setNoneCountry: React.Dispatch<React.SetStateAction<boolean>>
  screen: string
  setScreen: React.Dispatch<React.SetStateAction<string>>
}

const initialOrderContext: OrderContextInterface = {
  orderList: getOrderListFromLS(),
  setOrderList: () => null,
  tempOrderList: getTempOrderListFromLS(),
  setTempOrderList: () => null,
  addressCountry: getCountryAddressFromLS() || VietnamCountry,
  addressState: getStateAddressFromLS(),
  addressCity: null,
  setCountryAddress: () => null,
  setStateAddress: () => null,
  setAddressCity: () => null,
  confirmPayment: false,
  setConfirmPayment: () => null,
  noneCity: false,
  noneState: false,
  noneCountry: false,
  setNoneCity: () => null,
  setNoneState: () => null,
  setNoneCountry: () => null,
  screen: orderScreens.shipping,
  setScreen: () => null
}

export const OrderContext = createContext<OrderContextInterface>(initialOrderContext)

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orderList, setOrderList] = useState<ExtendedPurchase[]>(initialOrderContext.orderList)
  const [tempOrderList, setTempOrderList] = useState<ExtendedPurchase[]>(initialOrderContext.tempOrderList)
  const [addressCountry, setAddressCountry] = useState<AddressCountry | null>(initialOrderContext.addressCountry)
  const [addressState, setAddressState] = useState<AddressState | null>(initialOrderContext.addressState)
  const [addressCity, setAddressCity] = useState<AddressCity | null>(initialOrderContext.addressCity)
  const [confirmPayment, setConfirmPayment] = useState<boolean>(initialOrderContext.confirmPayment)
  const [noneCountry, setNoneCountry] = useState(false)
  const [noneState, setNoneState] = useState(false)
  const [noneCity, setNoneCity] = useState(false)
  const [screen, setScreen] = useState<string>(initialOrderContext.screen)

  const setCountryAddress = (country: AddressCountry | null) => {
    setAddressCountry(country)
    setCountryAddressToLS(country)
  }

  const setStateAddress = (state: AddressState | null) => {
    setAddressState(state)
    setStateAddressToLS(state)
  }

  return (
    <OrderContext.Provider
      value={{
        orderList,
        setOrderList,
        tempOrderList,
        setTempOrderList,
        addressCountry,
        addressState,
        addressCity,
        setCountryAddress,
        setStateAddress,
        setAddressCity,
        confirmPayment,
        setConfirmPayment,
        noneCountry,
        noneState,
        noneCity,
        setNoneCountry,
        setNoneState,
        setNoneCity,
        screen,
        setScreen
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}
