import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MessagePopup from '../LowerComponent/MessagePopup'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

interface Props {
  dialog: boolean
  closeDialog: () => void
}

export default function SuccessPasswordRecoveryPopup({ dialog, closeDialog }: Props) {
  //! Multi languages
  const { t } = useTranslation('login')

  return (
    <MessagePopup dialog={dialog} closeDialog={closeDialog}>
      <FontAwesomeIcon icon={faCircleCheck} className='mt-2 h-1/4 w-1/4 text-successGreen' />
      <div className={'mb-3 text-pretty text-lg font-semibold capitalize tablet:text-xl desktop:text-2xl'}>
        {t('dialog.Your password is changed successfully')}
      </div>
      <p>
        {t('dialog.You can')} <span className='text-haretaColor'>{t('dialog.login')}</span>{' '}
        {t('dialog.to continue shopping')}
      </p>
    </MessagePopup>
  )
}
