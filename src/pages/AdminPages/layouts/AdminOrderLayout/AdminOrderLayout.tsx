import classNames from 'classnames'
import React from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { adminPath } from 'src/constants/path'
import useOrderListQueryConfig from 'src/hooks/queryConfigs/useOrderListQueryConfig'

interface Props {
  children?: React.ReactNode
}

const OrderState = ['Đang đợi thanh toán', 'Đang chuẩn bị hàng', 'Đang giao hàng', 'Đã giao hàng', 'Đã xử lí xong']

export default function AdminOrderLayout({ children }: Props) {
  //! handle choose state
  const orderListConfig = useOrderListQueryConfig()
  const { status: currentState } = orderListConfig
  const navigate = useNavigate()
  const handleChooseState = (state: number) => () => {
    navigate({
      pathname: adminPath.orders,
      search: createSearchParams({ ...orderListConfig, status: state.toString() }).toString()
    })
  }

  return (
    <div className='relative grid grid-cols-12 gap-2'>
      <div className='col-span-2 p-4'>
        <div className='sticky flex flex-col items-center justify-around space-y-2 overflow-hidden rounded-md border border-white/40 p-3 text-base font-semibold text-lightText/80'>
          {OrderState.map((state, index) => (
            <button
              onClick={handleChooseState(index)}
              key={index}
              className={classNames('flex w-full items-center justify-start rounded-md px-4 py-1.5', {
                'bg-haretaColor text-darkText': currentState == index.toString(),
                'hover:bg-haretaColor hover:text-darkText': currentState != index.toString()
              })}
            >
              {state}
            </button>
          ))}
        </div>
      </div>
      <div className='col-span-10'>
        <div className='p-4 text-lightText'>{children}</div>
      </div>
    </div>
  )
}
