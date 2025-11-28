/* eslint-disable @typescript-eslint/no-explicit-any */
import { useViewport } from 'src/hooks/useViewport'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons'
import { Element } from 'react-scroll'
import mainPath, { privacyPath } from 'src/constants/path'
import { useTranslation } from 'react-i18next'
import useClickOutside from 'src/hooks/useClickOutside'
import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, ReactNode, useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import PrivacyAndTermsSideNav from './components/PrivacyAndTermsSideNav'
import { useScrollDirection } from 'src/hooks/useScrollDirection'
import PrivacyShippingAndDelivery from './children/PrivacyShippingAndDelivery'
import PrivacyUseOfInformation from './children/PrivacyUseOfInformation'
import PrivacyDataProtection from './children/PrivacyDataProtection'
import PrivacySharingOfInformation from './children/PrivacySharingOfInformation'
import PrivacyCookiesAndTracking from './children/PrivacyCookiesAndTracking'
import PrivacyThirdPartyLinks from './children/PrivacyThirdPartyLinks'
import PrivacyChildrenPrivacy from './children/PrivacyChildrenPrivacy'
import PrivacyChangeToThePrivacyPolicy from './children/PrivacyChangeToThePrivacyPolicy'
import PrivacyTermAndConditions from './children/PrivacyTermAndConditions'
import PrivacyInformationCollection from './children/PrivacyInformationCollection'
import PrivacyProductWarranty from './children/PrivacyProductWarranty'
import PrivacyProductInformation from './children/PrivacyProductInformation'
import PrivacyOrderingAndPayments from './children/PrivacyOrderingAndPayments'
import PrivacyReturnsAndRefunds from './children/PrivacyReturnsAndRefunds'
import PrivacyIntellectualProperty from './children/PrivacyIntellectualProperty'
import PathBar from 'src/components/PathBar'
import { Helmet } from 'react-helmet-async'

export default function PrivacyAndTermsPage() {
  const { theme } = useContext(AppContext)
  //! responsive
  const isMobile = useViewport().width < 768

  //! Multi languages
  const { t } = useTranslation('privacyAndTerms')

  //! navigate side bar
  const { visible, setVisible, ref } = useClickOutside(false)
  const openMenu = () => {
    setVisible(true)
  }
  const closeMenu = () => {
    setVisible(false)
  }

  //! handle scroll up
  const scrollDirection = useScrollDirection()

  const elementList: { path: string; children: ReactNode }[] = [
    {
      path: privacyPath.ProductInformation,
      children: <PrivacyProductInformation />
    },
    {
      path: privacyPath.OrderingAndPayments,
      children: <PrivacyOrderingAndPayments />
    },
    {
      path: privacyPath.ShippingAndDelivery,
      children: <PrivacyShippingAndDelivery />
    },
    {
      path: privacyPath.ReturnsAndRefunds,
      children: <PrivacyReturnsAndRefunds />
    },
    {
      path: privacyPath.ProductWarranty,
      children: <PrivacyProductWarranty />
    },
    {
      path: privacyPath.IntellectualProperty,
      children: <PrivacyIntellectualProperty />
    },
    {
      path: privacyPath.InformationCollection,
      children: <PrivacyInformationCollection />
    },
    {
      path: privacyPath.UseOfInformation,
      children: <PrivacyUseOfInformation />
    },
    {
      path: privacyPath.DataProtection,
      children: <PrivacyDataProtection />
    },
    {
      path: privacyPath.SharingOfInformation,
      children: <PrivacySharingOfInformation />
    },
    {
      path: privacyPath.CookiesAndTracking,
      children: <PrivacyCookiesAndTracking />
    },
    {
      path: privacyPath.ThirdPartyLinks,
      children: <PrivacyThirdPartyLinks />
    },
    {
      path: privacyPath.ChildrenPrivacy,
      children: <PrivacyChildrenPrivacy />
    },
    {
      path: privacyPath.ChangeToThePrivacyPolicy,
      children: <PrivacyChangeToThePrivacyPolicy />
    },
    {
      path: privacyPath.TermAndConditions,
      children: <PrivacyTermAndConditions />
    }
  ]

  return (
    <div className='relative bg-lightBg py-2 pb-12 duration-200 dark:bg-darkBg tablet:py-3 tablet:pb-16 desktop:py-4 desktop:pb-20'>
      <Helmet>
        <title>{t('helmet.title')} | Hareta Workshop</title>
        <meta name='description' content={t('helmet.description')} />
      </Helmet>
      <div className='container space-y-6'>
        <PathBar pathList={[{ pathName: t('path.Privacy & Terms'), url: mainPath.privacyAndTerms }]} />
      </div>
      {isMobile && (
        <AnimatePresence>
          <button
            className={classNames(
              'sticky left-2 rounded-xl border border-black/60 bg-white p-2 duration-200 dark:border-white/60 dark:bg-black',
              {
                'top-12': scrollDirection == 'up',
                ' top-1': !(scrollDirection == 'up')
              }
            )}
            onClick={openMenu}
          >
            <FontAwesomeIcon icon={faBarsStaggered} />
          </button>
        </AnimatePresence>
      )}

      <div className='container'>
        <div
          className={classNames('pb-6 tablet:pb-10 desktopLarge:pb-12', {
            'grid grid-cols-12 gap-2 desktop:gap-3 desktopLarge:gap-4 ': !isMobile
          })}
        >
          {!isMobile && (
            <div className='col-span-3'>
              <div className='sticky left-0 top-10 mt-2 flex w-full flex-col space-y-4 border-r border-black/20 duration-200 dark:border-white/20 tablet:top-12 desktop:top-16'>
                <PrivacyAndTermsSideNav />
              </div>
            </div>
          )}
          {isMobile && (
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
                    className='fixed left-0 top-0 z-10 flex h-full w-[70%] overflow-hidden rounded-l-md py-2 shadow-md tabletSmall:w-[60%]'
                    initial={{ opacity: 0, x: '-20%' }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      backgroundColor: theme === 'dark' ? '#202020' : '#efefef',
                      color: theme === 'dark' ? '#eeeeee' : '#222222'
                    }}
                    exit={{ opacity: 0, x: '-20%' }}
                    transition={{ duration: 0.3 }}
                    ref={ref}
                  >
                    <PrivacyAndTermsSideNav closeMenu={closeMenu} />
                    <div className='absolute right-0 flex h-10 space-x-2 p-2'>
                      <button onClick={closeMenu}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='h-6 w-6'
                        >
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
          )}

          {/* Element components that act as scroll targets */}
          <div
            className={classNames({
              'flex flex-col space-y-8 tablet:space-y-10 desktopLarge:space-y-16': isMobile,
              'col-start-4 col-end-13 flex flex-col space-y-8 desktop:space-y-12 ': !isMobile
            })}
          >
            <div className='mt-2 text-center text-xl font-bold uppercase tracking-widest text-haretaColor tablet:text-2xl desktop:text-3xl desktopLarge:text-4xl'>
              {t('title.Privacy and terms')}
            </div>

            {elementList.map((ele, index) => (
              <Element key={index} name={ele.path}>
                {ele.children}
              </Element>
            ))}
          </div>
          <div className='col-start-1 col-end-13 text-center'>
            <div className='mt-4 tablet:mt-8 desktopLarge:mt-12'>
              <p className='text-lg font-bold uppercase text-haretaColor tablet:text-xl desktopLarge:text-2xl'>
                {t('Contact.title')}
              </p>
              <p className='text-base font-medium tablet:text-lg desktopLarge:text-xl'>
                {t('Contact.guide')}
                <span className='text-haretaColor'>{t('Contact.hareta.manage@gmail.com')}</span>
              </p>
            </div>
          </div>

          {/* Anchors to trigger scroll actions */}
          {/* <button onClick={scrollToTop}>To the top!</button>
      <br />
      <button onClick={scrollToBottom}>To the bottom!</button>
      <br /> */}
        </div>
      </div>
    </div>
  )
}
