import { useContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminProductApi } from 'src/apis/admin.api'
import { isAxiosBadRequestError } from 'src/utils/utils'
import { AdminContext } from 'src/contexts/admin.context'
import { ProductType } from 'src/types/product.type'
import { useNavigate } from 'react-router-dom'
import { adminPath } from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { ErrorRespone } from 'src/types/utils.type'
import productApi from 'src/apis/product.api'
import { CreateProductSchema, createProductSchema } from 'src/rules/adminproduct.rule'
import AdminProductCreateHeader from 'src/pages/AdminPages/AdminProduct/components/AdminProductCreateHeader'
import AdminSelectProductGroup from 'src/pages/AdminPages/components/AdminSelectProductGroup'
import AdminProductCreateForm from '../../components/AdminProductCreateForm'

type FormData = CreateProductSchema

export default function AdminProductCreate() {
  const { setLoadingPage } = useContext(AppContext)
  const { productGroup, setCurrentProduct } = useContext(AdminContext)

  //! Get product in group
  const { data: productsInGroupData } = useQuery({
    queryKey: ['product-groups', productGroup?.id],
    queryFn: () =>
      productApi.getProductsInGroup({
        id: productGroup?.id as string,
        page: '1',
        limit: '50'
      }),
    enabled: Boolean(productGroup),
    staleTime: 1000 * 60 * 3
  })
  const productsInGroup = productsInGroupData?.data.data || []

  //! CREATE NEW ITEM
  const methods = useForm<FormData>({
    defaultValues: {
      name: '',
      group_id: '',
      category: '',
      original_price: 0,
      price: 0,
      description: '',
      collection: '',
      type: '',
      quantity: 1,
      product_line: '',
      color: ''
    },
    resolver: yupResolver(createProductSchema)
  })
  const { handleSubmit } = methods

  const createNewProductMutation = useMutation({ mutationFn: adminProductApi.createNewProduct })
  const setDefaultProductMutation = useMutation({ mutationFn: adminProductApi.setDefaultProduct })

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInvalid = (errors: any) => console.error(errors)
  const onSubmit = async (data: FormData) => {
    setLoadingPage(true)

    try {
      const newProductRespone = await createNewProductMutation.mutateAsync({ ...data })
      const newItem: ProductType = newProductRespone.data.data
      setCurrentProduct(newItem)
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product-groups', productGroup?.id] })
      queryClient.invalidateQueries({ queryKey: ['product-groups'] })
      if (productsInGroup.length == 0) {
        setDefaultProductMutation.mutate({ id: newItem.id })
      }
      navigate(adminPath.uploadProductAvatar)
    } catch (error) {
      console.log(error)
      if (isAxiosBadRequestError<ErrorRespone>(error)) {
        const formError = error.response?.data
        if (formError) {
          console.error(formError)
        }
      }
    }

    setLoadingPage(false)
  }

  return (
    <div className='space-y-4'>
      <AdminProductCreateHeader />

      <AdminSelectProductGroup largeScreen />

      <div className='rounded-lg border border-white/40 p-4'>
        <FormProvider {...methods}>
          <form className='relative space-y-4 overflow-hidden ' onSubmit={handleSubmit(onSubmit, onInvalid)}>
            {!productGroup && <div className='absolute inset-0 z-10 bg-black/50'></div>}

            <AdminProductCreateForm />
            <div className='col-span-1 mt-2 flex items-center justify-end'>
              <button
                className='rounded-lg bg-unhoveringBg px-4 py-1 text-base hover:bg-hoveringBg desktop:text-lg'
                type='submit'
              >
                Tạo sản phẩm
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
