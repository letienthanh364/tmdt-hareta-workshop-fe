import { Suspense, lazy } from 'react'
import { Outlet, RouteObject } from 'react-router-dom'
import LoadingWithEmptyContent from 'src/components/LoadingWithEmptyContent'
import { blogPath } from 'src/constants/path'
import MainLayout from 'src/layouts/MainLayout'

const BlogPage = lazy(() => import('src/pages/BlogPage'))
const BlogDetail = lazy(() => import('src/pages/BlogPage/children/BlogDetail'))

function BlogRouteWrapper() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingWithEmptyContent />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  )
}

const BlogRoute: RouteObject = {
  path: '',
  element: <BlogRouteWrapper />,
  children: [
    {
      path: '',
      element: <BlogPage />
    },
    {
      path: blogPath.blogDetail,
      element: <BlogDetail />
    }
  ]
}

export default BlogRoute
