import classNames from 'classnames'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { adminPath } from 'src/constants/path'
import { NavigateItem } from 'src/types/utils.type'

interface Props {
  children?: React.ReactNode
}

export default function AdminProductLayout({ children }: Props) {
  //! STYLES
  const itemStyle = (isActive: boolean) =>
    classNames('w-full flex items-center justify-start py-2 rounded-md px-4', {
      'bg-haretaColor text-darkText': isActive,
      'hover:text-darkText hover:bg-haretaColor': !isActive
    })

  //! Menus
  const menus: NavigateItem[] = [
    { name: 'Sản phẩm', url: adminPath.products },
    { name: 'Tạo', url: adminPath.createProduct },
    { name: 'Hình ảnh', url: adminPath.productImage },
    { name: 'Xóa', url: adminPath.deleteProduct }
  ]

  return (
    <div className='relative grid grid-cols-12 gap-2'>
      <div className='col-span-2 p-2'>
        <div className='sticky top-4 flex flex-col items-center justify-around space-y-2 overflow-hidden rounded-md border border-white/40 p-3 text-base font-semibold text-lightText/80'>
          {menus.map((item, index) => (
            <NavLink key={index} to={item.url} end className={({ isActive }) => itemStyle(isActive)}>
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
      <div className='col-span-10 p-2'>
        <div className=''>{children}</div>
      </div>
    </div>
  )
}
