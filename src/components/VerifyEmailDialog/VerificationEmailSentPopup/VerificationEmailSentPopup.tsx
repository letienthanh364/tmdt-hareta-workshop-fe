import { useTranslation } from 'react-i18next'
import MessagePopup from '../LowerComponent/MessagePopup'

interface Props {
  dialog: boolean
  closeDialog: () => void
}

export default function VerificationEmailSentPopup({ dialog, closeDialog }: Props) {
  const { t } = useTranslation('login')

  return (
    <MessagePopup dialog={dialog} closeDialog={closeDialog}>
      <div className='space-y-4 text-pretty'>
        <p className=''>{t('dialog.A verification link has been sent to your email address')}</p>
        <p className=' text-center'>
          <span>{t('dialog.Please follow the link provided in the email to ')}</span>
          <span className={'text-haretaColor'}>{t('dialog.verify your email address')}</span>
        </p>
      </div>
    </MessagePopup>
  )
}
