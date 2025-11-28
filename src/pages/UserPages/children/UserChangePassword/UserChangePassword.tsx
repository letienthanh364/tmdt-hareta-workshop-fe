import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { Fragment, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import userApi from 'src/apis/user.api'
import DialogPopup from 'src/components/DialogPopup'
import Input from 'src/components/Input'
import { AppContext } from 'src/contexts/app.context'
import { ErrorRespone } from 'src/types/utils.type'
import { clearLS } from 'src/utils/auth'
import { changePasswordSchema, ChangePasswordSchema } from 'src/utils/rules'
import { isAxiosBadRequestError } from 'src/utils/utils'

type FormData = ChangePasswordSchema

export default function UserChangePassword() {
  const { theme, setIsAuthenticated, setProfile } = useContext(AppContext)

  const [successDialog, setSuccessDialog] = useState<boolean>(false)

  //! Use form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<FormData>({
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_new_password: ''
    },
    resolver: yupResolver(changePasswordSchema),
    shouldFocusError: false
  })

  //! Change password
  const changePasswordMutation = useMutation({ mutationFn: userApi.changePassword })
  const onSubmit = handleSubmit(async (data) => {
    try {
      await changePasswordMutation.mutateAsync(data, {
        onSuccess: () => {
          reset()
          setSuccessDialog(true)
        }
      })
    } catch (error) {
      if (isAxiosBadRequestError<ErrorRespone>(error)) {
        const formError = error.response?.data
        if (formError) {
          const errorKey = formError.error_key
          if (errorKey === 'ErrOldPasswordIsInvalid') {
            setError('old_password', {
              message: 'Your password is incorrect',
              type: 'Server'
            })
          }
          if (errorKey === 'ErrNewPasswordIsInvalid') {
            setError('confirm_new_password', {
              message: 'Passwords do not match',
              type: 'Server'
            })
          }
        }
      }
    }
  })

  const queryClient = useQueryClient()
  const handleLogout = () => {
    clearLS()
    setIsAuthenticated(false)
    setProfile(null)
    queryClient.removeQueries({
      queryKey: ['purchases']
    })
  }

  const handelConfirm = () => {
    setSuccessDialog(false)
    handleLogout()
  }

  const handleCancle = () => {
    reset()
  }

  //! translation
  const { t } = useTranslation('user')

  //! Style
  const wrapperClassName = 'relative w-full'
  const titleClassName = 'text-sm font-medium uppercase desktop:text-lg'
  const inputClassName =
    'mt-2 w-full tabletSmall:w-[50%] relative pl-4 pr-10 tablet:pr-12 py-2 bg-lightColor900 rounded-xl dark:bg-darkColor900 text-xs desktop:text-base outline-haretaColor/60 dark:outline-haretaColor/60 outline focus:outline-2 outline-1 autofill:text-darkText dark:caret-white autofill:dark:text-textVintage focus:outline-haretaColor dark:focus:outline-haretaColor'
  const inputFieldClassname = 'bg-transparent w-full outline-none'

  return (
    <Fragment>
      <form className='my-4 px-2 tablet:my-6 tablet:px-4 desktop:my-8 desktop:px-6' onSubmit={onSubmit}>
        <div className='flex flex-col space-y-2 rounded-lg border border-black/20 bg-lightBg p-4 dark:border-white/20 dark:bg-darkBg'>
          <div className={wrapperClassName}>
            <p className={titleClassName}>{t('password.current password')}</p>
            <Input
              type='password'
              isPasswordInput
              className={inputClassName}
              inputClassName={inputFieldClassname}
              register={register}
              name='old_password'
              errorMessage={errors.old_password?.message}
            />
          </div>
          <div className={wrapperClassName}>
            <p className={titleClassName}>{t('password.new password')}</p>
            <Input
              type='password'
              isPasswordInput
              className={inputClassName}
              inputClassName={inputFieldClassname}
              register={register}
              name='new_password'
              errorMessage={errors.new_password?.message}
            />
          </div>
          <div className={wrapperClassName}>
            <p className={titleClassName}>{t('password.confirm new password')}</p>
            <Input
              type='password'
              isPasswordInput
              className={inputClassName}
              inputClassName={inputFieldClassname}
              register={register}
              name='confirm_new_password'
              errorMessage={errors.confirm_new_password?.message}
            />
          </div>
          <div className='flex w-full justify-between space-x-8 pt-2 text-sm tabletSmall:w-[50%] desktop:space-x-20 desktop:text-base'>
            <button
              type='submit'
              className='rounded-xl bg-unhoveringBg px-2 py-1 font-medium text-darkText hover:bg-hoveringBg desktop:px-4 desktop:py-1.5 '
            >
              {t('password.change password')}
            </button>
            <button type='button' className='hover:underline' onClick={handleCancle}>
              {t('password.cancel')}
            </button>
          </div>
        </div>
      </form>
      <DialogPopup
        classNameWrapper='relative w-96 max-w-md transform overflow-hidden rounded-2xl p-6 align-middle shadow-xl transition-all'
        isOpen={successDialog}
        handleClose={handelConfirm}
        closeButton={false}
      >
        <div className=' text-center'>
          <FontAwesomeIcon
            icon={faCheck}
            fontSize={36}
            className={classNames('text- rounded-full  p-4 text-center text-successGreen ', {
              'bg-black/20': theme === 'light',
              'bg-white/20': theme === 'dark'
            })}
          />
        </div>
        <p className='mt-6 text-center text-xl font-medium leading-6'>{t('password.message')}</p>
        <div className='mt-8 flex items-center justify-center'>
          <button
            onClick={handelConfirm}
            type='button'
            className={classNames(
              'inline-flex justify-center rounded-xl border border-transparent bg-unhoveringBg px-4 py-1.5 text-sm font-medium text-darkText hover:bg-hoveringBg desktop:text-base'
            )}
          >
            {t('password.go to login')}
          </button>
        </div>
      </DialogPopup>
      ,
    </Fragment>
  )
}
