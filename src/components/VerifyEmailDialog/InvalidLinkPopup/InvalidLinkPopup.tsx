import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MessagePopup from '../LowerComponent/MessagePopup'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

interface Props {
  dialog: boolean
  closeDialog: () => void
}

export default function InvalidLinkPopup({ dialog, closeDialog }: Props) {
  //! Multi languages
  const { t } = useTranslation('login')

  return (
    <MessagePopup dialog={dialog} closeDialog={closeDialog}>
      <FontAwesomeIcon icon={faCircleXmark} fontSize={70} className=' text-alertRed' />
      <div className='space-y-4 text-pretty'>
        <p className=''>{t('dialog.The link you have tried appears to be invalid.')}</p>
        <p className=''>
          <span className=''>{t('dialog.Please')} </span>
          <span className='text-haretaColor'>{t('dialog.check and try again')}</span>
        </p>
      </div>
    </MessagePopup>
  )
}
