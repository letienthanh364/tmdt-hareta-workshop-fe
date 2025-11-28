import { faDiscord, faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import mainPath from 'src/constants/path'

export default function FooterMobile() {
  //! Multi languages
  const { t } = useTranslation('footer')

  return (
    <div className='w-full bg-lightColor700 pb-14 duration-200 dark:bg-darkColor700 tabletSmall:pb-16'>
      <div className='flex flex-col text-darkText/80 duration-200 dark:text-lightText/80'>
        <div className='border-b border-black/40 dark:border-white/40'>
          <div className='relative grid grid-cols-3 py-2'>
            <div className='col-span-1 flex items-center px-2 text-sm font-medium uppercase tabletSmall:px-4 tabletSmall:text-base'>
              {t('follow us on')}
            </div>

            {/* <div className='absolute left-1/2 h-full border-l border-black/40 dark:border-white/40' /> */}

            <div className='col-span-2 flex flex-wrap items-center justify-start space-x-1 text-lg tabletSmall:text-xl'>
              <Link to='https://www.facebook.com/HaretaWorkshop' target='_blank'>
                <FontAwesomeIcon icon={faFacebook} className='cursor-pointer p-1 hover:text-primaryColor' />
              </Link>
              <Link to='https://www.instagram.com/hareta.workshop/' target='_blank'>
                <FontAwesomeIcon className='cursor-pointer p-1 hover:text-primaryColor' icon={faInstagram} />
              </Link>
              <Link to='' target='_blank'>
                <FontAwesomeIcon className='cursor-pointer p-1 hover:text-primaryColor' icon={faDiscord} />
              </Link>
              <Link to='' target='_blank'>
                <FontAwesomeIcon className='cursor-pointer p-1 hover:text-primaryColor' icon={faYoutube} />
              </Link>
            </div>
          </div>
        </div>
        <div className='border-b border-black/40 dark:border-white/40'>
          <div className='relative grid grid-cols-3 py-2'>
            <div className='col-span-1 flex items-center px-2 text-sm font-medium uppercase tabletSmall:px-4 tabletSmall:text-base'>
              Hareta
            </div>

            <div className='col-span-2 flex flex-col space-y-2 px-2 text-xs tabletSmall:px-4 tabletSmall:text-sm'>
              <Link to='hareta.me' className='hover:text-primaryColor dark:hover:text-primaryColor'>
                Hareta workshop
              </Link>
            </div>
          </div>
        </div>
        <div className='border-b border-black/40 dark:border-white/40'>
          <div className='relative grid grid-cols-3 py-2'>
            <div className='col-span-1 flex items-center px-2 text-sm font-medium uppercase tabletSmall:px-4 tabletSmall:text-base'>
              {t('our main office')}
            </div>

            <div className='col-span-2 px-2 text-xs tabletSmall:px-4 tabletSmall:text-sm'>
              Bcons Bee Building, Binh An, Di An, Binh Duong, Viet Nam
            </div>
          </div>
        </div>
        <div className='border-b border-black/40 dark:border-white/40'>
          <div className='relative grid grid-cols-3 py-2'>
            <div className='col-span-1 flex items-center px-2 text-sm font-medium uppercase tabletSmall:px-4 tabletSmall:text-base'>
              {t('support')}
            </div>

            <div className='col-span-2 flex flex-col space-y-2 px-2 text-xs tabletSmall:px-4 tabletSmall:text-sm'>
              <Link to={mainPath.privacyAndTerms}>{t('Privacy & Terms')}</Link>
              <Link to={mainPath.orderTracking}>{t('Order Tracking')}</Link>
            </div>
          </div>
        </div>
        <div className='overflow-hidden border-b border-black/40 dark:border-white/40'>
          <div className='relative grid grid-cols-3 py-2'>
            <div className='col-span-1 flex items-center px-2 text-sm font-medium uppercase tabletSmall:px-4 tabletSmall:text-base'>
              {t('contact')}
            </div>

            <div className='col-span-2 flex flex-col space-y-2 px-2 text-xs tabletSmall:px-4 tabletSmall:text-sm'>
              <div className='truncate'>contact.hareta@gmail.com</div>
              <p>0818266375</p>
            </div>
          </div>
        </div>
        <div className=''>
          <div className=' flex items-center justify-center space-x-2 desktop:space-x-4'>
            <div className='relative h-32 w-32 desktop:h-40 desktop:w-40'>
              <img
                src='/images/haretaWorkshopLogo.png'
                alt='Hareta'
                className='absolute left-0 top-0 h-full w-full object-scale-down'
              />
            </div>
            <div className='uppercase text-darkText/80 dark:text-lightText/80'>
              <p className='text-lg desktop:text-xl desktopLarge:text-2xl'>hareta</p>
              <p className='pl-4  text-sm desktop:text-base desktopLarge:text-lg'>workshop</p>
            </div>
          </div>
          <div className=' mt-4 flex w-full items-center justify-center text-xs text-darkText/60 dark:text-lightText/60 desktop:text-sm'>
            {t('coppyright')}
          </div>
        </div>
      </div>
    </div>
  )
}
