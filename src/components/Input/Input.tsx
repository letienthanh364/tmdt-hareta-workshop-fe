import classNames from 'classnames'
import { Fragment, InputHTMLAttributes, useState } from 'react'
import type { UseFormRegister, RegisterOptions } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  inputClassName?: string
  errorClassName?: string
  isPasswordInput?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function Input({
  name,
  register,
  className = 'bg-transparent',
  errorMessage,
  rules,
  isPasswordInput = false,
  inputClassName = 'w-full rounded-sm border border-gray-300 p-3 outline-none outline',
  errorClassName = 'mt-1 min-h-[1.25rem] desktop:min-h-[1.5rem] text-sm desktop:text-base text-red-600',
  type,
  ...rest
}: Props) {
  const [visible, setVisible] = useState<boolean>(false)

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

  const registerResult = register && name ? register(name, rules) : {}
  return (
    <Fragment>
      <div className={classNames('relative', className)}>
        <input type={visible ? 'text' : `${type}`} className={inputClassName} {...registerResult} {...rest} />
        {isPasswordInput && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            className='absolute right-4 top-1/2 -translate-y-1/2 hover:cursor-pointer'
            onClick={() => setVisible(!visible)}
          >
            {visible && (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='h-4 w-4 fill-haretaColor dark:fill-haretaColor tablet:h-6 tablet:w-6'
              >
                <path d='M12 15a3 3 0 100-6 3 3 0 000 6z' />
                <path
                  fillRule='evenodd'
                  d='M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z'
                  clipRule='evenodd'
                />
              </svg>
            )}
            {!visible && (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='h-4 w-4 fill-haretaColor/60 hover:fill-haretaColor tablet:h-6 tablet:w-6'
              >
                <path d='M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z' />
                <path d='M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z' />
                <path d='M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z' />
              </svg>
            )}
          </div>
        )}
      </div>
      <div className={errorClassName}>{message}</div>
    </Fragment>
  )
}
