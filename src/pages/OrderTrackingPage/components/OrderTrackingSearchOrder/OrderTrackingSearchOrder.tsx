import { Dispatch, SetStateAction, useContext } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { orderApi } from 'src/apis/order.api'
import { AppContext } from 'src/contexts/app.context'
import * as yup from 'yup'
import { formatDate, generateNameId, isAxiosBadRequestError } from 'src/utils/utils'
import mainPath from 'src/constants/path'
import { ErrorRespone } from 'src/types/utils.type'
import { HttpStatusMessage } from 'src/constants/httpStatusMessage'
import OrderTrackingSearchInput from '../OrderTrackingSearchInput'
import { reject } from 'lodash'

const orderSchema = yup.object({
  orderId: yup.string().trim().required('ID is required')
})

type OrderSchema = yup.InferType<typeof orderSchema>

interface Props {
  setFinding: Dispatch<SetStateAction<boolean>>
  setCantFind: Dispatch<SetStateAction<boolean>>
}

export default function OrderTrackingSearchOrder({ setFinding, setCantFind }: Props) {
  const { isAuthenticated } = useContext(AppContext)

  //! Find order
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<OrderSchema>({
    defaultValues: {
      orderId: ''
    },
    resolver: yupResolver(orderSchema)
  })
  const findOrderMutation = useMutation({
    mutationFn: isAuthenticated ? orderApi.findOrderForUser : orderApi.findOrderForGuest
  })
  const navigate = useNavigate()
  const handleSearch = handleSubmit((data) => {
    setFinding(true)
    findOrderMutation.mutate(data.orderId, {
      onSuccess: (respone) => {
        setFinding(false)
        const order = respone.data.data
        navigate({
          pathname: `${mainPath.orderTracking}/${generateNameId({ name: formatDate(order.created_at), id: order.id })}`
        })
      },
      onError: (error) => {
        setFinding(false)
        if (isAxiosBadRequestError<ErrorRespone>(error)) {
          const formError = error.response?.data
          if (formError) {
            const errorMessage = HttpStatusMessage.get(formError.error_key)
            if (errorMessage == 'ErrInvalidRequest') {
              setError('orderId', {
                message: 'Order ID is invalid',
                type: 'Server'
              })
              reject(error)
            }
            if (errorMessage == 'ErrCannotGetOrder') {
              setCantFind(true)
            }
          }
        }
      }
    })
  })

  return (
    <form className='tablet:px-20 desktopLarge:px-40' onSubmit={handleSearch} noValidate>
      <OrderTrackingSearchInput
        name='orderId'
        register={register}
        type='text'
        required
        errorMessage={errors.orderId?.message}
      />
    </form>
  )
}
