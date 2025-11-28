import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Fragment, useContext, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import AdminEventInfo from '../AdminEventInfo'
import { getIdFromNameId } from 'src/utils/utils'
import eventApi from 'src/apis/event.api'
import LoadingSection from 'src/components/LoadingSection'
import AdminEventUpdate from '../AdminEventUpdate'
import AdminDialog from 'src/pages/AdminPages/components/AdminDialog'
import DialogPopup from 'src/components/DialogPopup'
import LoadingRing from 'src/components/LoadingRing'
import { adminPath } from 'src/constants/path'
import AdminEventProducts from '../AdminEventProducts'
import AdminEventProductCard from '../../components/AdminEventProductCard'
import { AppContext } from 'src/contexts/app.context'
import { eventQuery } from 'src/hooks/queries/useEventQuery'

export default function AdminEventDetail() {
  const { setLoadingPage } = useContext(AppContext)

  const { state } = useLocation()

  //! Use states
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateExcutingDialog, setUpdateExcutingDialog] = useState<boolean>(false)
  const [excuting, setExcuting] = useState<boolean>(false)
  const [deleteExcutingDialog, setDeleteExcutingDialog] = useState<boolean>(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const [undefinedError, setUndefinedError] = useState<boolean>(false)
  const [isAddingProduct, setIsAddingProduct] = useState(state && state.from == 'AdminEventCreate')
  const [removeProductSuccess, setRemoveProductSuccess] = useState(false)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const closeDeleteExcutingDialog = () => {
    setDeleteExcutingDialog(false)
    navigate({ pathname: adminPath.events })
  }

  //! Get event detail
  const { eventId: paramEventId } = useParams()
  const eventId = getIdFromNameId(paramEventId as string)
  //! Get event detail
  const { data: eventData } = eventQuery.useEventDetail(eventId)
  const eventDetail = eventData?.data.data
  const productList = eventDetail?.items || []

  //! Handlers
  const handleUpdate = () => {
    setIsUpdating(true)
    setIsAddingProduct(false)
  }
  const handleEdit = () => {
    setIsAddingProduct(true)
    setIsUpdating(false)
  }

  //! Styles
  const buttonStyle = 'py-2 px-6 text-darkText font-medium rounded-xl bg-unhoveringBg hover:bg-hoveringBg'

  //! Hanlde remove product
  const removeProductMutation = useMutation({ mutationFn: eventApi.removeProductFromEvent })
  const handleRemove = (productId: string) => () => {
    if (!eventId) return

    setLoadingPage(true)
    const body = {
      event_id: eventId,
      item_id: productId
    }
    removeProductMutation.mutate(body, {
      onSettled: () => {
        setLoadingPage(false)
      },
      onSuccess: () => {
        setRemoveProductSuccess(true)
        queryClient.invalidateQueries({ queryKey: ['events', 'detail', eventId] })
      },
      onError: (error) => {
        console.error(error)
      }
    })
  }

  return (
    <div className='relative space-y-4'>
      {!eventDetail && <LoadingSection />}
      {eventDetail && (
        <Fragment>
          <div className='flex items-center justify-around'>
            {!(isUpdating || isAddingProduct) && (
              <button onClick={handleUpdate} className={buttonStyle}>
                Chỉnh sửa
              </button>
            )}
          </div>
          {!isUpdating && <AdminEventInfo eventDetail={eventDetail} />}
          {!isUpdating && (
            <div className='space-y-4'>
              <div className='flex items-center justify-around'>
                <p className='text-center text-xl font-medium uppercase text-primaryColor desktop:text-2xl'>
                  Sản phẩm trong sự kiện
                </p>
                {!isAddingProduct && (
                  <button onClick={handleEdit} className={buttonStyle}>
                    Thêm / xóa sản phẩm
                  </button>
                )}
              </div>

              <div className='grid grid-cols-2 gap-2 bg-black p-4 tablet:grid-cols-3 tablet:gap-4 desktop:grid-cols-4 desktop:gap-8'>
                {productList.map((item) => (
                  <div key={item.item.id} className='col-span-1'>
                    <AdminEventProductCard
                      discount={eventDetail.discount}
                      product={item.item}
                      handleRemove={handleRemove}
                      isAddingProduct={isAddingProduct}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {isUpdating && (
            <AdminEventUpdate
              eventDetail={eventDetail}
              setIsUpdating={setIsUpdating}
              setUpdateSuccess={setUpdateSuccess}
              setExcuting={setExcuting}
              setInvalidFields={setInvalidFields}
              setUndefinedError={setUndefinedError}
              setUpdateExcutingDialog={setUpdateExcutingDialog}
              setDeleteExcutingDialog={setDeleteExcutingDialog}
            />
          )}
          {isAddingProduct && (
            <AdminEventProducts
              eventId={eventDetail.id}
              setIsAddingProduct={setIsAddingProduct}
              productsInEvents={productList.map((product) => product.item.id)}
            />
          )}
        </Fragment>
      )}

      <DialogPopup
        isOpen={updateExcutingDialog}
        handleClose={() => {
          setUpdateExcutingDialog(false)
        }}
      >
        {excuting && <LoadingRing />}
        {!excuting && (
          <Fragment>
            {updateSuccess && (
              <p className='text-center text-xl font-medium uppercase leading-6 text-successGreen'>
                Bài viết đã được cập nhật
              </p>
            )}
            {invalidFields.length > 0 && (
              <div className='space-y-2'>
                <p className='text-left text-lg font-medium uppercase leading-6 text-alertRed'>
                  Chỉnh sửa không thành công do các nội dung sau không hợp lệ:
                </p>
                <div className='flex flex-col items-start space-y-2'>
                  {invalidFields.map((field, index) => (
                    <span key={index} className=''>
                      - {field}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {undefinedError && (
              <p className='text-center text-xl font-medium uppercase leading-6 text-alertRed'>
                Đã có lỗi xảy ra, vui lòng thử lại
              </p>
            )}
          </Fragment>
        )}
      </DialogPopup>

      <DialogPopup isOpen={deleteExcutingDialog} handleClose={closeDeleteExcutingDialog}>
        {excuting && <LoadingRing />}
        {!excuting && (
          <p className='text-center text-xl font-medium uppercase leading-6 text-successGreen'>Đã xóa sự kiện</p>
        )}
      </DialogPopup>

      <AdminDialog
        isOpen={removeProductSuccess}
        setIsOpen={setRemoveProductSuccess}
        content='Đã xóa sản phẩm khỏi sự kiện'
      />
    </div>
  )
}
