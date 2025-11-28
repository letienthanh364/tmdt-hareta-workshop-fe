import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Fragment, useContext, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import mainPath from 'src/constants/path'
import { generateNameId, showSuccessDialog } from 'src/utils/utils'
import purchaseApi from 'src/apis/cart.api'
import classNames from 'classnames'
import omit from 'lodash/omit'
import useProductListQueryConfig from 'src/hooks/useProductListQueryConfig'
import { useViewport } from 'src/hooks/useViewport'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from 'src/contexts/app.context'

//? IMPORT COMPONENTS
import UnlikeItemDialog from '../../components/UserUnlikeProductDialog'
import DialogPopup from 'src/components/DialogPopup'
import { useTranslation } from 'react-i18next'
import userLikeProductApi from 'src/apis/userLikeProduct.api'
import UserWishlistCardDesktop from '../../components/UserWishlistCardDesktop'
import UserWishlistCardMobile from '../../components/UserWishlistCardMobile'
import { ProductType } from 'src/types/product.type'

export interface Attribute {
  name: string
  onClick: () => void
}

export default function UserWishList() {
  const { theme, isAuthenticated } = useContext(AppContext)

  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false)
  const [unlikeDialog, setUnlikeDialog] = useState<boolean>(false)
  const [unlikedItemId, setUnlikeItemId] = useState<string>('')

  const viewPort = useViewport()
  const isMobile = viewPort.width <= 768

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: favouriteListData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => {
      return userLikeProductApi.getWishList()
    },
    enabled: isAuthenticated
  })
  const favouriteList = favouriteListData?.data.data as ProductType[]

  const handleClickItem = (product: ProductType) => () => {
    navigate({ pathname: `${mainPath.store}/${generateNameId({ name: product.name, id: product.id })}` })
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  const addToCartMutation = useMutation({ mutationFn: purchaseApi.addToCart })
  const addToCart = (id: string) => () => {
    addToCartMutation.mutate(
      { item_id: id, quantity: 1 },
      {
        onSuccess: () => {
          showSuccessDialog(setDialogIsOpen)
          queryClient.invalidateQueries({ queryKey: ['purchases'] })
        }
      }
    )
  }

  const openUnlikeItemDialog = (id: string) => () => {
    setUnlikeItemId(id)
    setUnlikeDialog(true)
  }

  //? CHOOSE FILTER
  const queryConfig = useProductListQueryConfig()
  const handleChooseFilter = (field: string, value: string) => () => {
    let searchParams = createSearchParams({
      ...queryConfig
    })
    if (field === 'category') {
      searchParams = createSearchParams(
        omit(
          {
            ...queryConfig,
            category: value
          },
          ['collection', 'type', 'page', 'limit']
        )
      )
    } else if (field === 'collection') {
      searchParams = createSearchParams(
        omit(
          {
            ...queryConfig,
            collection: value
          },
          ['category', 'type', 'page', 'limit']
        )
      )
    } else if (field === 'type') {
      searchParams = createSearchParams(
        omit(
          {
            ...queryConfig,
            type: value
          },
          ['category', 'collection', 'page', 'limit']
        )
      )
    }

    navigate({
      pathname: mainPath.store,
      search: searchParams.toString()
    })
  }

  //! Multi languages
  const { t } = useTranslation('user')

  return (
    <Fragment>
      <div className='m-4 h-[calc(100vh-128px)] overflow-y-auto rounded-sm desktop:my-4 '>
        {favouriteList?.map((product) => (
          <div
            key={product.id}
            className='mt-4 rounded-lg border border-black/40 bg-lightColor900 px-2 first:mt-0 hover:bg-lightBg dark:border-white/40 dark:bg-darkColor900 dark:hover:bg-darkBg tablet:px-3 desktop:px-4 '
          >
            {!isMobile && (
              <UserWishlistCardDesktop
                product={product}
                handleClickItem={handleClickItem}
                handleChooseFilter={handleChooseFilter}
                addToCart={addToCart}
                openUnlikeItemDialog={openUnlikeItemDialog}
              />
            )}
            {isMobile && (
              <UserWishlistCardMobile
                product={product}
                handleClickItem={handleClickItem}
                handleChooseFilter={handleChooseFilter}
                addToCart={addToCart}
                openUnlikeItemDialog={openUnlikeItemDialog}
              />
            )}
            <UnlikeItemDialog
              isOpen={unlikeDialog}
              handleClose={() => setUnlikeDialog(false)}
              classNameWrapper='relative w-96 max-w-md transform overflow-hidden rounded-2xl p-6 align-middle shadow-sm transition-all'
              unlikeItemId={unlikedItemId}
              setUnlikeItemId={setUnlikeItemId}
            />
          </div>
        ))}
      </div>
      <DialogPopup
        isOpen={dialogIsOpen}
        handleClose={() => setDialogIsOpen(false)}
        classNameWrapper='relative w-72 max-w-md transform overflow-hidden rounded-2xl p-6 align-middle shadow-xl transition-all bg-black/90'
      >
        <div className=' text-center'>
          <FontAwesomeIcon
            icon={faCheck}
            fontSize={36}
            className={classNames('rounded-full  p-4 text-center text-successGreen ', {
              'bg-black/20': theme === 'light',
              'bg-white/20': theme === 'dark'
            })}
          />
        </div>
        <p className='mt-6 text-center text-xl font-medium leading-6'>{t('wishlist.message')}</p>
      </DialogPopup>
    </Fragment>
  )
}
