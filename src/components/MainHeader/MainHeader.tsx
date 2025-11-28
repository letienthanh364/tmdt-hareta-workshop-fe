import { createContext } from 'react'
import { useViewport } from 'src/hooks/useViewport'

import HeaderDesktop from './children/HeaderDesktop'
import HeaderMobile from './children/HeaderMobile/HeaderMobile'

interface MenuContextInterface {
  openingMenu: boolean
  setOpeningMenu: React.Dispatch<React.SetStateAction<boolean>>
}
const initialMenuContext: MenuContextInterface = {
  openingMenu: false,
  setOpeningMenu: () => null
}
export const MenuContext = createContext<MenuContextInterface>(initialMenuContext)

export default function MainHeader() {
  const viewPort = useViewport()
  const isMobile = viewPort.width <= 768

  return (
    <div className='top-0 flex h-10 w-full items-center bg-lightHeader shadow-md duration-200 dark:bg-darkHeader tablet:h-12 desktop:h-16'>
      {!isMobile && <HeaderDesktop />}

      {/*//! Mobile */}
      {isMobile && <HeaderMobile />}
    </div>
  )
}
