import BackButton from 'src/components/BackButton'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import HeaderMobileMenu from '../../components/HeaderMobileMenu'
import HeaderMobileCartLogged from '../../components/HeaderMobileCartLogged'
import HeaderMobileCartUnlogged from '../../components/HeaderMobileCartUnlogged'

export default function HeaderMobile() {
  //! Styles
  const wrapperStyle =
    'mx-3 h-[220px] overflow-y-auto rounded-md border border-black/20 bg-lightColor700 dark:border-white/20 dark:bg-darkColor700'
  const navigatorBtnStyle =
    'flex items-center justify-center rounded-md bg-unhoveringBg px-4 py-1 capitalize text-darkText hover:bg-hoveringBg font-medium'

  const { isAuthenticated } = useContext(AppContext)
  return (
    <div className='grid h-full w-full grid-cols-3 items-center px-2'>
      <div className='col-span-1 flex items-center justify-start'>
        <BackButton />
      </div>
      <div className='col-span-1 flex items-center justify-center'>
        {isAuthenticated && (
          <HeaderMobileCartLogged wrapperStyle={wrapperStyle} navigatorBtnStyle={navigatorBtnStyle} />
        )}
        {!isAuthenticated && (
          <HeaderMobileCartUnlogged wrapperStyle={wrapperStyle} navigatorBtnStyle={navigatorBtnStyle} />
        )}
      </div>
      <div className='col-span-1 flex items-center justify-end'>
        <HeaderMobileMenu />
      </div>
    </div>
  )
}
