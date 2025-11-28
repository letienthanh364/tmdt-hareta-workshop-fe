import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import mainPath, { adminPath } from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import HeaderDesktopSupportMenu from '../../components/HeaderDesktopSupportMenu'
import HeaderDesktopUserMenu from '../../components/HeaderDesktopUserMenu'
import HeaderDesktopCartUnlogged from '../../components/HeaderDesktopCartUnlogged'
import HeaderDesktopCartLogged from '../../components/HeaderDesktopCartLogged'
import { NavigateItem } from 'src/types/utils.type'

export default function HeaderDesktop() {
  //! Multi languages
  const { t } = useTranslation('header')
  const { isAuthenticated, profile } = useContext(AppContext)

  //! Menus
  const menus: NavigateItem[] = [
    {
      name: t('navbar.home'),
      url: mainPath.home
    },
    {
      name: t('navbar.store'),
      url: mainPath.store
    },
    {
      name: t('navbar.event'),
      url: mainPath.events
    },
    {
      name: t('navbar.blog'),
      url: mainPath.blogs
    }
  ]

  return (
    <div className='container grid w-full grid-cols-3 items-center text-black duration-200  dark:text-white'>
      <div className='col-span-2 flex items-center justify-start space-x-2 text-sm font-medium uppercase tablet:font-semibold tabletLarge:text-base desktop:space-x-4 desktop:text-lg'>
        {menus.map((menu) => (
          <NavLink
            key={menu.url}
            to={menu.url}
            className={({ isActive }) =>
              classNames('rounded-md border border-none p-1 hover:text-primaryColor dark:hover:text-primaryColor', {
                'text-primaryColor dark:text-primaryColor': isActive
              })
            }
          >
            <p>{menu.name}</p>
          </NavLink>
        ))}

        <HeaderDesktopSupportMenu />

        {profile?.role == 'admin' && (
          <NavLink
            to={adminPath.mainPage}
            className='rounded-md border border-none p-1 hover:text-primaryColor dark:hover:text-primaryColor'
          >
            <div>{'Admin'}</div>
          </NavLink>
        )}
      </div>

      <div className='col-span-1 flex items-center justify-end space-x-1 uppercase desktop:space-x-4  desktop:text-lg '>
        {!isAuthenticated && (
          <NavLink
            to={mainPath.login}
            className='flex items-center space-x-1 rounded-lg px-3 py-1 hover:text-primaryColor dark:hover:text-primaryColor tablet:font-semibold desktop:space-x-2'
          >
            <FontAwesomeIcon icon={faUser} />

            <p>{t('navbar.login')}</p>
          </NavLink>
        )}

        {isAuthenticated && (
          <div className='flex px-3'>
            <HeaderDesktopUserMenu />
          </div>
        )}

        {isAuthenticated ? <HeaderDesktopCartLogged /> : <HeaderDesktopCartUnlogged />}
      </div>
    </div>
  )
}
