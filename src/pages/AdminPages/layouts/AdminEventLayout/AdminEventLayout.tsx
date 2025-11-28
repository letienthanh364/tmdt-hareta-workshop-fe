import classNames from 'classnames'
import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { adminPath } from 'src/constants/path'
import { NavigateItem } from 'src/types/utils.type'

interface Props {
  children?: React.ReactNode
}

export default function AdminEventLayout({ children }: Props) {
  useEffect(() => {
    document.title = 'Quản lí sự kiện'
  })

  //! Menus
  const menus: NavigateItem[] = [
    { name: 'Danh sách', url: adminPath.events },
    { name: 'Tạo event mới', url: adminPath.eventCreate }
  ]

  return (
    <div className='relative grid grid-cols-12 gap-2'>
      <div className='col-span-2 p-2'>
        <div className='sticky top-4 flex flex-col items-center justify-around space-y-2 overflow-hidden rounded-md border border-white/40 p-3 text-base font-semibold text-lightText/80'>
          {menus.map((item, index) => (
            <NavLink
              key={index}
              to={item.url}
              end
              className={({ isActive }) =>
                classNames('flex w-full items-center justify-start rounded-md px-4 py-2', {
                  'bg-haretaColor text-darkText': isActive,
                  'hover:bg-haretaColor hover:text-darkText': !isActive
                })
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
      <div className='col-span-10 p-2'>
        <div className='bg-darkColor900 p-4 text-lightText'>{children}</div>
      </div>
    </div>
  )
}
