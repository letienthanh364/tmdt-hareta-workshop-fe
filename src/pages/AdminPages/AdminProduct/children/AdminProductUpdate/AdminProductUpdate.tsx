import { Dispatch, Fragment, SetStateAction, useContext, useEffect } from 'react'
import { AdminContext } from 'src/contexts/admin.context'
import { AppContext } from 'src/contexts/app.context'
import { ErrorRespone, NoUndefinedField } from 'src/types/utils.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import { adminProductApi } from 'src/apis/admin.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { isAxiosBadRequestError, showSuccessDialog } from 'src/utils/utils'
import LoadingRing from 'src/components/LoadingRing'
import AdminProductUpdateForm from '../../components/AdminProductUpdateForm'
import { UpdateProductSchema, updateProductSchema } from 'src/rules/adminproduct.rule'

type FormData = NoUndefinedField<UpdateProductSchema>

interface Props {
  setEditingMode: Dispatch<SetStateAction<boolean>>
  setSuccessDialogOpen: Dispatch<SetStateAction<boolean>>
}

export default function AdminProductUpdate({ setEditingMode, setSuccessDialogOpen }: Props) {
  //! USE CONTEXT
  const { setLoadingPage } = useContext(AppContext)
  const { currentProduct } = useContext(AdminContext)

  //! GET CURRENT PRODUCT DETAIL
  const productId = currentProduct?.id
  const { data: productDetailData } = useQuery({
    queryKey: ['products', productId],
    queryFn: () => productApi.getProductDetail(productId as string),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(currentProduct)
  })
  const productDetail = productDetailData?.data.data

  //! EDIT PRODUCT
  const methods = useForm<FormData>({
    defaultValues: {
      id: '',
      name: '',
      avatar_url: '',
      category: '',
      collection: '',
      type: '',
      color: '',
      product_line: '',
      description: '',
      price: 0,
      quantity: 0,
      discount: 0,
      tag: 0,
      like_count: 0,
      sold: 0,
      cron_status: 0
    },
    resolver: yupResolver(updateProductSchema)
  })
  const { handleSubmit, setValue, reset } = methods

  useEffect(() => {
    if (productDetail) {
      setValue('id', productDetail.id)
      setValue('name', productDetail.name)
      setValue('category', productDetail.category)
      setValue('collection', productDetail.collection)
      setValue('type', productDetail.type)
      setValue('color', productDetail.color)
      setValue('product_line', productDetail.product_line)
      setValue('description', productDetail.description)
      setValue('original_price', productDetail.original_price)
      setValue('price', productDetail.price)
      setValue('quantity', productDetail.quantity)
      setValue('discount', productDetail.discount)
      setValue('tag', productDetail.tag)
      setValue('like_count', productDetail.like_count)
      setValue('cron_status', productDetail.cron_status)
    }
  }, [productDetail, setValue])

  //:: Handle edit
  const queryClient = useQueryClient()
  const editProductMutation = useMutation({ mutationFn: adminProductApi.updateProduct })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInvalid = (errors: any) => console.error(errors)
  const onSubmit = async (data: FormData) => {
    setLoadingPage(true)
    editProductMutation.mutate(
      { ...data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] })
          reset()
          showSuccessDialog(setSuccessDialogOpen, 2000)
        },
        onError: (error) => {
          console.log(error)
          if (isAxiosBadRequestError<ErrorRespone>(error)) {
            const formError = error.response?.data
            if (formError) {
              console.error(formError)
            }
          }
        },
        onSettled: () => {
          setLoadingPage(false)
          setEditingMode(false)
        }
      }
    )
  }

  return (
    <Fragment>
      <div className='flex min-h-[240px] w-full items-center justify-center overflow-hidden rounded-lg border border-white/40 p-4'>
        {!productDetail && <LoadingRing />}
        {productDetail && (
          <FormProvider {...methods}>
            <form className='relative w-full' onSubmit={handleSubmit(onSubmit, onInvalid)}>
              <AdminProductUpdateForm productDetail={productDetail} />

              <div className='fixed bottom-2 left-0 z-10 w-full text-darkText'>
                <div className='container '>
                  <div className='flex w-full items-center justify-between space-x-2 rounded-lg border border-white/60 bg-black/80'>
                    <div className='shrink-0 rounded-lg bg-haretaColor px-4 py-2 text-lg font-semibold'>
                      Đang chỉnh sửa
                    </div>
                    <div className=' flex w-full justify-end space-x-8 px-4 font-medium'>
                      <button
                        type='button'
                        className='rounded-md bg-alertRed/80 px-4 py-1  hover:bg-alertRed'
                        onClick={() => setEditingMode(false)}
                      >
                        Hủy chỉnh sửa
                      </button>

                      <button type='submit' className='rounded-md bg-primaryBlue/80 px-4 py-1  hover:bg-primaryBlue'>
                        Cập nhật
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        )}
      </div>
    </Fragment>
  )
}
