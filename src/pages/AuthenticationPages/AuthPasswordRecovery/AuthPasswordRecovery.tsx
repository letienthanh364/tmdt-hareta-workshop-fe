import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from 'src/components/Button'
import { HttpStatusMessage } from 'src/constants/httpStatusMessage'
import mainPath from 'src/constants/path'
import { ErrorRespone } from 'src/types/utils.type'
import { PasswordRecoverySchema, passwordRecoverySchema } from 'src/utils/rules'
import { isAxiosBadRequestError } from 'src/utils/utils'
import AccountInput from 'src/components/AccountInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faLock } from '@fortawesome/free-solid-svg-icons'
import passwordRecovery from 'src/apis/passwordRecovery.api'
import AnimateTransition from 'src/components/AnimateTransition'
import LoadingSection from 'src/components/LoadingSection'

type FormData = PasswordRecoverySchema

export default function AuthPasswordRecovery() {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(passwordRecoverySchema)
  })

  const navigate = useNavigate()
  const { slug } = useParams()
  const { data, error, isLoading, isSuccess, isError } = useQuery({
    queryKey: ['password_recovery'],
    queryFn: () => passwordRecovery.verifySlug(slug as string)
  })
  useEffect(() => {
    if (isSuccess) {
      setValue('email', data.data.data.email as string)
    }
  }, [isSuccess, setValue, data])

  useEffect(() => {
    if (isAxiosBadRequestError<ErrorRespone>(error)) {
      const formError = error.response?.data
      if (formError && formError.error_key === 'ErrPasswordRecoveryNotFound') {
        navigate(mainPath.AuthPasswordRecoveryRequestEmail, { state: { failSlugVerify: 'true' } })
      }
    }
  }, [isError, error, navigate])

  const AuthPasswordRecoveryMutation = useMutation({
    mutationFn: (body: { slug: string; password: string }) => passwordRecovery.changePassword(body)
  })

  const onSubmit = handleSubmit((data) => {
    const submitData = {
      slug: slug as string,
      password: data.new_password
    }
    AuthPasswordRecoveryMutation.mutate(submitData, {
      onSuccess: () => {
        navigate(mainPath.login, {
          state: { type: 'Success', title: 'PasswordRecovery', email: data.email }
        })
      },
      onError: (error) => {
        if (isAxiosBadRequestError<ErrorRespone>(error)) {
          const formError = error.response?.data
          const errorMessage = HttpStatusMessage.get(formError?.error_key || '')
          if (errorMessage) {
            setError('email', {
              message: errorMessage,
              type: 'Server'
            })
          }
        }
      }
    })
  })

  return (
    <>
      {isLoading && <LoadingSection />}
      {true && (
        <AnimateTransition>
          <div className='container'>
            <div className='grid grid-cols-1 py-12 tablet:grid-cols-6 tablet:px-6 tablet:py-24'>
              <div className='tablet:col-start-2 tablet:col-end-6 desktop:col-span-3 desktop:col-end-7'>
                <form
                  className='rounded bg-[#F5F5F5] p-5 shadow-sm duration-200 dark:bg-[#222222] tablet:p-10'
                  onSubmit={onSubmit}
                  noValidate
                >
                  <div>
                    <Link to={mainPath.login} className='absolute'>
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        fontSize={40}
                        className='hidden pr-4 text-vintageColor/80 opacity-70 duration-200 hover:opacity-100 dark:text-haretaColor tablet:block'
                      />
                    </Link>
                    <div className='py-1 text-center text-2xl uppercase text-vintageColor dark:text-haretaColor'>
                      Password Recovery
                    </div>
                  </div>
                  <div className='mt-4 flex flex-col items-center'>
                    <div className='flex items-center'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='h-6 w-6 fill-black duration-200 dark:fill-vintageColor tablet:h-8 tablet:w-8'
                      >
                        <>
                          <path d='M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z' />
                          <path d='M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z' />
                        </>
                      </svg>
                      <div className='ml-2 text-center text-lg font-semibold text-black dark:text-textVintage/80'>
                        Your email:
                      </div>
                    </div>
                    <div className='ml-3 w-full truncate text-center text-sm text-blue-700 dark:text-blue-400 tabletSmall:text-xl'>
                      {data?.data.data.email}
                    </div>
                  </div>
                  <AccountInput
                    name='new_password'
                    register={register}
                    type='password'
                    className='mt-8 autofill:bg-red-400 autofill:text-darkText autofill:dark:text-lightText'
                    errorMessage={errors.new_password?.message}
                    labelName='New Password'
                    required
                    isPasswordInput
                    autoComplete='on'
                    label={<FontAwesomeIcon icon={faLock} className='h-4 w-4 text-haretaColor' />}
                  />
                  <AccountInput
                    name='confirm_new_password'
                    register={register}
                    type='password'
                    className='mt-8 autofill:bg-red-400 autofill:text-darkText autofill:dark:text-lightText'
                    errorMessage={errors.confirm_new_password?.message}
                    labelName='Confirm New Password'
                    required
                    isPasswordInput
                    autoComplete='on'
                    label={<FontAwesomeIcon icon={faLock} className='h-4 w-4 text-haretaColor' />}
                  />
                  <div className='mt-2 text-base desktop:text-lg'>
                    <Button
                      className='flex w-full items-center justify-center py-2 uppercase desktop:py-3'
                      type='submit'
                      isLoading={AuthPasswordRecoveryMutation.isPending}
                      disabled={AuthPasswordRecoveryMutation.isPending}
                    >
                      Change
                    </Button>
                  </div>

                  <div className='mt-3 flex justify-center text-sm tablet:hidden'>
                    <p className='text-gray-400'>Go back to</p>
                    <Link to={mainPath.login} className='ml-1 text-brownColor dark:text-haretaColor'>
                      Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </AnimateTransition>
      )}
    </>
  )
}
