import { useTranslation } from 'react-i18next'
import MessagePopup from '../LowerComponent/MessagePopup'

interface Props {
  dialog: boolean
  closeDialog: () => void
}

export default function RecoveryEmailSentPopup({ dialog, closeDialog }: Props) {
  //! Multi languages
  const { t } = useTranslation('login')

  return (
    <MessagePopup dialog={dialog} closeDialog={closeDialog}>
      <div className='space-y-4 text-pretty'>
        <p>{t('dialog.A password reset link has been sent to your email inbox')}</p>
        <p>
          <span>{t('dialog.Please follow the link provided in the email to ')}</span>
          <span className={'text-haretaColor'}>{t('dialog.reset your password')}</span>
        </p>
      </div>
    </MessagePopup>
  )
}
