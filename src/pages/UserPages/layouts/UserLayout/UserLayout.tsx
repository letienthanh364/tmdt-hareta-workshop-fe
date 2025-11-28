import UserSideNav from '../../components/UserSideNav'
import { ReactNode } from 'react'
import { useViewport } from 'src/hooks/useViewport'
import UserMobileNavBar from '../../components/UserMobileNavBar'
import PathBar from 'src/components/PathBar'
import { useTranslation } from 'react-i18next'
import { userPath } from 'src/constants/path'
import { Helmet } from 'react-helmet-async'

interface Props {
  children?: ReactNode
}

export default function UserLayout({ children }: Props) {
  const viewPort = useViewport()
  const isMobile = viewPort.width <= 768

  //! translation
  const { t } = useTranslation('user')

  if (isMobile) {
    return (
      <div className='bg-lightBg dark:bg-darkBg'>
        <Helmet>
          <title>{t('helmet.title')} | Hareta Workshop</title>
          <meta name='description' content={t('helmet.description')} />
        </Helmet>
        <div className='container space-y-4'>
          <PathBar pathList={[{ pathName: t('path.user'), url: userPath.user, notEnd: true }]} />
          <div className='space-y-4 pb-6'>
            <UserMobileNavBar />

            <div className='mt-2 rounded-md border border-black/40 bg-lightColor900 text-darkText dark:border-white/40 dark:bg-darkColor900 dark:text-lightText'>
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className='bg-lightBg dark:bg-darkBg'>
        <Helmet>
          <title>{t('helmet.title')} | Hareta Workshop</title>
          <meta name='description' content={t('helmet.description')} />
        </Helmet>
        <div className='container space-y-6'>
          <div className='pb-6 pt-2 desktop:pb-8 desktopLarge:pb-10'>
            <PathBar pathList={[{ pathName: t('path.user'), url: userPath.user, notEnd: true }]} />

            <div className='grid grid-cols-12 gap-6 '>
              <div className='col-span-3'>
                <UserSideNav />
              </div>

              <div className='col-span-9'>
                <div className='min-h-full rounded-md border border-black/40 bg-lightColor900 text-darkText dark:border-white/40 dark:bg-darkColor900 dark:text-lightText'>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
