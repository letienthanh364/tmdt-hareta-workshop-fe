import { Fragment, useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import useClickOutside from 'src/hooks/useClickOutside'
import mainPath from 'src/constants/path'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from 'src/contexts/app.context'
import { useTranslation } from 'react-i18next'
import HeaderMobileSupportSection from '../HeaderMobileSupportSection'
import HeaderMobileUserSection from '../HeaderMobileUserSection'

interface Props {
  className?: string
}

export default function HeaderMobileMenu({ className }: Props) {
  const { theme } = useContext(AppContext)
  const { visible, setVisible, ref } = useClickOutside(false)

  const openMenu = () => {
    setVisible(true)
  }
  const closeMenu = () => {
    setVisible(false)
  }

  //! Multi languages
  const { t } = useTranslation('header')

  return (
    <div className={className}>
      <button
        onClick={openMenu}
        type='button'
        className='flex items-center justify-center text-darkText dark:text-lightText'
      >
        <FontAwesomeIcon icon={faBars} className='h-6 w-6' />
      </button>
      <AnimatePresence>
        {visible && (
          <Fragment>
            <motion.div
              className='fixed inset-0'
              initial={{ opacity: 0, backgroundColor: 'black' }}
              animate={{
                opacity: 0.4
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className='fixed right-0 top-0 z-10 flex h-full w-[70%] overflow-hidden rounded-l-md py-2 shadow-md tabletSmall:w-[60%]'
              initial={{ opacity: 0, x: '20%' }}
              animate={{
                opacity: 1,
                x: 0,
                backgroundColor: theme === 'dark' ? '#1d1d22' : '#fbfbff',
                color: theme === 'dark' ? '#eeeeee' : '#111111'
              }}
              exit={{ opacity: 0, x: '20%' }}
              transition={{ duration: 0.3 }}
              ref={ref}
            >
              <div className=' flex w-full flex-col items-start justify-start px-3 text-sm font-medium uppercase tabletSmall:text-base'>
                <NavLink to={mainPath.home} className='w-full px-2 py-2' onClick={closeMenu}>
                  <div>{t('navbar.home')}</div>
                </NavLink>

                <NavLink to={mainPath.store} className='w-full px-2 py-2' onClick={closeMenu}>
                  <div>{t('navbar.store')}</div>
                </NavLink>

                <NavLink to={mainPath.events} className='w-full px-2 py-2' onClick={closeMenu}>
                  <div>{t('navbar.event')}</div>
                </NavLink>

                <div className='flex w-full flex-col items-center'>
                  <HeaderMobileSupportSection />
                </div>

                <div className='w-full'>
                  <div className='my-2 w-full border border-x-0 border-b-gray-500 border-t-transparent' />
                </div>

                <div className='w-full'>
                  <HeaderMobileUserSection closeMenu={closeMenu} />
                </div>
              </div>
              <div className='absolute right-0 flex h-10 space-x-2 p-2'>
                <button onClick={closeMenu}>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-6 w-6'>
                    <path
                      fillRule='evenodd'
                      d='M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          </Fragment>
        )}
      </AnimatePresence>
    </div>
  )
}
