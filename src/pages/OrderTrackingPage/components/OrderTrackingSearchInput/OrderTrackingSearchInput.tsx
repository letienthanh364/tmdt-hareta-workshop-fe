import classNames from 'classnames'
import { Fragment } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  rules?: RegisterOptions
  required?: boolean
}

export default function OrderTrackingSearchInput({ name, register, errorMessage, rules, required = false }: Props) {
  //! handle error
  const { t } = useTranslation('support')
  let message = ''
  switch (errorMessage) {
    case 'Order ID is invalid':
      message = t('order.Order ID is invalid')
      break
    case 'ID is required':
      message = t('order.Order ID is required')
      break
    default:
      break
  }

  return (
    <Fragment>
      <div className='relative flex w-full items-center rounded-xl bg-transparent shadow-sm'>
        <input
          autoComplete='off'
          className={classNames(
            'w-full rounded-xl bg-transparent px-4 py-1 text-base outline-none ring-1  duration-200 autofill:text-darkText focus:ring-2 focus:ring-primaryColor dark:caret-white dark:autofill:text-lightText desktop:py-2 desktop:text-lg',
            {
              'ring-alertRed': errorMessage,
              'ring-haretaColor': !errorMessage
            }
          )}
          placeholder={t('order.placeholder')}
          required={required}
          {...register(name, rules)}
        />
        <button className='absolute right-1 flex items-center justify-center rounded-xl bg-unhoveringBg px-3 py-1 hover:bg-hoveringBg desktop:right-4 desktop:px-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='h-4 w-4 desktop:h-5 desktop:w-5'
          >
            <path
              fillRule='evenodd'
              d='M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
      <div className={'mt-1 min-h-[1.25rem] text-sm text-red-600 tablet:text-base '}>{message}</div>
    </Fragment>
  )
}
