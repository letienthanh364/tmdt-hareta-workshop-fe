import { useContext } from 'react'
import { Order } from 'src/types/order.type'
import { AdminContext } from 'src/contexts/admin.context'

interface Props {
  orderList: Order[]
}

export default function AdminOrderList({ orderList }: Props) {
  const { setOrderID } = useContext(AdminContext)

  //! Style
  const wrapperClassname = 'grid grid-cols-3 gap-2'
  const labelClassname = 'col-span-1 capitalize'
  const contentClassname = 'col-span-2 font-semibold truncate'

  return (
    <div>
      {orderList.length == 0 && (
        <div className='flex h-80 items-center justify-center text-xl font-semibold uppercase text-alertRed'>
          Không có đơn hàng nào
        </div>
      )}
      {orderList.length > 0 &&
        orderList.map((order) => (
          <div
            className='mt-4 rounded-lg border border-white/40 p-2 first:mt-0  dark:hover:bg-darkColor900 desktop:p-4'
            key={order.id}
          >
            <button
              className='w-full text-left'
              onClick={() => {
                setOrderID(order.id)
              }}
            >
              <div className='flex w-full items-center justify-center space-x-2 font-semibold'>
                <p className=''>ID đơn hàng:</p>
                <p className='text-haretaColor'>{order.id}</p>
              </div>
              <div className='mt-6 flex w-full flex-col space-y-2'>
                <div className={wrapperClassname}>
                  <div className={labelClassname}>Tổng giá trị:</div>
                  <div className={contentClassname}>${order.total}</div>
                </div>
                <div className={wrapperClassname}>
                  <div className={labelClassname}>Khách hàng:</div>
                  <div className={contentClassname}>{order.name}</div>
                </div>
                <div className={wrapperClassname}>
                  <div className={labelClassname}>email:</div>
                  <div className='col-span-2 truncate font-semibold text-haretaColor'>{order.email}</div>
                </div>
                <div className={wrapperClassname}>
                  <div className={labelClassname}>SĐT:</div>
                  <div className={contentClassname}>{order.phone}</div>
                </div>
                <div className={wrapperClassname}>
                  <div className={labelClassname}>Địa chỉ:</div>
                  <div className={contentClassname}>{order.address}</div>
                </div>
              </div>
            </button>
          </div>
        ))}
    </div>
  )
}
