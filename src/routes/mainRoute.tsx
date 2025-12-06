import { Suspense, lazy } from 'react'
import { Outlet, RouteObject } from 'react-router-dom'
import LoadingWithEmptyContent from 'src/components/LoadingWithEmptyContent'
import mainPath from 'src/constants/path'
import MainLayout from 'src/layouts/MainLayout'

const CartPage = lazy(() => import('src/pages/CartPage'))
const PrivacyAndTermsPage = lazy(() => import('src/pages/PrivacyAndTermsPage'))
const ProductDetailPage = lazy(() => import('src/pages/ProductDetailPage'))
const StorePage = lazy(() => import('src/pages/StorePage'))
const CheckoutSuccessPage = lazy(() => import('src/pages/CheckoutResultPage/CheckoutSuccessPage'))
const CheckoutCancelPage = lazy(() => import('src/pages/CheckoutResultPage/CheckoutCancelPage'))

function MainRouteWrapper() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingWithEmptyContent />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  )
}

const MainRoute: RouteObject = {
  path: '',
  element: <MainRouteWrapper />,
  children: [
    {
      path: mainPath.store,
      element: <StorePage />
    },
    {
      path: mainPath.cart,
      element: <CartPage />
    },
    {
      path: mainPath.events,
      element: <CartPage />
    },
    {
      path: mainPath.privacyAndTerms,
      element: <PrivacyAndTermsPage />
    },
    {
      path: mainPath.productDetail,
      element: <ProductDetailPage />
    },
    {
      path: mainPath.checkoutSuccess,
      element: <CheckoutSuccessPage />
    },
    {
      path: mainPath.checkoutCancel,
      element: <CheckoutCancelPage />
    }
  ]
}

export default MainRoute
