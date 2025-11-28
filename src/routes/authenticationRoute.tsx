import { Suspense, lazy, useContext } from 'react'
import { Navigate, Outlet, RouteObject } from 'react-router-dom'
import LoadingPage from 'src/components/LoadingPage'
import mainPath from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import AuthenticationLayout from 'src/layouts/AuthenticationLayout'

const AuthLoginPage = lazy(() => import('src/pages/AuthenticationPages/AuthLoginPage'))
const AuthRegisterPage = lazy(() => import('src/pages/AuthenticationPages/AuthRegisterPage'))
const AuthRequestVerifyEmail = lazy(() => import('src/pages/AuthenticationPages/AuthRequestVerifyEmail'))
const AuthPasswordRecoveryRequestEmail = lazy(
  () => import('src/pages/AuthenticationPages/AuthPasswordRecoveryRequestEmail')
)
const AuthPasswordRecovery = lazy(() => import('src/pages/AuthenticationPages/AuthPasswordRecovery'))
const AuthVerifyEmail = lazy(() => import('src/pages/AuthenticationPages/AuthVerifyEmail'))

function AuthenticationRouteWrapper() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? (
    <AuthenticationLayout>
      <Suspense fallback={<LoadingPage />}>
        <Outlet />
      </Suspense>
    </AuthenticationLayout>
  ) : (
    <Navigate to={mainPath.home} />
  )
}

const AuthenticationRoute: RouteObject = {
  path: '',
  element: <AuthenticationRouteWrapper />,
  children: [
    {
      path: mainPath.login,
      element: <AuthLoginPage />
    },
    {
      path: mainPath.register,
      element: <AuthRegisterPage />
    },
    {
      path: mainPath.requestVerify,
      element: <AuthRequestVerifyEmail />
    },
    {
      path: mainPath.AuthPasswordRecoveryRequestEmail,
      element: <AuthPasswordRecoveryRequestEmail />
    },
    {
      path: mainPath.AuthPasswordRecovery,
      element: <AuthPasswordRecovery />
    },
    {
      path: mainPath.verifyEmail,
      element: <AuthVerifyEmail />
    }
  ]
}

export default AuthenticationRoute
