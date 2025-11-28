import { Suspense, lazy, useContext } from 'react'
import { Navigate, Outlet, RouteObject } from 'react-router-dom'
import LoadingWithEmptyContent from 'src/components/LoadingWithEmptyContent'
import { AppContext } from 'src/contexts/app.context'
import { AdminBlogProvider } from 'src/contexts/adminblog.context'
import mainPath, { adminPath } from 'src/constants/path'

import AdminOrderLayout from 'src/pages/AdminPages/layouts/AdminOrderLayout'
import AdminProductLayout from 'src/pages/AdminPages/layouts/AdminProductLayout'
import AdminMainLayout from 'src/pages/AdminPages/layouts/AdminMainLayout'
import AdminImageLayout from 'src/pages/AdminPages/layouts/AdminImageLayout'
import AdminBlogLayout from 'src/pages/AdminPages/layouts/AdminBlogLayout'
import AdminEventLayout from 'src/pages/AdminPages/layouts/AdminEventLayout'

//! LAZY IMPORT ADMIN PAGES
const AdminMainPage = lazy(() => import('src/pages/AdminPages/AdminMainPage'))

//! Lazy loading product pages
const AdminProductManagement = lazy(() => import('src/pages/AdminPages/AdminProduct/children/AdminProductManagement'))
const AdminProductDetail = lazy(() => import('src/pages/AdminPages/AdminProduct/children/AdminProductDetail'))

const AdminProductCreate = lazy(() => import('src/pages/AdminPages/AdminProduct/children/AdminProductCreate'))
const AdminProductCreateGroup = lazy(() => import('src/pages/AdminPages/AdminProduct/children/AdminProductCreateGroup'))

const AdminProductUpdateAvatar = lazy(
  () => import('src/pages/AdminPages/AdminProduct/children/AdminProductUpdateAvatar')
)
const AdminProductImagePage = lazy(() => import('src/pages/AdminPages/AdminProduct/children/AdminProductImagePage'))

const AdminProductDeleteProduct = lazy(
  () => import('src/pages/AdminPages/AdminProduct/children/AdminProductDeleteProduct')
)
const AdminProductDeleteGroup = lazy(() => import('src/pages/AdminPages/AdminProduct/children/AdminProductDeleteGroup'))

//! Lazy loading image pages
const AdminImageManagement = lazy(() => import('src/pages/AdminPages/AdminImage/children/AdminImageManagement'))
const AdminImageUpload = lazy(() => import('src/pages/AdminPages/AdminImage/children/AdminImageUpload'))
const AdminImageDelete = lazy(() => import('src/pages/AdminPages/AdminImage/children/AdminImageDelete'))

//! Lazy loading order pages
const AdminOrderMangement = lazy(() => import('src/pages/AdminPages/AdminOrder/children/AdminOrderMangement'))

//! Lazy loading event pages
const AdminEventManagement = lazy(() => import('src/pages/AdminPages/AdminEvent/children/AdminEventManagement'))
const AdminEventDetail = lazy(() => import('src/pages/AdminPages/AdminEvent/children/AdminEventDetail'))
const AdminEventCreate = lazy(() => import('src/pages/AdminPages/AdminEvent/children/AdminEventCreate'))

//! Lazy loading blog pages
const AdminBlogManagement = lazy(() => import('src/pages/AdminPages/AdminBlog/children/AdminBlogManagement'))
const AdminBlogDetail = lazy(() => import('src/pages/AdminPages/AdminBlog/children/AdminBlogDetail'))
const AdminBlogCreate = lazy(() => import('src/pages/AdminPages/AdminBlog/children/AdminBlogCreate'))

function AdminMainRoute() {
  const { isAuthenticated, profile } = useContext(AppContext)
  const isAdmin = profile?.role === 'admin'
  return isAuthenticated && isAdmin ? (
    <AdminMainLayout>
      <Suspense fallback={<LoadingWithEmptyContent />}>
        <Outlet />
      </Suspense>
    </AdminMainLayout>
  ) : (
    <Navigate to={mainPath.home} />
  )
}

function AdminProductRoute() {
  return (
    <AdminProductLayout>
      <Outlet />
    </AdminProductLayout>
  )
}

function AdminImageRoute() {
  return (
    <AdminImageLayout>
      <Outlet />
    </AdminImageLayout>
  )
}

function AdminOrderRoute() {
  return (
    <AdminOrderLayout>
      <Outlet />
    </AdminOrderLayout>
  )
}

function AdminEventRoute() {
  return (
    <AdminEventLayout>
      <Outlet />
    </AdminEventLayout>
  )
}

function AdminBlogRoute() {
  return (
    <AdminBlogLayout>
      <AdminBlogProvider>
        <Outlet />
      </AdminBlogProvider>
    </AdminBlogLayout>
  )
}

const AdminRoute: RouteObject = {
  path: '',
  element: <AdminMainRoute />,
  children: [
    {
      path: '',
      element: <AdminMainPage />
    },
    {
      path: adminPath.products,
      element: <AdminProductRoute />,
      children: [
        {
          path: '',
          element: <AdminProductManagement />
        },
        {
          path: adminPath.createProductGroup,
          element: <AdminProductCreateGroup />
        },
        {
          path: adminPath.createProduct,
          element: <AdminProductCreate />
        },
        {
          path: adminPath.uploadProductAvatar,
          element: <AdminProductUpdateAvatar />
        },
        {
          path: adminPath.productImage,
          element: <AdminProductImagePage />
        },

        {
          path: adminPath.deleteProduct,
          element: <AdminProductDeleteProduct />
        },
        {
          path: adminPath.deleteGroup,
          element: <AdminProductDeleteGroup />
        },
        {
          path: adminPath.productDetail,
          element: <AdminProductDetail />
        }
      ]
    },
    {
      path: adminPath.images,
      element: <AdminImageRoute />,
      children: [
        {
          path: '',
          element: <AdminImageManagement />
        },
        {
          path: adminPath.uploadImages,
          element: <AdminImageUpload />
        },
        {
          path: adminPath.deleteImages,
          element: <AdminImageDelete />
        }
      ]
    },
    {
      path: adminPath.orders,
      element: <AdminOrderRoute />,
      children: [
        {
          path: '',
          element: <AdminOrderMangement />
        }
      ]
    },
    {
      path: adminPath.blogs,
      element: <AdminBlogRoute />,
      children: [
        {
          path: '',
          element: <AdminBlogManagement />
        },
        {
          path: adminPath.blogCreate,
          element: <AdminBlogCreate />
        },
        {
          path: adminPath.blogDetail,
          element: <AdminBlogDetail />
        }
      ]
    },
    {
      path: adminPath.events,
      element: <AdminEventRoute />,
      children: [
        {
          path: '',
          element: <AdminEventManagement />
        },
        {
          path: adminPath.eventCreate,
          element: <AdminEventCreate />
        },
        {
          path: adminPath.eventDetail,
          element: <AdminEventDetail />
        }
      ]
    }
  ]
}

export default AdminRoute
