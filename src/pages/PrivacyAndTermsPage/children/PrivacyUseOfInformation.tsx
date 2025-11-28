import { useTranslation } from 'react-i18next'

export default function PrivacyUseOfInformation() {
  //! Multi languages
  const { t } = useTranslation('privacyAndTerms')
  return (
    <div>
      <div className='text-lg font-bold uppercase tablet:text-2xl desktopLarge:text-3xl'>
        {t('UseOfInformation.title')}
      </div>
      <div className='mt-2 flex flex-col space-y-2 text-sm tabletSmall:text-base tablet:text-lg desktopLarge:text-xl'>
        <p className=''>{t('UseOfInformation.We use the collected information for various purposes including:')}</p>
        <p className=''>{t('UseOfInformation.- Processing and fulfilling your orders')}</p>
        <p className=''>{t('UseOfInformation.- Communicating with you about your orders or inquiries')}</p>
        <p className=''>{t('UseOfInformation.- Sending promotional offers or newsletters (with your consent)')}</p>
        <p className=''>{t('UseOfInformation.- Improving our products and services')}</p>
        <p className=''>{t('UseOfInformation.- Sending promotional offers or newsletters (with your consent)')}</p>
      </div>
    </div>
  )
}
