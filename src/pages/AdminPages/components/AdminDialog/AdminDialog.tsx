import { faCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DialogPopup from 'src/components/DialogPopup'

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  state?: boolean
  content?: string
}

export default function AdminDialog({ isOpen, setIsOpen, state = true, content = 'Thành công' }: Props) {
  return (
    <DialogPopup
      isOpen={isOpen}
      handleClose={() => {
        setIsOpen(false)
      }}
      classNameWrapper='relative w-72 max-w-md transform overflow-hidden rounded-2xl p-6 align-middle shadow-xl transition-all'
    >
      <div className='text-center'>
        {state && (
          <FontAwesomeIcon
            icon={faCheck}
            fontSize={36}
            className={'rounded-full bg-black/10  p-4 text-center text-successGreen'}
          />
        )}
        {!state && (
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            fontSize={36}
            className={'rounded-full bg-black/10  p-4 text-center text-alertRed'}
          />
        )}
      </div>
      <p className='mt-6 text-center text-xl font-semibold uppercase leading-6'>{content}</p>
    </DialogPopup>
  )
}
