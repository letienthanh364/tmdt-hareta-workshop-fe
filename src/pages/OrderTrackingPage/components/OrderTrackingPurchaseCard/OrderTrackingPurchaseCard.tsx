import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { Purchase } from 'src/types/cart.type'

interface Props {
  purchase: Purchase
}

export default function OrderTrackingPurchaseCard({ purchase }: Props) {
  const avatarURL = purchase.item.avatar ? purchase.item.avatar.url : null

  //! Multi languages
  const { t } = useTranslation('support')

  return (
    <div className='col-span-1 grid grid-cols-3 bg-lightColor700 p-2 text-sm font-medium text-darkText dark:bg-darkColor700 dark:text-lightText desktop:p-4'>
      <div className='col-span-1'>
        <div className='relative w-full overflow-hidden bg-white pt-[100%] dark:bg-black'>
          {avatarURL ? (
            <img
              src={avatarURL}
              alt={purchase.item.name}
              className='absolute left-0 top-0 h-full w-full object-cover'
            />
          ) : (
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className='absolute left-0 top-0 h-full w-full object-cover'
            />
          )}
        </div>
      </div>
      <div className='col-span-2 flex h-full flex-col justify-between pl-4 desktop:pl-6'>
        <div className='flex flex-col space-y-1 mobileLarge:space-y-2 tablet:space-y-1 desktop:space-y-2'>
          <p className='w-full text-sm font-bold mobileLarge:text-base tabletLarge:text-xl desktop:text-2xl'>
            {purchase.item.name}
          </p>
          <p className='w-full text-xs capitalize opacity-80 mobileLarge:text-sm tabletLarge:text-base desktop:text-lg'>
            {purchase.item.color}
          </p>

          <div className='flex space-x-2 text-xs mobileLarge:text-sm tabletLarge:text-base desktop:text-lg'>
            <span className=''>{t('order information.Quantity')}:</span>
            <span className='text-right font-semibold lowercase'>{purchase.quantity}</span>
          </div>
        </div>

        <div className='w-full text-sm font-semibold text-haretaColor mobileLarge:text-base tabletLarge:text-lg desktop:text-xl'>
          ${purchase.item.price * purchase.quantity}
        </div>
      </div>
    </div>
  )
}
