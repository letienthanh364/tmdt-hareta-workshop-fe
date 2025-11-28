import { useTranslation } from 'react-i18next'

export default function PrivacyInformationCollection() {
  //! Multi languages
  const { t } = useTranslation('privacyAndTerms')
  return (
    <div>
      <div className='text-lg font-bold uppercase tablet:text-2xl desktopLarge:text-3xl'>
        {t('InformationCollection.title')}
      </div>
      <div className='mt-2 flex flex-col space-y-2 text-sm tabletSmall:text-base tablet:text-lg desktopLarge:text-xl'>
        <p className=''>
          {t(
            'InformationCollection.We may collect personal information from you when you visit our website or place an order for our products. The types of information we may collect include:'
          )}
        </p>
        <p className=''>{t('InformationCollection.- Contact details (name, email address, phone number)')}</p>
        <p className=''>{t('InformationCollection.- Shipping and billing addresses')}</p>
        <p className=''>{t('InformationCollection.- Payment information (credit card details)')}</p>
        <p className=''>{t('InformationCollection.- Order history')}</p>
      </div>
    </div>
  )
}
