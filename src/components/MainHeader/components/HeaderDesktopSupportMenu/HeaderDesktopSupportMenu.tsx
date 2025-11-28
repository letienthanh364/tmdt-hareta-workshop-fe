import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import ChangeLanguage from 'src/components/ChangeLanguage'
import FloatingOnClick from 'src/components/FoatingOnClick'
import ToggleTheme from 'src/components/ToggleTheme'
import mainPath from 'src/constants/path'

function PopoverSection({ closePopover }: { closePopover: () => void }) {
  //! Multi languages
  const { t } = useTranslation('header')

  const itemClassName = 'rounded-md px-3 py-2 hover:bg-lightColor900 hover:font-semibold dark:hover:bg-darkColor900'

  return (
    <div className='relative flex w-64 select-none flex-col space-y-1 rounded-xl bg-lightColor700 p-2 text-base font-medium text-darkText shadow-lg dark:bg-darkColor700 dark:text-lightText tablet:font-medium desktop:w-72 desktop:text-lg'>
      <NavLink to={mainPath.privacyAndTerms} className={itemClassName} onClick={closePopover}>
        {t('support.privacy & terms')}
      </NavLink>

      <NavLink to={mainPath.orderTracking} className={itemClassName} onClick={closePopover}>
        {t('support.order tracking')}
      </NavLink>

      <div className={'rounded-md px-3 hover:bg-lightColor900 hover:font-semibold dark:hover:bg-darkColor900'}>
        <ChangeLanguage closePopover={closePopover} />
      </div>

      <ToggleTheme
        className='h-6 w-6 desktop:h-7 desktop:w-7 desktopLarge:h-8 desktopLarge:w-8'
        classNameWrapper={itemClassName}
      />
    </div>
  )
}

export default function HeaderDesktopSupportMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const closePopover = () => {
    setIsOpen(false)
  }

  //! Multi languages
  const { t } = useTranslation('header')

  return (
    <div className='group'>
      <FloatingOnClick
        renderPopover={<PopoverSection closePopover={closePopover} />}
        className='flex cursor-default select-none items-center p-1 text-darkText duration-200 dark:text-lightText'
        isOpen={isOpen}
        handleClick={handleClick}
        openChange={setIsOpen}
      >
        <div className='z-10 flex items-center space-x-2 group-hover:text-primaryColor dark:group-hover:text-primaryColor '>
          <p>{t('navbar.support')}</p>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={classNames('duration-200', {
              'rotate-180': isOpen
            })}
          />
        </div>
      </FloatingOnClick>
    </div>
  )
}
