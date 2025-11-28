import classNames from 'classnames'
import { NavLink } from 'react-router-dom'
import mainPath, { adminPath } from 'src/constants/path'
import { AdminProvider } from 'src/contexts/admin.context'
import { NavigateItem } from 'src/types/utils.type'

interface Props {
  children?: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
  const menus: NavigateItem[] = [
    { name: 'Sản phẩm', url: adminPath.products },
    { name: 'Hình ảnh', url: adminPath.images },
    { name: 'Đơn hàng', url: adminPath.orders },
    { name: 'Sự kiện', url: adminPath.events },
    { name: 'Bài viết', url: adminPath.blogs }
  ]

  return (
    <AdminProvider>
      <div
        className='relative flex min-h-full flex-col justify-between bg-darkBg'
        style={{
          minHeight: 'inherit'
        }}
      >
        <div className='w-full px-2 py-8'>
          <div className='relative flex items-center justify-around rounded-xl border border-haretaColor py-2 text-base font-semibold text-lightText/80 desktop:text-xl'>
            {/* <div className='absolute left-1/2 top-0 h-full border-l border-white/40'></div> */}
            {menus.map((menu, index) => (
              <NavLink
                key={index}
                to={menu.url}
                className={({ isActive }) =>
                  classNames('px-4 py-1 uppercase ', {
                    'text-haretaColor': isActive,
                    'hover:text-lightText': !isActive
                  })
                }
              >
                {menu.name}
              </NavLink>
            ))}
          </div>
          <div className='py-4 text-lightText'>{children}</div>
        </div>
        <NavLink
          to={mainPath.home}
          className='sticky bottom-2 left-2 w-fit shrink-0 rounded-xl bg-unhoveringBg px-4 py-1 font-medium hover:bg-hoveringBg'
        >
          Về trang chủ
        </NavLink>
      </div>
    </AdminProvider>
  )
}
