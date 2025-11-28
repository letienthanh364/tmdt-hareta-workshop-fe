import { useState, createContext } from 'react'
import { getTypeFilteringFromLS } from 'src/utils/store'

interface StoreContextInterface {
  sorting: string
  setSorting: React.Dispatch<React.SetStateAction<string>>
  lowerPrice: string
  setLowerPrice: React.Dispatch<React.SetStateAction<string>>
  upperPrice: string
  setUpperPrice: React.Dispatch<React.SetStateAction<string>>
  type: string
  setType: React.Dispatch<React.SetStateAction<string>>
  isFavouriteList: boolean
  setIsFavouriteList: React.Dispatch<React.SetStateAction<boolean>>
  wishlistIDs: string[]
  setWishlistIDs: React.Dispatch<React.SetStateAction<string[]>>
}

const initialStoreContext: StoreContextInterface = {
  sorting: 'Newest',
  setSorting: () => null,
  lowerPrice: '',
  setLowerPrice: () => null,
  upperPrice: '',
  setUpperPrice: () => null,
  type: getTypeFilteringFromLS(),
  setType: () => null,
  isFavouriteList: false,
  setIsFavouriteList: () => null,
  wishlistIDs: [],
  setWishlistIDs: () => null
}

export const StoreContext = createContext<StoreContextInterface>(initialStoreContext)

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [sorting, setSorting] = useState<string>(initialStoreContext.sorting)
  const [lowerPrice, setLowerPrice] = useState<string>(initialStoreContext.lowerPrice)
  const [upperPrice, setUpperPrice] = useState<string>(initialStoreContext.upperPrice)
  const [type, setType] = useState<string>(initialStoreContext.type)
  const [isFavouriteList, setIsFavouriteList] = useState<boolean>(initialStoreContext.isFavouriteList)
  const [wishlistIDs, setWishlistIDs] = useState<string[]>(initialStoreContext.wishlistIDs)

  return (
    <StoreContext.Provider
      value={{
        sorting,
        setSorting,
        lowerPrice,
        setLowerPrice,
        upperPrice,
        setUpperPrice,
        type,
        setType,
        isFavouriteList,
        setIsFavouriteList,
        wishlistIDs,
        setWishlistIDs
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
