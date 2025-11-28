import { useParams } from 'react-router-dom'
import { getIdFromNameId, showSuccessDialog } from 'src/utils/utils'
import { Fragment, useContext, useEffect, useState } from 'react'
import { AdminContext } from 'src/contexts/admin.context'
import productApi from 'src/apis/product.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import LoadingSection from 'src/components/LoadingSection'
import AdminSelectsVariant from '../../../components/AdminSelectsVariant'
import AdminProductInfor from '../../components/AdminProductInfor'
import { adminProductApi } from 'src/apis/admin.api'

import AdminDialog from '../../../components/AdminDialog'
import AdminProductUpdate from '../AdminProductUpdate'

export default function AdminProductDetail() {
  const { setProductGroup, currentProduct, setCurrentProduct, defaultProductIdList } = useContext(AdminContext)

  const isDefaultProduct = defaultProductIdList.includes(currentProduct?.id as string)

  //! DELCARE STATES
  const [editingMode, setEditingMode] = useState<boolean>(false)
  const [updateProductSuccess, setUpdateProductSuccess] = useState<boolean>(false)
  const [updateDefaultProductSuccess, setUpdateDefaultProductSuccess] = useState<boolean>(false)

  //! GET PRODUCT DETAIL
  const { nameId } = useParams()
  const productId = getIdFromNameId(nameId as string)
  const { data: productDetailData } = useQuery({
    queryKey: ['products', productId],
    queryFn: () => productApi.getProductDetail(productId as string)
  })
  const defaultProduct = productDetailData?.data.data

  useEffect(() => {
    if (defaultProduct) {
      setProductGroup(defaultProduct.group)
    }
  }, [defaultProduct, setProductGroup])

  useEffect(() => {
    if (defaultProduct) {
      setCurrentProduct(defaultProduct)
    }
  }, [defaultProduct, setCurrentProduct])

  //! BUTTON FUNCTIONS
  const turnOnEditingMode = () => {
    setEditingMode(true)
  }

  //! Set default product
  const queryClient = useQueryClient()
  const setDefaultProductMutation = useMutation({ mutationFn: adminProductApi.setDefaultProduct })

  const setDefaultProduct = () => {
    if (currentProduct) {
      setDefaultProductMutation.mutate(
        { id: currentProduct.id },
        {
          onSuccess: () => {
            showSuccessDialog(setUpdateDefaultProductSuccess)
            queryClient.invalidateQueries({ queryKey: ['products'] })
          }
        }
      )
    }
  }

  return (
    <Fragment>
      {!defaultProduct && <LoadingSection />}
      {defaultProduct && (
        <div className='space-y-6 pb-8'>
          <AdminSelectsVariant wrapperClassname='m-2 grid grid-cols-5 gap-4' />

          <div className='flex w-full items-center justify-between'>
            <button
              className='rounded-md bg-hoveringBg/80 px-6 py-2 hover:bg-hoveringBg disabled:opacity-40 disabled:hover:bg-hoveringBg/80'
              disabled={isDefaultProduct}
              onClick={setDefaultProduct}
            >
              Đặt làm sản phẩm mặc định
            </button>
            {!editingMode && (
              <button
                className='rounded-md bg-hoveringBg/80 px-6 py-2 hover:bg-hoveringBg disabled:opacity-40 disabled:hover:bg-haretaColor/80'
                disabled={currentProduct == null}
                onClick={turnOnEditingMode}
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {!editingMode && <AdminProductInfor />}

          {editingMode && (
            <AdminProductUpdate setEditingMode={setEditingMode} setSuccessDialogOpen={setUpdateProductSuccess} />
          )}
        </div>
      )}

      <AdminDialog
        isOpen={updateProductSuccess}
        setIsOpen={setUpdateProductSuccess}
        content='Cập nhật sản phẩm thành công'
      />

      <AdminDialog
        isOpen={updateDefaultProductSuccess}
        setIsOpen={setUpdateDefaultProductSuccess}
        content='Cập nhật sản phẩm mặc định thành công'
      />
    </Fragment>
  )
}
