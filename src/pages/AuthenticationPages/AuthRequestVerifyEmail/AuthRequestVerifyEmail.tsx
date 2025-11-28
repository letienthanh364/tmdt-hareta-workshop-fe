import { useMutation } from '@tanstack/react-query'
import { Fragment, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HttpStatusMessage } from 'src/constants/httpStatusMessage'
import mainPath from 'src/constants/path'
import { ErrorRespone } from 'src/types/utils.type'
import { RequestVerifySchema } from 'src/utils/rules'
import { isAxiosBadRequestError } from 'src/utils/utils'
import verifyEmail from 'src/apis/verifyEmail.api'
import useTimer from 'src/hooks/useTimer'
import VerificationEmailSentPopup from 'src/components/VerifyEmailDialog/VerificationEmailSentPopup'
import AnimateTransition from 'src/components/AnimateTransition'
import { useTranslation } from 'react-i18next'
import MessagePopup from 'src/components/VerifyEmailDialog/LowerComponent/MessagePopup'
type FormData = RequestVerifySchema

export default function AuthRequestVerifyEmail() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [emailSentDialog, setEmailSentDialog] = useState(false)
  const [click, setClick] = useState(false)
  const [errorDialog, setErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { counter, setCounter } = useTimer()

  const requestVerifyMutation = useMutation({
    mutationFn: (body: FormData) => verifyEmail.requestVerify(body)
  })

  const onSubmit = () => {
    setErrorDialog(false)
    setEmailSentDialog(false)
    setClick(true)
    requestVerifyMutation.mutate(
      { email: state.email },
      {
        onSuccess: () => {
          setEmailSentDialog(true)
          setCounter(60)
          setClick(false)
        },
        onError: (error) => {
          setClick(false)
          setErrorDialog(true)
          setCounter(60)
          if (isAxiosBadRequestError<ErrorRespone>(error)) {
            const formError = error.response?.data
            const errorMessage = HttpStatusMessage.get(formError?.error_key || '')
            setErrorMessage(errorMessage ? errorMessage : t('dialog.Undefined error'))
          }
        }
      }
    )
  }

  useEffect(() => {
    if (state) {
      requestVerifyMutation.mutate({ email: state.email })
      setCounter(60)
    } else {
      navigate(mainPath.login, { state: { type: 'Fail', title: 'EmailVerification', context: 'Invalid Verification' } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, navigate])

  //! Multi languages
  const { t } = useTranslation('login')

  return (
    <Fragment>
      <AnimateTransition>
        <div className='container'>
          <div className='grid grid-cols-1 py-12 text-darkText dark:text-lightText tablet:grid-cols-6 tablet:px-6'>
            <div className='tablet:col-start-2 tablet:col-end-6 desktop:col-span-3 desktop:col-end-7'>
              <div className=' rounded-2xl bg-lightColor900 px-4 py-8 font-newfont shadow-sm duration-200 dark:bg-darkColor900'>
                <p className='text-center text-lg font-semibold uppercase text-orangeColor tablet:text-2xl desktop:text-3xl'>
                  {t('dialog.Please verify your email')}
                </p>

                <div className='flex flex-col items-center justify-center text-pretty pt-2 tabletSmall:pt-5'>
                  <p className='mt-2 text-center text-sm text-black dark:text-textVintage/80 tabletSmall:text-xl'>
                    {t('dialog.An email has been sent to your address')}
                  </p>
                  <p className=' w-full truncate text-center text-sm font-medium text-black dark:text-white tabletSmall:text-xl'>
                    {state?.email}
                  </p>
                  <p className='mt-2 text-center text-sm text-black dark:text-textVintage/80 tabletSmall:text-xl'>
                    {t(
                      'dialog.Please check your email inbox and click on the confirmation link to verify your email address.'
                    )}
                  </p>
                  <div className='flex w-full items-center justify-center py-4'>
                    <button
                      disabled={counter > 0 || click}
                      onClick={onSubmit}
                      className={
                        'flex h-full items-center justify-center rounded-xl bg-orangeColor px-4 py-2 text-sm font-semibold text-black duration-200 tabletSmall:text-base desktop:px-6 ' +
                        (counter > 0 || click
                          ? 'cursor-not-allowed bg-opacity-80 dark:bg-opacity-50'
                          : 'hover:bg-opacity-80')
                      }
                    >
                      {(counter > 0 || click) && (
                        <svg
                          aria-hidden='true'
                          className='mr-2 h-4 w-4 animate-spin fill-white text-gray-200 dark:text-gray-600'
                          viewBox='0 0 100 101'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                            fill='currentColor'
                          />
                          <path
                            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                            fill='currentFill'
                          />
                        </svg>
                      )}
                      {counter > 0 ? <span> {counter + 's'} </span> : <span>{t('dialog.Resend Email')}</span>}
                    </button>
                  </div>
                  <div className='mt-1 flex justify-center space-x-2 text-sm font-thin tablet:text-base desktop:text-xl'>
                    <p className='opacity-80'>{t('dialog.Wrong email address?')}</p>
                    <Link
                      to={mainPath.login}
                      className=' font-normal  text-unhoveringBg duration-200  hover:text-hoveringBg'
                    >
                      {t('dialog.Go back')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimateTransition>
      <VerificationEmailSentPopup
        dialog={emailSentDialog}
        closeDialog={() => {
          setEmailSentDialog(false)
        }}
      />

      <MessagePopup
        dialog={errorDialog}
        closeDialog={() => {
          setErrorDialog(false)
        }}
      >
        <div className='space-y-4'>
          <p className='text-2xl font-semibold uppercase text-alertRed'>
            {errorMessage || t('dialog.Undefined error')}
          </p>
          <p className='text-lg font-medium'>{t('dialog.Please try again')}</p>
        </div>
      </MessagePopup>
    </Fragment>
  )
}
