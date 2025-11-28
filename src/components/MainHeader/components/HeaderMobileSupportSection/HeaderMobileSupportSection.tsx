import AnimateChangeInHeight from 'src/components/AnimateChangeInHeight'
import { AnimatePresence, motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import useClickOutside from 'src/hooks/useClickOutside'
import classNames from 'classnames'
import ChangeLanguage from 'src/components/ChangeLanguage'
import { useTranslation } from 'react-i18next'
import ToggleTheme from 'src/components/ToggleTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import mainPath from 'src/constants/path'

export default function HeaderMobileSupportSection() {
  const { visible, setVisible, ref } = useClickOutside(false)

  const closeExtend = () => {
    setVisible(false)
  }

  //! Multi languages
  const { t } = useTranslation('header')

  return (
    <div ref={ref} className='h-full w-full'>
      <button
        className={classNames('flex w-full items-center space-x-2 border-x border-t px-2 py-2 uppercase', {
          'border-transparent ': !visible,
          'rounded-t-md border-black/20 dark:border-white/20': visible
        })}
        onClick={() => setVisible(!visible)}
      >
        <span>{t('navbar.support')}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={classNames('duration-200', {
            'rotate-180': visible
          })}
        />
      </button>
      <AnimateChangeInHeight className='w-full'>
        <AnimatePresence>
          {visible && (
            <motion.div className='flex w-full flex-col space-y-1 rounded-b-md border-x border-b border-black/20 px-4 pb-2 text-xs font-medium  text-darkText dark:border-white/20 dark:text-lightText tabletSmall:text-sm'>
              <NavLink to={mainPath.privacyAndTerms} className='py-1'>
                {t('support.privacy & terms')}
              </NavLink>

              <NavLink to={mainPath.orderTracking} className='py-1'>
                {t('support.order tracking')}
              </NavLink>

              <div className={''}>
                <ChangeLanguage closePopover={closeExtend} />
              </div>

              <div className=''>
                <ToggleTheme className='h-5 w-5 tabletSmall:h-6 tabletSmall:w-6' />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimateChangeInHeight>
    </div>
  )
}
