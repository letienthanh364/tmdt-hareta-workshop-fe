import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { ProductType } from 'src/types/product.type'

interface Props {
  defaultProduct: ProductType
  productsInGroup: ProductType[]
  activeProductID: string
  handleChooseVariant: (item: ProductType) => () => void
}

export default function ProductDetailVariantList({
  defaultProduct,
  productsInGroup,
  activeProductID,
  handleChooseVariant
}: Props) {
  //! Multi languages
  const { t } = useTranslation('productdetail')

  return (
    <div className='mt-8 w-full rounded-lg border border-black/60 bg-lightColor900 px-4 py-2 dark:border-white/60 dark:bg-darkColor900 tablet:px-2 desktop:px-4'>
      <div className='flex items-center justify-between'>
        <p className='text-lg font-medium'>{t('sidebar.variant')}</p>
        <p className='text-base text-darkText/60 dark:text-lightText/60 '>
          {productsInGroup.length} {t('sidebar.variants')}
        </p>
      </div>
      <div className='mt-4 max-h-64 w-full overflow-auto rounded-lg border border-black/60 p-2 dark:border-white/60'>
        <div className='grid w-full grid-cols-3 gap-4 tablet:grid-cols-2 desktop:grid-cols-3'>
          {productsInGroup.map((item, index) => {
            const isActive = item.id === activeProductID
            const avatarURL = item.avatar ? item.avatar.url : null
            return (
              <div
                key={index}
                className={classNames('col-span-1 overflow-hidden rounded-xl outline', {
                  ' outline-primaryColor dark:outline-primaryColor': isActive,
                  ' outline-black/20 dark:outline-white/20': !isActive
                })}
              >
                <button className='relative w-full pt-[100%]' onClick={handleChooseVariant(item)}>
                  <img
                    src={avatarURL || ''}
                    alt={`${defaultProduct.name} ${item.color}`}
                    className='absolute left-0 top-0 h-full w-full object-scale-down'
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
