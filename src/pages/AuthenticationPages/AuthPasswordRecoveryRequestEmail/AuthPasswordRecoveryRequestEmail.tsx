import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import Button from 'src/components/Button'
import { HttpStatusMessage } from 'src/constants/httpStatusMessage'
import mainPath from 'src/constants/path'
import { ErrorRespone } from 'src/types/utils.type'
import { RequestVerifySchema, requestVerifySchema } from 'src/utils/rules'
import { isAxiosBadRequestError } from 'src/utils/utils'
import AccountInput from 'src/components/AccountInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faLock } from '@fortawesome/free-solid-svg-icons'
import passwordRecovery from 'src/apis/passwordRecovery.api'
import RecoveryEmailSentPopup from 'src/components/VerifyEmailDialog/RecoveryEmailSentPopup'
import InvalidLinkPopup from 'src/components/VerifyEmailDialog/InvalidLinkPopup'
import { useTranslation } from 'react-i18next'
import AnimateTransition from 'src/components/AnimateTransition'

type FormData = RequestVerifySchema

export default function AuthPasswordRecoveryRequestEmail() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(requestVerifySchema)
  })

  const { state } = useLocation()
  const [dialogFail, setDialogFail] = useState(false)
  const [dialogSuccess, setDialogSuccess] = useState(false)

  useEffect(() => {
    if (state) {
      if (state.failSlugVerify) {
        setDialogFail(true)
      }
    }
  }, [state, setDialogFail])

  //Counter
  const [counter, setCounter] = useState(0)
  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000)
  }, [counter])

  const passwordRecoveryMutation = useMutation({
    mutationFn: (body: FormData) => passwordRecovery.requestRecovery(body)
  })

  //! Handle submit
  const onSubmit = handleSubmit((data) => {
    passwordRecoveryMutation.mutate(data, {
      onSuccess: () => {
        setDialogSuccess(true)
        setCounter(60)
      },
      onError: (error) => {
        // console.log(error)
        if (isAxiosBadRequestError<ErrorRespone>(error)) {
          const formError = error.response?.data
          const errorMessage = HttpStatusMessage.get(formError?.error_key || '')
          if (errorMessage) {
            setError('email', {
              message: errorMessage,
              type: 'Server'
            })
          }
        } else {
          setError('email', {
            message: 'Something went wrong',
            type: 'Server'
          })
        }
      }
    })
  })

  //! Multi languages
  const { t } = useTranslation('login')

  return (
    <Fragment>
      <AnimateTransition isDialog={state?.failSlugVerify}>
        <div className='container'>
          <div className='grid grid-cols-1 py-12 tablet:grid-cols-6 tablet:px-6'>
            <div className='tablet:col-start-2 tablet:col-end-6 desktop:col-span-3 desktop:col-end-7'>
              <form
                className='rounded-2xl bg-lightColor900 p-5 text-darkText shadow-sm duration-200 dark:bg-darkColor900 dark:text-lightText tablet:p-10'
                onSubmit={onSubmit}
                noValidate
              >
                <div>
                  <Link to={mainPath.login} className='absolute'>
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      fontSize={32}
                      className='hidden pr-4 text-haretaColor/80 opacity-70 duration-200 hover:opacity-100 tablet:block'
                    />
                  </Link>
                  <div className=' text-center text-base font-medium uppercase text-haretaColor tabletSmall:text-xl desktopLarge:text-2xl'>
                    {t('password.password recovery')}
                  </div>
                </div>

                <AccountInput
                  name='email'
                  register={register}
                  type='text'
                  className='autofill:bg-red-400 autofill:text-darkText autofill:dark:text-lightText tablet:mt-8'
                  errorMessage={errors.email?.message}
                  labelName={t('password.Email address')}
                  required
                  autoComplete='on'
                  label={<FontAwesomeIcon icon={faLock} className='h-4 w-4 text-haretaColor' />}
                />

                <div className='mt-2 text-base desktop:text-lg'>
                  <Button
                    className='flex w-full items-center justify-center py-2 desktop:py-3'
                    type='submit'
                    isLoading={passwordRecoveryMutation.isPending || counter > 0}
                    disabled={passwordRecoveryMutation.isPending || counter > 0}
                  >
                    {counter == 0 && t('password.Send')}
                    {counter == 1 && t('password.Wait for') + ' 1 ' + t('password.second')}
                    {counter > 1 && t('password.Wait for') + ' ' + counter + ' ' + t('password.second')}
                  </Button>
                </div>
                <div className='mt-4 flex justify-center space-x-2'>
                  <p className='opacity-60'>{t('password.Go back to')}</p>
                  <Link
                    to={mainPath.login}
                    className='capitalize text-haretaColor dark:text-primaryColor hover:dark:text-haretaColor'
                  >
                    {t('login.login')}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AnimateTransition>
      <InvalidLinkPopup dialog={dialogFail} closeDialog={() => setDialogFail(false)} />
      <RecoveryEmailSentPopup dialog={dialogSuccess} closeDialog={() => setDialogSuccess(false)} />
    </Fragment>
  )
}
