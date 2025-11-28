import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MessagePopup from '../LowerComponent/MessagePopup'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

interface Props {
  dialog: boolean
  closeDialog: () => void
}

export default function EmailNotVerifiedPopup({ dialog, closeDialog }: Props) {
  const orangeTextColor = ' text-[#ff6a00]'
  return (
    <MessagePopup dialog={dialog} closeDialog={closeDialog}>
      <FontAwesomeIcon icon={faCircleXmark} className='mt-2 h-1/4 w-1/4 text-alertRed' />
      <p>
        A verification <span className={orangeTextColor}>link</span> has been sent
      </p>
      <p>
        to your
        <span className={orangeTextColor}> email inbox.</span>
      </p>
      <p>
        Follow the link to
        <span className={orangeTextColor}> verify your email.</span>
      </p>
    </MessagePopup>
  )
}
