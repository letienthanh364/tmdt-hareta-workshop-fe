import * as yup from 'yup'
import Input from 'src/components/Input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosBadRequestError } from 'src/utils/utils'
import { ErrorRespone } from 'src/types/utils.type'
import { adminProductGroupApi } from 'src/apis/admin.api'
import { useContext } from 'react'
import { AdminContext } from 'src/contexts/admin.context'
import { ProductGroup } from 'src/types/product.type'
import { useNavigate } from 'react-router-dom'
import { adminPath } from 'src/constants/path'
import AdminProductCreateHeader from '../../components/AdminProductCreateHeader'
import { AppContext } from 'src/contexts/app.context'

interface FormData {
  name: string
}

const ProductGroupSchema = yup.object({
  name: yup.string().required('Name is required')
})

export default function AdminProductCreateGroup() {
  const { setLoadingPage } = useContext(AppContext)
  const { setProductGroup } = useContext(AdminContext)

  //? CREATE NEW GROUP
  const {
    handleSubmit,
    reset,
    setError,
    clearErrors,
    register,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(ProductGroupSchema)
  })

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createGroupMutation = useMutation({ mutationFn: adminProductGroupApi.createProductGroup })
  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoadingPage(true)
      const newGroupRespone = await createGroupMutation.mutateAsync({ ...data })
      const newGroup: ProductGroup = newGroupRespone.data.data
      setLoadingPage(false)
      setProductGroup(newGroup)
      reset()
      clearErrors()
      queryClient.invalidateQueries({ queryKey: ['product-groups'] })
      navigate(adminPath.createProduct)
    } catch (error) {
      if (isAxiosBadRequestError<ErrorRespone>(error)) {
        const formError = error.response?.data
        if (formError) {
          const responeLog = formError?.log as string
          if (responeLog.search(`'name'`) !== -1) {
            setError('name', {
              message: 'Name',
              type: 'Server'
            })
          }
        }
      }
    }
  })

  return (
    <div className='space-y-4'>
      <AdminProductCreateHeader />

      <div className='rounded-lg border border-white/40 p-4'>
        <div className='flex flex-col items-center justify-center'>
          <p className='text-lg font-semibold uppercase desktop:text-lg'>Tạo nhóm sản phẩm</p>
          <form className='mt-2' onSubmit={onSubmit}>
            <Input
              inputClassName='text-darkText bg-white py-1 px-2 text-base desktop:text-lg rounded-lg outline-none focus:outline-haretaColor'
              register={register}
              name='name'
              errorMessage={errors?.name?.message}
              autoComplete='false'
            />
            <div className='flex w-full items-center justify-end'>
              <button className='rounded-lg bg-unhoveringBg px-4 py-1 text-base hover:bg-hoveringBg desktop:text-lg'>
                Tạo nhóm mới
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
