import { faHeart, faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'
import { userPath } from 'src/constants/path'

export default function UserMobileNavBar() {
  return (
    <div className='grid grid-cols-3 rounded-md border border-black/10 bg-lightColor900 text-darkText/70 duration-200 dark:border-white/20 dark:bg-darkColor900 dark:text-lightText/70'>
      <div className='col-span-1 flex items-center justify-center'>
        <NavLink
          to={userPath.profile}
          className={({ isActive }) =>
            classNames('flex h-8 items-center space-x-3 px-4 py-4 text-xl font-semibold', {
              'text-primaryColor dark:text-primaryColor': isActive,
              ' hover:text-darkText dark:hover:text-lightText': !isActive
            })
          }
        >
          <FontAwesomeIcon icon={faUser} />
        </NavLink>
      </div>

      <div className='col-span-1 flex items-center justify-center border-l border-black/10 dark:border-white/20'>
        <NavLink
          to={userPath.password}
          className={({ isActive }) =>
            classNames('flex h-8 items-center space-x-3 px-4 py-4 text-xl font-semibold', {
              'text-primaryColor dark:text-primaryColor': isActive,
              ' hover:text-darkText dark:hover:text-lightText': !isActive
            })
          }
        >
          <FontAwesomeIcon icon={faLock} />
        </NavLink>
      </div>

      <div className='col-span-1 flex items-center justify-center border-l border-black/10 dark:border-white/20'>
        <NavLink
          to={userPath.wishList}
          className={({ isActive }) =>
            classNames('flex h-8 items-center space-x-3 px-4 py-4 text-xl font-semibold', {
              'text-primaryColor dark:text-primaryColor': isActive,
              ' hover:text-darkText dark:hover:text-lightText': !isActive
            })
          }
        >
          <FontAwesomeIcon icon={faHeart} />
        </NavLink>
      </div>
    </div>
  )
}
