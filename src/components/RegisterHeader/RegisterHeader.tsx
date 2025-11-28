import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import mainPath from 'src/constants/path'
import ToggleTheme from '../ToggleTheme'
import RegisterLanguage from '../RegisterLanguage'
import { useViewport } from 'src/hooks/useViewport'
import { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons'

export default function RegisterHeader() {
  const viewport = useViewport()
  const smallDevice = viewport.width < 420

  //?translation
  const { t } = useTranslation('login')

  return (
    <header className='top-0 z-10 flex h-10 w-full items-center bg-lightHeader text-darkText duration-200 dark:bg-darkHeader dark:text-lightText tablet:h-12 desktop:h-16'>
      <div className='container'>
        <div className='flex items-center justify-between'>
          <nav className='flex items-center space-x-2 text-sm font-medium uppercase tabletSmall:space-x-3 tablet:space-x-4 tablet:text-base tablet:font-semibold desktop:text-lg'>
            <Fragment>
              {smallDevice && (
                <NavLink
                  to={mainPath.home}
                  className={({ isActive }) =>
                    classNames(
                      'rounded-md border border-none p-1 hover:text-primaryColor dark:hover:text-primaryColor',
                      {
                        'text-haretaColor dark:text-haretaColor ': isActive
                      }
                    )
                  }
                >
                  <FontAwesomeIcon icon={faHouse} className='h-5 w-auto' />
                </NavLink>
              )}
              {!smallDevice && (
                <NavLink
                  to={mainPath.home}
                  className={({ isActive }) =>
                    classNames(
                      'rounded-md border border-none p-1 hover:text-primaryColor dark:hover:text-primaryColor',
                      {
                        'text-haretaColor dark:text-haretaColor ': isActive
                      }
                    )
                  }
                >
                  <p>{t('login.home')}</p>
                </NavLink>
              )}
            </Fragment>

            <Fragment>
              {smallDevice && (
                <NavLink
                  to={mainPath.login}
                  className={({ isActive }) =>
                    classNames(
                      'rounded-md border border-none p-1 hover:text-primaryColor dark:hover:text-primaryColor',
                      {
                        'text-haretaColor dark:text-haretaColor ': isActive
                      }
                    )
                  }
                >
                  <FontAwesomeIcon icon={faUser} className='h-5 w-auto' />
                </NavLink>
              )}
              {!smallDevice && (
                <NavLink
                  to={mainPath.login}
                  className={({ isActive }) =>
                    classNames(
                      'rounded-md border border-none p-1 hover:text-primaryColor dark:hover:text-primaryColor',
                      {
                        'text-haretaColor dark:text-haretaColor ': isActive
                      }
                    )
                  }
                >
                  <p>{t('login.login')}</p>
                </NavLink>
              )}
            </Fragment>

            <Fragment>
              {smallDevice && (
                <NavLink
                  to={mainPath.register}
                  className={({ isActive }) =>
                    classNames(
                      'rounded-md border border-none p-1 hover:text-primaryColor dark:hover:text-primaryColor',
                      {
                        'text-haretaColor dark:text-haretaColor ': isActive
                      }
                    )
                  }
                >
                  <FontAwesomeIcon icon={faUserPlus} className='h-5 w-auto' />
                </NavLink>
              )}
              {!smallDevice && (
                <NavLink
                  to={mainPath.register}
                  className={({ isActive }) =>
                    classNames(
                      'rounded-md border border-none p-1 hover:text-primaryColor dark:hover:text-primaryColor',
                      {
                        'text-haretaColor dark:text-haretaColor ': isActive
                      }
                    )
                  }
                >
                  <p>{t('login.sign up')}</p>
                </NavLink>
              )}
            </Fragment>
          </nav>
          <div className='flex items-center space-x-2 tablet:space-x-4'>
            <RegisterLanguage />
            <ToggleTheme className='h-6 w-6 tablet:h-8 tablet:w-8 desktopLarge:h-10 desktopLarge:w-10' />
          </div>
        </div>
      </div>
    </header>
  )
}
