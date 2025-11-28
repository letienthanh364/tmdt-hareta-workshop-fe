import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import mainPath from 'src/constants/path'

export interface PathElement {
  pathName: string
  url: string
  isNotALink?: boolean
  notEnd?: boolean
}

interface Props {
  pathList: PathElement[]
}

export default function PathBar({ pathList }: Props) {
  //! TRANSLATION
  const { t } = useTranslation('store')

  return (
    <div className='mb-2 rounded-lg border border-black/40 bg-lightColor900 px-2 py-1 uppercase text-darkText duration-200 dark:border-white/40 dark:bg-darkColor900 dark:text-lightText desktop:mb-3 desktop:px-4 desktop:py-2 desktopLarge:mb-4 desktopLarge:px-6 desktopLarge:py-3'>
      <div className='flex items-center justify-start space-x-1 overflow-hidden text-xs font-medium desktop:space-x-2 desktop:text-sm desktop:font-semibold'>
        <NavLink
          to={mainPath.home}
          className={({ isActive }) =>
            classNames('shrink-0', {
              'text-primaryColor': isActive,
              'hover:text-primaryColor': !isActive
            })
          }
        >
          {t('path bar.home')}
        </NavLink>
        {pathList.map((pathElement, index) => {
          if (pathElement.isNotALink) {
            return (
              <Fragment key={index}>
                <FontAwesomeIcon icon={faAngleRight} />
                <div className={'text-primaryColor'}>{pathElement.pathName}</div>
              </Fragment>
            )
          } else
            return (
              <Fragment key={index}>
                <FontAwesomeIcon icon={faAngleRight} />
                <NavLink
                  to={pathElement.url}
                  end={!pathElement.notEnd}
                  className={({ isActive }) =>
                    classNames('shrink-0', {
                      'text-primaryColor': isActive,
                      'hover:text-primaryColor': !isActive
                    })
                  }
                >
                  {pathElement.pathName}
                </NavLink>
              </Fragment>
            )
        })}
      </div>
    </div>
  )
}
