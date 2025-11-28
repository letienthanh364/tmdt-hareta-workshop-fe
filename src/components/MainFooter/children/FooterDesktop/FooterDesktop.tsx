import { faDiscord, faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import mainPath from 'src/constants/path'

export default function FooterDesktop() {
  //! Multi languages
  const { t } = useTranslation('footer')

  return (
    <div className='w-full bg-lightColor700 pb-12 pt-12 duration-200 dark:bg-darkColor700'>
      <div className='container'>
        <div className=' grid grid-cols-5 gap-1 text-sm font-medium uppercase text-black duration-200 dark:text-white desktop:gap-2 desktop:text-xl desktopLarge:gap-4 desktopLarge:text-2xl'>
          <div className='col-span-1 flex items-center justify-center'>{t('follow us on')}</div>
          <div className='col-span-1 flex items-center px-2 desktop:px-4 desktopLarge:px-8'>Hareta</div>
          <div className='col-span-1 flex items-center px-0 text-sm desktop:px-2 desktop:text-xl desktopLarge:text-2xl'>
            {t('our main office')}
          </div>
          <div className='col-span-1 flex items-center px-6 desktop:px-8'>{t('support')}</div>
          <div className='col-span-1 flex items-center px-2 desktop:px-4 '>{t('contact')}</div>
        </div>
        <div className='mt-4 grid grid-cols-5 justify-center gap-1 text-xs text-darkText/80 duration-200 dark:text-lightText/80 desktop:gap-2 desktop:text-base desktopLarge:gap-4'>
          <div className='col-span-1'>
            <div className='flex items-center justify-center space-x-1 text-lg desktop:space-x-2 desktop:text-xl desktopLarge:text-2xl'>
              <Link to='https://www.facebook.com/HaretaWorkshop' target='_blank'>
                <FontAwesomeIcon
                  icon={faFacebook}
                  className='cursor-pointer p-1 hover:text-primaryColor dark:hover:text-primaryColor'
                />
              </Link>
              <Link to='https://www.instagram.com/hareta.workshop/' target='_blank'>
                <FontAwesomeIcon
                  className='cursor-pointer p-1 hover:text-primaryColor dark:hover:text-primaryColor'
                  icon={faInstagram}
                />
              </Link>
              <Link to='' target='_blank'>
                <FontAwesomeIcon
                  className='cursor-pointer p-1 hover:text-primaryColor dark:hover:text-primaryColor'
                  icon={faDiscord}
                />
              </Link>
              <Link to='' target='_blank'>
                <FontAwesomeIcon
                  className='cursor-pointer p-1 hover:text-primaryColor dark:hover:text-primaryColor'
                  icon={faYoutube}
                />
              </Link>
            </div>
          </div>
          <div className='col-span-1 flex flex-col space-y-2 px-2 desktop:px-4 desktopLarge:px-8'>
            <Link to='hareta.me' className='hover:text-primaryColor dark:hover:text-primaryColor'>
              Hareta workshop
            </Link>
          </div>
          <p className='col-span-1 text-pretty px-0 desktop:px-2'>
            Bcons Bee Building, Binh An, Di An, Binh Duong, Viet Nam
          </p>
          <div className='col-span-1 flex flex-col space-y-2 px-6 desktop:px-8'>
            <Link to={mainPath.privacyAndTerms} className='text-pretty'>
              {t('Privacy & Terms')}
            </Link>
            <Link to={mainPath.orderTracking} className='text-pretty'>
              {t('Order Tracking')}
            </Link>
          </div>
          <div className='col-span-1 flex flex-col justify-start space-y-2 px-2 desktop:px-4'>
            <p>contact.hareta@gmail.com</p>
            <p>0818266375</p>
          </div>
        </div>
        <div className='relative grid grid-cols-5 gap-1 desktop:gap-2 desktopLarge:gap-4'>
          <div className='col-span-2 flex items-center justify-center space-x-2 desktop:space-x-4'>
            <div className='relative h-32 w-32 desktop:h-40 desktop:w-40'>
              <img
                src='/images/haretaWorkshopLogo.png'
                alt='Hareta'
                className='absolute left-0 top-0 h-full w-full object-scale-down'
              />
            </div>
            <div className='uppercase text-darkText/80 duration-200 dark:text-lightText/80'>
              <p className='text-lg desktop:text-xl desktopLarge:text-2xl'>hareta</p>
              <p className='pl-4  text-sm desktop:text-base desktopLarge:text-lg'>workshop</p>
            </div>
          </div>
          <div className='absolute bottom-0 flex w-full items-center justify-center text-xs text-darkText/60 duration-200 dark:text-lightText/60 desktop:text-sm'>
            {t('coppyright')}
          </div>
        </div>
      </div>
    </div>
  )
}
