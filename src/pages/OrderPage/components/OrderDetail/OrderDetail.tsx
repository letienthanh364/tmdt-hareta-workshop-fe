import { FloatingPortal } from '@floating-ui/react'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useContext, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import DialogPopup from 'src/components/DialogPopup'
import mainPath, { orderPath } from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { OrderContext } from 'src/contexts/order.context'
import { OrderSchema } from 'src/utils/rules'
import OrderPurchaseList from '../OrderPurchaseList'

export default function OrderDetail() {
  const {
    addressCountry,
    addressState,
    addressCity,
    setNoneCountry,
    setNoneState,
    setNoneCity,
    confirmPayment,
    setConfirmPayment,
    orderList,
    tempOrderList
  } = useContext(OrderContext)
  const { theme, isAuthenticated } = useContext(AppContext)

  const [invalidForm, setInvalidForm] = useState<boolean>(false)
  const [confirmError, setConfirmError] = useState<boolean>(false)

  const { watch } = useFormContext<OrderSchema>()

  //! CHECK VALID
  const name = watch('name')
  const phone = watch('phone')
  const email = watch('email')
  const address = watch('address')
  const validForm = () => {
    if (
      name === '' ||
      phone === '' ||
      email === '' ||
      address === '' ||
      addressCountry === null ||
      addressState === null ||
      addressCity === null ||
      !confirmPayment
    ) {
      return false
    }
    return true
  }
  const lackingInformation =
    name === '' ||
    phone === '' ||
    email === '' ||
    address === '' ||
    addressCountry === null ||
    addressState === null ||
    addressCity === null

  //! HANDLE INVALID FORM
  const navigate = useNavigate()
  const invalidButton = () => {
    if (lackingInformation) {
      navigate(orderPath.checkout)
      if (!addressCountry) {
        setNoneCountry(true)
      }
      if (!addressState) {
        setNoneState(true)
      }
      if (!addressCity) {
        setNoneCity(true)
      }
    }
    if (!confirmPayment) {
      setConfirmError(true)
    }
    setInvalidForm(true)
  }
  useEffect(() => {
    if (confirmPayment) setConfirmError(false)
  }, [confirmPayment])

  //! HANDLE CLEAR ERRORS
  useEffect(() => {
    if (addressState) {
      setNoneState(false)
    }
  }, [addressState, setNoneState])

  //! Multi languages
  const { t } = useTranslation('order')

  //! Purchase list
  const purchaseList = isAuthenticated ? orderList : tempOrderList

  return (
    <div className='rounded-xl p-3 desktop:p-4'>
      <p className='text-center text-2xl font-semibold uppercase desktopLarge:text-3xl'>{t('layout.Order')}</p>
      <div className='space-y-2 py-2 text-base desktop:text-lg'>
        <div className='flex items-center justify-between font-medium'>
          <span className=''>{watch('name')}</span>
          <span className=''>{watch('phone')}</span>
        </div>
        <div className='flex items-center justify-between overflow-hidden'>{watch('email')}</div>
        <p className='inline-block space-x-2'>
          <span
            className={classNames('', {
              'italic text-alertRed': watch('address') == ''
            })}
          >
            {watch('address') == '' ? t('bill.Address line') : watch('address')} -
          </span>
          <span
            className={classNames('', {
              'italic text-alertRed': !addressCity
            })}
          >
            {addressCity?.name || t('bill.City')} -
          </span>
          <span
            className={classNames('', {
              'italic text-alertRed': !addressState
            })}
          >
            {addressState?.name || t('bill.State / Province')} -
          </span>

          <span className=''>{addressCountry?.name}</span>
        </p>
      </div>
      <div className='my-4 w-full border-t border-black/80 dark:border-white/80'></div>
      {<OrderPurchaseList purchaseList={purchaseList} />}
      <div className='mt-4 flex items-center space-x-2 font-medium'>
        <input
          name='confirm'
          type='checkbox'
          className={classNames('h-5 w-5 rounded-md accent-primaryColor dark:accent-primaryColor', {
            ' outline outline-alertRed': confirmError
          })}
          checked={confirmPayment}
          onChange={() => setConfirmPayment(!confirmPayment)}
        />
        <p
          className={classNames('', {
            'text-darkText dark:text-lightText': !confirmError,
            'text-alertRed': confirmError
          })}
        >
          {t('layout.By clicking, you accept our')}{' '}
          <Link
            state={{ from: 'order' }}
            to={mainPath.privacyAndTerms}
            className='font-medium text-haretaColor hover:text-primaryColor'
          >
            {t('layout.payment policy')}
          </Link>{' '}
        </p>
      </div>

      {!validForm() && (
        <button
          type={confirmPayment ? 'submit' : 'button'}
          className='mt-4 flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-haretaColor py-3 text-xl font-bold  uppercase text-black opacity-20 desktopLarge:py-4 desktopLarge:text-2xl'
          onClick={invalidButton}
        >
          {t('layout.Confirm order')}
        </button>
      )}
      {validForm() && (
        <button
          disabled={!confirmPayment}
          className={classNames({
            // 'mt-4 flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-vintageColor/80 py-3 text-xl font-bold  uppercase text-black opacity-20 dark:bg-haretaColor/80 dark:text-white desktopLarge:py-4 desktopLarge:text-2xl':
            //   lackingInformation,
            'mt-4 flex w-full cursor-pointer items-center justify-center rounded-xl bg-haretaColor py-3 text-xl font-bold uppercase text-darkText hover:bg-primaryColor desktopLarge:py-4 desktopLarge:text-2xl':
              !lackingInformation
          })}
          type='submit'
        >
          {t('layout.Confirm order')}
        </button>
      )}
      <FloatingPortal>
        <DialogPopup
          isOpen={invalidForm}
          handleClose={() => setInvalidForm(false)}
          classNameWrapper='relative w-md max-w-lg transform overflow-hidden rounded-2xl py-6 px-4 align-middle shadow-xl transition-all'
        >
          <div className='text-center'>
            <FontAwesomeIcon
              icon={faXmark}
              className={classNames('h-10 w-10 rounded-full p-4 text-center text-alertRed tablet:h-16 tablet:w-16', {
                'bg-black/20': theme == 'light',
                'bg-white/20': theme == 'dark'
              })}
            />
          </div>
          <p className='my-6 text-lg font-bold uppercase leading-6 tablet:text-xl desktopLarge:text-2xl'>
            {t('layout.YOUR ORDER WAS DENIDED')}
          </p>
          {lackingInformation && (
            <p className='mt-2 text-center text-sm font-semibold leading-6 tablet:text-base desktopLarge:text-lg'>
              - {t('layout.You must fullfilled your')}
              <span className='text-haretaColor'> {t('layout.order information')}</span>
            </p>
          )}
          {!confirmPayment && (
            <p className='mt-2 text-center text-sm font-semibold leading-6 tablet:text-base desktopLarge:text-lg'>
              - {t('layout.You must accept with the')}
              <span className='text-haretaColor'> {t('layout.payment policy')}</span>
            </p>
          )}
        </DialogPopup>
      </FloatingPortal>
    </div>
  )
}
