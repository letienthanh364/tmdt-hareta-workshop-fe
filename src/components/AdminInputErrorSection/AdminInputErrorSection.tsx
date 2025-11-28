import { useTranslation } from 'react-i18next'

export default function AdminInputErrorSection({ errorMessage }: { errorMessage?: string }) {
  //! handle errors
  const { t } = useTranslation('yuperrors')
  let message = ''
  switch (errorMessage) {
    case 'Customer name is required':
      message = t('order.Customer name is required')
      break
    case 'Customer phone number is required':
      message = t('order.Customer phone number is required')
      break
    case 'Email address is required':
      message = t('order.Customer email address is required')
      break
    case 'Address is required':
      message = t('order.Address is required')
      break
    default:
      message = errorMessage as string
      break
  }

  return (
    <div className='col-span-4 grid grid-cols-4 gap-1'>
      <div className='col-start-2 col-end-5 mt-0.5 min-h-[1.25rem] text-sm text-alertRed'>{message}</div>
    </div>
  )
}
