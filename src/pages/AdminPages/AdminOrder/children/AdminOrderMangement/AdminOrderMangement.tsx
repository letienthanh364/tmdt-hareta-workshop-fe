import AdminOrderList from '../../components/AdminOrderList'
import AdminOrderDetail from '../../components/AdminOrderDetail'
import useOrderListQueryConfig from 'src/hooks/queryConfigs/useOrderListQueryConfig'
import { orderQuery } from 'src/hooks/queries/useOrderQuery'
import LoadingSection from 'src/components/LoadingSection'
import SearchBar from 'src/components/SearchBar'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { adminPath } from 'src/constants/path'
import { omit } from 'lodash'
import { useContext } from 'react'
import { AdminContext } from 'src/contexts/admin.context'

export default function AdminOrderMangement() {
  const { setOrderID, orderID } = useContext(AdminContext)

  //! get order list
  const orderListConfig = useOrderListQueryConfig()
  const { email } = orderListConfig

  const { data: orderListData } = orderQuery.useGetOrderList(orderListConfig)

  //! Search order by email
  const navigate = useNavigate()
  const handleSearchEmail = (email: string) => {
    const config =
      email === ''
        ? omit(
            {
              ...orderListConfig
            },
            ['email', 'page', 'limit']
          )
        : omit(
            {
              ...orderListConfig,
              email: email
            },
            ['page', 'limit']
          )
    navigate({
      pathname: adminPath.orders,
      search: createSearchParams(config).toString()
    })
  }

  const handleClearSearchEmail = () => {
    navigate({
      pathname: adminPath.orders,
      search: createSearchParams(
        omit(
          {
            ...orderListConfig
          },
          ['email', 'page', 'limit']
        )
      ).toString()
    })
  }

  //! Search order by id
  const handleSearchId = (orderId: string) => {
    if (orderId == '') return
    setOrderID(orderId)
  }

  const handleClearSearchId = () => {
    setOrderID('')
  }

  return (
    <div className='space-y-6'>
      <div className='grid w-full grid-cols-2 gap-4'>
        <div className='w-full space-y-4'>
          <SearchBar handleSearch={handleSearchEmail} placeHolder='Email khách hàng' />
          {email && (
            <div className='flex items-center justify-center space-x-2 text-lg'>
              <p className=''>Tìm kiếm đơn hàng cho Email:</p>
              <p className='text-haretaColor'>{email}</p>
              <button
                onClick={handleClearSearchEmail}
                className='rounded-xl bg-alertRed/80 px-4 py-1 text-base hover:bg-alertRed'
              >
                Xóa
              </button>
            </div>
          )}
        </div>
        <div className='w-full space-y-4'>
          <SearchBar handleSearch={handleSearchId} placeHolder='ID đơn hàng' />
          {orderID != '' && (
            <div className='flex items-center justify-center space-x-2 text-lg'>
              <p className=''>ID đơn hàng:</p>
              <p className='text-haretaColor'>{orderID}</p>
              <button
                onClick={handleClearSearchId}
                className='rounded-xl bg-alertRed/80 px-4 py-1 text-base hover:bg-alertRed'
              >
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>
      <div className='grid w-full grid-cols-2 gap-4'>
        <div className='col-span-1'>
          <div className='overflow-hidden rounded-xl border border-white/60 p-4'>
            {!orderListData && <LoadingSection />}
            {orderListData && <AdminOrderList orderList={orderListData.data.data} />}
          </div>
        </div>
        <div className='col-span-1'>
          <div className='sticky top-6 overflow-hidden rounded-xl border border-white/60 p-4'>
            <AdminOrderDetail />
          </div>
        </div>
      </div>
    </div>
  )
}
