import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fragment } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { UserSchema } from 'src/utils/rules'

type FormData = Pick<UserSchema, 'name' | 'phone'>

export default function UserEditProfile() {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormData>()

  //! Multi languages
  const { t } = useTranslation('user')

  return (
    <Fragment>
      <div className=''>
        <div className='flex items-center space-x-2'>
          <p className='text-base uppercase text-darkText/60 dark:text-lightText/60 desktop:text-lg'>
            {t('profile.name')}
          </p>
          <FontAwesomeIcon icon={faPen} fontSize={12} className='text-orangeColor dark:text-haretaColor' />
        </div>
        <div className='relative'>
          <Input
            inputClassName='text-sm w-full py-1 bg-transparent desktop:text-base outline-none duration-200 autofill:text-darkText  dark:caret-white autofill:dark:text-textVintage'
            register={register}
            name='name'
            errorMessage={errors?.name?.message}
            autoComplete='false'
          />
          <div className='absolute bottom-5 w-full border-b-2 border-black/60 dark:border-white/60'></div>
        </div>
      </div>
      <div className=''>
        <div className='flex items-center space-x-2'>
          <p className='text-base uppercase text-darkText/60 dark:text-lightText/60 desktop:text-lg'>
            {t('profile.phone number')}
          </p>
          <FontAwesomeIcon icon={faPen} fontSize={12} className='text-orangeColor dark:text-haretaColor' />
        </div>
        <div className='relative'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <InputNumber
                inputClassName='text-sm w-full py-1 bg-transparent desktop:text-base outline-none duration-200 autofill:text-darkText dark:caret-white autofill:dark:text-textVintage'
                errorMessage={errors.phone?.message}
                autoComplete='false'
                {...field}
                onChange={field.onChange}
              />
            )}
          />

          <div className='absolute bottom-5 w-full border-b-2 border-black/60 dark:border-white/60'></div>
        </div>
      </div>
    </Fragment>
  )
}
