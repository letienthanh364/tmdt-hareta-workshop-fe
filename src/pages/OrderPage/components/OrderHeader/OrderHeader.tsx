import classNames from 'classnames'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import orderScreens from 'src/constants/orderScreens'
import { OrderContext } from 'src/contexts/order.context'

export default function OrderHeader() {
  const { screen, setScreen } = useContext(OrderContext)
  //! Multi languages
  const { t } = useTranslation('order')

  //! Handle change screen
  const changeScreen = (screen: string) => () => {
    setScreen(screen)
  }

  return (
    <div className='rounded-lg border border-black/40 bg-white text-darkText dark:border-white/40 dark:bg-black dark:text-lightText'>
      <div className='relative grid grid-cols-2'>
        <div className='absolute left-1/2 h-full border-l border-black/40 duration-200 dark:border-white/40'></div>
        <div className='col-span-1'>
          <button
            type='button'
            onClick={changeScreen(orderScreens.shipping)}
            className={classNames('flex w-full items-center justify-center py-2 font-medium uppercase', {
              'text-primaryColor dark:text-primaryColor': screen == orderScreens.shipping,
              'hover:text-primaryColor dark:hover:text-primaryColor': screen != orderScreens.shipping
            })}
          >
            {t('layout.Shipping information')}
          </button>
        </div>
        <div className='col-span-1'>
          <button
            type='button'
            onClick={changeScreen(orderScreens.payment)}
            className={classNames('flex w-full items-center justify-center py-2 font-medium uppercase', {
              'text-primaryColor dark:text-primaryColor': screen == orderScreens.payment,
              'hover:text-primaryColor dark:hover:text-primaryColor': screen != orderScreens.payment
            })}
          >
            {t('layout.Payment')}
          </button>
        </div>
      </div>
    </div>
  )
}
