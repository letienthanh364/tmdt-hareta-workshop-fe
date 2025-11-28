import { useTranslation } from 'react-i18next'

export default function PrivacySharingOfInformation() {
  //! Multi languages
  const { t } = useTranslation('privacyAndTerms')
  return (
    <div>
      <div className='text-lg font-bold uppercase tablet:text-2xl desktopLarge:text-3xl'>
        {t('SharingOfInformation.title')}
      </div>
      <div className='mt-2 flex flex-col space-y-2 text-sm tabletSmall:text-base tablet:text-lg desktopLarge:text-xl'>
        <p className=''>{t('SharingOfInformation.content')}</p>
      </div>
    </div>
  )
}
