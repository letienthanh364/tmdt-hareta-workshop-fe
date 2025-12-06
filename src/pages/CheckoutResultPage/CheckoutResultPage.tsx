import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import mainPath from 'src/constants/path'

interface CheckoutResultPageProps {
  status: 'success' | 'cancel'
}

const statusConfig = {
  success: {
    titleKey: 'checkoutResult.successTitle',
    descriptionKey: 'checkoutResult.successDescription',
    primary: { labelKey: 'checkoutResult.viewOrders', url: mainPath.orderTracking },
    secondary: { labelKey: 'checkoutResult.backToStore', url: mainPath.store }
  },
  cancel: {
    titleKey: 'checkoutResult.cancelTitle',
    descriptionKey: 'checkoutResult.cancelDescription',
    primary: { labelKey: 'checkoutResult.viewOrders', url: mainPath.orderTracking },
    secondary: { labelKey: 'checkoutResult.backToStore', url: mainPath.store }
  }
} as const

export default function CheckoutResultPage({ status }: CheckoutResultPageProps) {
  const { t } = useTranslation('order')
  const { titleKey, descriptionKey, primary, secondary } = statusConfig[status]

  return (
    <div className='bg-lightBg py-10 dark:bg-darkBg desktop:py-16'>
      <div className='container flex flex-col items-center space-y-6 rounded-2xl bg-white p-6 text-center shadow-lg dark:bg-darkColor700 desktop:space-y-8 desktop:p-10'>
        <h1 className='text-2xl font-semibold text-haretaColor desktop:text-3xl'>{t(titleKey)}</h1>
        <p className='max-w-2xl text-base text-darkText dark:text-white/80 desktop:text-lg'>{t(descriptionKey)}</p>
        <div className='flex flex-col space-y-3 tablet:flex-row tablet:space-x-4 tablet:space-y-0'>
          <Link
            to={primary.url}
            className='rounded-2xl bg-haretaColor px-6 py-3 text-center font-semibold text-darkText hover:bg-primaryColor'
          >
            {t(primary.labelKey)}
          </Link>
          <Link
            to={secondary.url}
            className='rounded-2xl border-2 border-haretaColor px-6 py-3 text-center font-semibold text-haretaColor hover:bg-haretaColor hover:text-darkText'
          >
            {t(secondary.labelKey)}
          </Link>
        </div>
      </div>
    </div>
  )
}
