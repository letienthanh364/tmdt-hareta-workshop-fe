import { Suspense, lazy, useContext } from 'react'
import { Navigate, Outlet, RouteObject } from 'react-router-dom'
import LoadingWithEmptyContent from 'src/components/LoadingWithEmptyContent'
import { userPath } from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import MainLayout from 'src/layouts/MainLayout'
import UserLayout from 'src/pages/UserPages/layouts/UserLayout'

const UserChangePassword = lazy(() => import('src/pages/UserPages/children/UserChangePassword'))
const UserProfile = lazy(() => import('src/pages/UserPages/children/UserProfile'))
const UserWishList = lazy(() => import('src/pages/UserPages/children/UserWishList'))

function UserRouteWrapper() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? (
    <MainLayout>
      <UserLayout>
        <Suspense fallback={<LoadingWithEmptyContent />}>
          <Outlet />
        </Suspense>
      </UserLayout>
    </MainLayout>
  ) : (
    <Navigate to='/login' state={{ context: 'AccessProtectedRouteDenied', from: 'user' }} />
  )
}

const UserRoute: RouteObject = {
  path: '',
  element: <UserRouteWrapper />,
  children: [
    {
      path: '',
      element: <Navigate to={userPath.profile} />
    },
    {
      path: userPath.profile,
      element: <UserProfile />
    },
    {
      path: userPath.password,
      element: <UserChangePassword />
    },
    {
      path: userPath.wishList,
      element: <UserWishList />
    }
  ]
}

export default UserRoute
