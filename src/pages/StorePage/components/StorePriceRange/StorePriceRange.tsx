import { yupResolver } from '@hookform/resolvers/yup'
import omit from 'lodash/omit'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import mainPath from 'src/constants/path'
import { NoUndefinedField } from 'src/types/utils.type'
import { PriceSchema, priceSchema } from 'src/utils/rules'
import classNames from 'classnames'
import { priceRanges } from '../../../../constants/priceRangeSample'
import { useTranslation } from 'react-i18next'
import StorePriceSample from '../StorePriceSample'
import useProductListQueryConfig from 'src/hooks/useProductListQueryConfig'

type FormData = NoUndefinedField<PriceSchema>

export default function StorePriceRange() {
  const queryConfig = useProductListQueryConfig()
  const { lower_price, upper_price } = queryConfig

  const [lowerPrice, setLowerPrice] = useState(lower_price || '')
  const [upperPrice, setUpperPrice] = useState(upper_price || '')

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
    trigger,
    setValue
  } = useForm<FormData>({
    defaultValues: {
      lower_price: '',
      upper_price: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })

  useEffect(() => {
    setValue('lower_price', lowerPrice)
    setValue('upper_price', upperPrice)
  }, [lowerPrice, setValue, upperPrice])

  const navigate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    let searchParams = createSearchParams(
      omit(
        {
          ...queryConfig,
          lower_price: data.lower_price as string,
          upper_price: data.upper_price as string
        },
        ['page', 'limit', 'limit']
      )
    )
    if (data.lower_price === '' && data.upper_price === '') {
      return
    } else if (data.lower_price === '') {
      searchParams = createSearchParams(
        omit(
          {
            ...queryConfig,
            upper_price: data.upper_price as string
          },
          ['lower_price', 'page', 'limit']
        )
      )
    } else if (data.upper_price === '') {
      searchParams = createSearchParams(
        omit(
          {
            ...queryConfig,
            lower_price: data.lower_price as string
          },
          ['upper_price', 'page', 'limit']
        )
      )
    }
    navigate({
      pathname: mainPath.store,
      search: searchParams.toString()
    })
  })

  const active = lower_price || upper_price
  const notAllowApply = lowerPrice === '' && upperPrice === ''
  const handleReset = () => {
    setLowerPrice('')
    setUpperPrice('')
    reset()
    navigate({
      pathname: mainPath.store
    })
  }

  const handleChangeLowerPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (/^\d+$/.test(value) || value === '') {
      setLowerPrice(value)
      trigger('upper_price')
    }
  }

  const handleChangeUpperPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (/^\d+$/.test(value) || value === '') {
      setUpperPrice(value)
      trigger('lower_price')
    }
  }

  const handleChoosePrice = (index: number) => {
    const priceRange = priceRanges[index]
    setLowerPrice(priceRange.lowerPrice.toString())
    setUpperPrice(priceRange.upperPrice.toString())
    setValue('lower_price', priceRange.lowerPrice.toString())
    setValue('upper_price', priceRange.upperPrice.toString())
    const searchParams = createSearchParams(
      omit(
        {
          ...queryConfig,
          lower_price: priceRange.lowerPrice.toString(),
          upper_price: priceRange.upperPrice.toString()
        },
        ['page', 'limit', 'limit']
      )
    )
    navigate({
      pathname: mainPath.store,
      search: searchParams.toString()
    })
  }

  //! Multi languages
  const { t } = useTranslation('store')

  return (
    <div className='relative w-full rounded-lg bg-sidebarItemLight px-3 py-2 text-center duration-200 dark:bg-sidebarItemDark'>
      <StorePriceSample handleChoosePrice={handleChoosePrice} />
      {active && (
        <button
          className={classNames(
            'absolute right-0 top-0 mt-1 rounded-md px-4 py-1 text-xs text-red-500 duration-200 hover:underline dark:hover:outline-red-500 desktop:text-sm desktopLarge:text-base'
          )}
          onClick={handleReset}
          type='button'
        >
          {t('aside filter.reset')}
        </button>
      )}
      <form className='mx-2 my-1' onSubmit={onSubmit}>
        <div className='flex items-center justify-center'>
          <div className='flex items-center'>
            <input
              className='w-full rounded-md bg-white p-1 text-center text-xs capitalize text-darkText outline outline-1 outline-black/40 duration-200 focus:shadow-sm dark:bg-black dark:text-lightText dark:outline-white/40 tabletSmall:text-sm desktop:w-14 desktop:text-sm desktopLarge:w-20'
              placeholder={`$ ${t('aside filter.from')}`}
              value={lowerPrice}
              {...register('lower_price')}
              onChange={handleChangeLowerPrice}
            />
          </div>

          <div className='m-2 text-darkText duration-200 dark:text-lightText'>-</div>

          <div className='flex items-center'>
            <input
              className='w-full rounded-md bg-white p-1 text-center text-xs capitalize text-darkText outline outline-1 outline-black/40 duration-200 focus:shadow-sm dark:bg-black dark:text-lightText dark:outline-white/40 tabletSmall:text-sm desktop:w-14 desktop:text-sm desktopLarge:w-20'
              placeholder={`$ ${t('aside filter.to')}`}
              value={upperPrice}
              {...register('upper_price')}
              onChange={handleChangeUpperPrice}
            />
          </div>
        </div>
        <div className='mt-1  text-center text-sm text-red-600'>{errors.lower_price?.message}</div>

        <div className='mt-2 flex items-center justify-center space-x-4'>
          <button
            disabled={notAllowApply}
            className={classNames(
              'mt-1 flex items-center justify-center rounded-md bg-white px-8 py-1 text-xs font-medium capitalize text-darkText outline outline-1 duration-200 dark:bg-[#101010] dark:text-lightText tabletSmall:text-sm desktop:text-sm desktopLarge:text-base',
              {
                'hover:text-primaryColor hover:outline-primaryColor dark:hover:text-primaryColor dark:hover:outline-primaryColor':
                  !notAllowApply,
                'cursor-not-allowed bg-opacity-30 text-opacity-30 dark:bg-opacity-50 dark:text-opacity-30':
                  notAllowApply
              }
            )}
            type='submit'
          >
            {t('aside filter.apply')}
          </button>
        </div>
      </form>
    </div>
  )
}
