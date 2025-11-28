import { faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate()
  return (
    <button
      className='flex items-center justify-center text-darkText dark:text-lightText '
      onClick={() => {
        navigate(-1)
      }}
    >
      <FontAwesomeIcon icon={faCaretLeft} className='h-6 w-6' />
    </button>
  )
}
