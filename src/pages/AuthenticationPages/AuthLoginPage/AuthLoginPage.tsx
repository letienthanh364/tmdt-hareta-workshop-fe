import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import { HttpStatusMessage } from 'src/constants/httpStatusMessage'
import mainPath from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { ErrorRespone } from 'src/types/utils.type'
import { setProfileToLS } from 'src/utils/auth'
import { LoginSchema, loginSchema } from 'src/utils/rules'
import { isAxiosBadRequestError } from 'src/utils/utils'
import AccountInput from 'src/components/AccountInput'
import omit from 'lodash/omit'
import InvalidLinkPopup from 'src/components/VerifyEmailDialog/InvalidLinkPopup'
import SuccessPasswordRecoveryPopup from 'src/components/VerifyEmailDialog/SuccessPasswordRecoveryPopup'
import SuccessEmailVerifyPopup from 'src/components/VerifyEmailDialog/SuccessEmailVerifyPopup'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import AnimateTransition from 'src/components/AnimateTransition'
import { Helmet } from 'react-helmet-async'
import classNames from 'classnames'

type FormData = LoginSchema

export default function AuthLoginPage() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)

  const navigate = useNavigate()
  const { state } = useLocation()

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginAccountMutation = useMutation({
    mutationFn: (body: FormData) => authApi.loginAccount(body)
  })
  const getProfileMutation = useMutation({
    mutationFn: authApi.getProfile
  })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: () => {
        setIsAuthenticated(true)
        getProfileMutation.mutateAsync().then((response) => {
          setProfileToLS(response.data.data)
          setProfile(response.data.data)
        })

        if (state && state.context == 'AccessProtectedRouteDenied' && state.from == 'user') {
          navigate(mainPath.user)
        } else {
          navigate(-1)
        }
      },
      onError: (error) => {
        if (isAxiosBadRequestError<ErrorRespone>(error)) {
          const formError = error.response?.data
          if (formError) {
            if (formError.error_key == 'ErrEmailNotVerified') {
              navigate(mainPath.requestVerify, {
                state: { ...omit(data, ['password']), error: 'Please verify your email', from: mainPath.login }
              })
            }

            const errorMessgae = HttpStatusMessage.get(formError.error_key)
            if (errorMessgae) {
              setError('email', {
                message: 'email or password is invalid'
              })
              setError('password', {
                message: ''
              })
            }
          }
        }
      }
    })
  })

  const [dialog, setDialog] = useState(true)
  const closeDialog = () => setDialog(false)
  useEffect(() => {
    if (state && (state.title == 'PasswordRecovery' || state.title == 'EmailVerification')) {
      setDialog(true)
      if (state?.email) {
        setValue('email', state?.email)
      }
    }
  }, [setValue, state])

  //! Multi languages
  const { t } = useTranslation('login')

  return (
    <AnimateTransition isDialog={state}>
      <Helmet>
        <title>{t('helmet.Login')} | Hareta Workshop</title>
        <meta
          name='description'
          content={t(
            'helmet.Securely log in to access your account and enjoy a personalized shopping experience with our unique handcrafted keycaps.'
          )}
        />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 tablet:grid-cols-6 tablet:px-6'>
          <div className='tablet:col-start-2 tablet:col-end-6 desktop:col-span-3 desktop:col-end-7'>
            <form
              className='rounded-2xl bg-lightColor900 p-5 shadow-sm duration-200 dark:bg-darkColor900 tablet:p-10'
              onSubmit={onSubmit}
              noValidate
            >
              <div className='text-center text-2xl font-semibold uppercase text-haretaColor'>{t('login.login')}</div>

              <AccountInput
                name='email'
                register={register}
                type='text'
                className='mt-8 autofill:text-darkText autofill:dark:text-lightText'
                errorMessage={errors.email?.message}
                labelName={t('login.email')}
                required
                autoComplete='on'
                label={<FontAwesomeIcon icon={faEnvelope} className='h-4 w-4 text-haretaColor' />}
              />

              <AccountInput
                name='password'
                register={register}
                type='password'
                className='mt-3'
                errorMessage={errors.password?.message}
                labelName={t('login.password')}
                required
                isPasswordInput
                label={<FontAwesomeIcon icon={faLock} className='h-4 w-4 text-haretaColor' />}
              />

              <div className='mt-2 text-base desktop:text-lg '>
                <Button
                  className='flex w-full items-center justify-center py-2 uppercase desktop:py-3'
                  type='submit'
                  isLoading={loginAccountMutation.isPending}
                  disabled={loginAccountMutation.isPending}
                >
                  {t('login.login')}
                </Button>
              </div>

              <div className='tablet:text-md mt-4 flex flex-col-reverse items-center justify-between text-xs tabletSmall:text-sm tablet:mt-12 tablet:flex-row'>
                <div className=''>
                  <Link
                    to={mainPath.AuthPasswordRecoveryRequestEmail}
                    state={{ email: getValues('email') }}
                    className={classNames(
                      'text-blue-700 underline underline-offset-1 opacity-80 duration-200  dark:text-blue-400',
                      {
                        'pointer-events-none opacity-60 hover:opacity-60': loginAccountMutation.isPending,
                        'hover:opacity-100': !loginAccountMutation.isPending
                      }
                    )}
                  >
                    {t('login.Forgot Password?')}
                  </Link>
                </div>

                <div className='flex flex-col items-center text-center font-medium tablet:flex-row'>
                  <span className='text-darkText/60 dark:text-lightText/60'>{t("login.Don't have an account?")}</span>
                  <Link
                    className={classNames('ml-2 text-haretaColor duration-200 ', {
                      'pointer-events-none opacity-60 hover:text-haretaColor': loginAccountMutation.isPending,
                      'hover:text-primaryColor': !loginAccountMutation.isPending
                    })}
                    to={mainPath.register}
                  >
                    {t('login.sign up')}
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {state && state?.type == 'Success' && state?.title == 'PasswordRecovery' && (
        <SuccessPasswordRecoveryPopup dialog={dialog} closeDialog={closeDialog} />
      )}
      {state && state?.type == 'Success' && state?.title == 'EmailVerification' && (
        <SuccessEmailVerifyPopup dialog={dialog} closeDialog={closeDialog} />
      )}
      {state && state?.type == 'Fail' && <InvalidLinkPopup dialog={dialog} closeDialog={closeDialog} />}
    </AnimateTransition>
  )
}
