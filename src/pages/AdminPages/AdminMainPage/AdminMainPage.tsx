import { NavLink } from 'react-router-dom'
import mainPath from 'src/constants/path'

export default function AdminMainPage() {
  return (
    <div className='w-full py-8 text-center font-bold uppercase tablet:text-2xl desktopLarge:text-4xl'>
      Admin Main Page
      <div className='flex w-full items-center justify-center py-8'>
        <NavLink to={mainPath.home} className='hover:text-haretaColor'>
          về trang chủ
        </NavLink>
      </div>
    </div>
  )
}
