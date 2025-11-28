import { Fragment, useContext, useEffect, useState } from 'react'
import { AdminContext } from 'src/contexts/admin.context'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderApi } from 'src/apis/order.api'
import { formatDate, isAxiosBadRequestError } from 'src/utils/utils'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import InputNumber from 'src/components/InputNumber'
import classNames from 'classnames'
import { AppContext } from 'src/contexts/app.context'
import { ErrorRespone } from 'src/types/utils.type'
import { adminOrderApi } from 'src/apis/admin.api'
import Input from 'src/components/Input'
import AdminDialog from '../../../components/AdminDialog'
import LoadingSection from 'src/components/LoadingSection'

const updateOrderSchema = yup.object({
  id: yup.string().required('Order ID is required'),
  status: yup
    .number()
    .typeError('Phải là số')
    .required('Yêu cầu điền vào đây')
    .min(0, 'Chỉ có thể có giá trị từ 1 đến 4')
    .max(4, 'Chỉ có thể có giá trị từ 1 đến 4')
})
type UpdateOrderSchema = yup.InferType<typeof updateOrderSchema>

export default function AdminOrderDetail() {
  const { orderID } = useContext(AdminContext)
  const { setLoadingPage } = useContext(AppContext)

  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false)

  const choosingOrder = orderID != ''
  //! get order informtaion
  const { data: orderData } = useQuery({
    queryKey: ['orders', orderID],
    queryFn: () => {
      return orderApi.findOrderForAdmin(orderID)
    },

    enabled: choosingOrder
  })
  const orderDetail = orderData?.data.data

  //! UPDATE ORDER FORM
  const {
    handleSubmit,
    setValue,
    register,
    clearErrors,
    formState: { errors },
    control
  } = useForm<UpdateOrderSchema>({
    defaultValues: {
      id: orderID,
      status: orderDetail?.status
    },
    resolver: yupResolver(updateOrderSchema)
  })

  useEffect(() => {
    if (orderDetail) {
      setValue('id', orderDetail.id)
      setValue('status', orderDetail.status)
      clearErrors()
    }
  }, [clearErrors, orderDetail, setValue, orderID])

  //! HANDLE SUBMIT FORM
  const queryClient = useQueryClient()
  const updateOrderMutation = useMutation({ mutationFn: adminOrderApi.updateOrder })
  const onSubmit = handleSubmit(async (data) => {
    setLoadingPage(true)
    try {
      await updateOrderMutation.mutateAsync({ id: orderID, status: data.status })
      setLoadingPage(false)
      setSuccessDialogOpen(true)
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    } catch (error) {
      setLoadingPage(false)
      console.error(error)
      if (isAxiosBadRequestError<ErrorRespone>(error)) {
        const formError = error.response?.data
        if (formError) {
          console.error(formError)
        }
      }
    }
  })

  return (
    <div className='min-h-40'>
      {!choosingOrder && (
        <div className='flex h-40 w-full items-center justify-center text-center font-semibold uppercase tablet:text-lg desktopLarge:text-xl'>
          Chọn 1 đơn hàng
        </div>
      )}
      {choosingOrder && (
        <Fragment>
          {!orderDetail && <LoadingSection />}
          {orderDetail && (
            <div className='space-y-6'>
              <div className=' flex w-full flex-col space-y-2 px-3 py-2'>
                <div className='grid grid-cols-3 gap-2'>
                  <div className='col-span-1'>Giá trị:</div>
                  <div className='col-span-2 font-medium'>${orderDetail.total}</div>
                </div>
                <div className='grid grid-cols-3 gap-2'>
                  <div className='col-span-1'>Khách hàng:</div>
                  <div className='col-span-2 font-medium'>{orderDetail.name}</div>
                </div>
                <div className='grid grid-cols-3 gap-2'>
                  <div className='col-span-1'>Email:</div>
                  <div className='col-span-2 font-medium text-haretaColor'>{orderDetail.email}</div>
                </div>
                <div className='grid grid-cols-3 gap-2'>
                  <div className='col-span-1'>SĐT:</div>
                  <div className='col-span-2 font-medium text-haretaColor'>{orderDetail.phone}</div>
                </div>
                <div className='grid grid-cols-3 gap-2'>
                  <div className='col-span-1'>Địa chỉ:</div>
                  <div className='col-span-2 font-medium'>{orderDetail.address}</div>
                </div>

                <div className='grid grid-cols-3 gap-2'>
                  <div className='col-span-1'>Ngày tạo:</div>
                  <div className='col-span-2 font-medium'>{formatDate(orderDetail.created_at)}</div>
                </div>
                <div className='grid grid-cols-3 gap-2'>
                  <div className='col-span-1'>Cập nhật:</div>
                  <div className='col-span-2 font-medium'>{formatDate(orderDetail.updated_at)}</div>
                </div>
              </div>

              <form className='relative rounded-md border border-white/40 px-3 py-2' onSubmit={onSubmit}>
                <div className='grid grid-cols-3 items-center gap-2'>
                  <p className='col-span-1 items-center uppercase text-primaryBlue'>mã đơn hàng:</p>
                  <div className='col-span-2 text-haretaColor'>
                    <Input
                      readOnly
                      className=''
                      inputClassName={classNames(
                        'text-haretaColor focus:outline-none bg-transparent cursor-not-allowed bg-slate-900 py-1 px-2 text-base desktop:text-lg rounded-lg',
                        {
                          'outline-alertRed': Boolean(errors.id)
                        }
                      )}
                      errorClassName='hidden'
                      register={register}
                      name='id'
                      autoComplete='false'
                    />
                  </div>
                </div>
                <div className='mt-2 grid grid-cols-3 items-center gap-2'>
                  <div className='col-span-1 items-center uppercase text-primaryBlue'>Tình trạng:</div>
                  <div className='col-span-2 items-center font-semibold'>
                    <Controller
                      control={control}
                      name='status'
                      render={({ field }) => (
                        <InputNumber
                          inputClassName={classNames(
                            'text-haretaColor bg-slate-900 py-1 px-2 text-base rounded-lg outline outline-1 outline-haretaColor/40 focus:outline-haretaColor desktop:text-lg',
                            {
                              'outline-alertRed': Boolean(errors.status)
                            }
                          )}
                          errorClassName='hidden'
                          autoComplete='false'
                          {...field}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='mt-1 grid grid-cols-3 items-center gap-2'>
                  <div className='col-span-1 items-center uppercase'></div>
                  <div className='col-span-2 items-center font-semibold'>
                    <div className='min-h-[1.25rem] text-sm text-red-600'>{errors.status?.message}</div>
                  </div>
                </div>
                <div className='flex w-full items-center justify-end'>
                  <button className='hover:bg-hoveringBg0 rounded-lg bg-unhoveringBg px-2 py-1 text-sm font-medium uppercase text-darkText'>
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          )}
        </Fragment>
      )}
      <AdminDialog isOpen={successDialogOpen} setIsOpen={setSuccessDialogOpen} />
    </div>
  )
}
