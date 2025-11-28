import { useRoutes } from 'react-router-dom'
import mainPath, { adminPath } from './constants/path'

//! IMPORT LAYOUTS
import MainLayout from './layouts/MainLayout'

//! IMPORT PAGES
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

//! IMPORT ROUTES
import AdminRoute from './routes/adminRoute'
import UserRoute from './routes/userRoute'
import AuthenticationRoute from './routes/authenticationRoute'
import MainRoute from './routes/mainRoute'
import BlogRoute from './routes/blogRoute'
import EventRoute from './routes/eventRoute'
import OrderRoute from './routes/orderRoute'
import OrderTrackingRoute from './routes/orderTrackingRoute'

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: mainPath.home,
      index: true,
      element: (
        <MainLayout>
          <HomePage />
        </MainLayout>
      )
    },
    {
      path: mainPath.user,
      children: [UserRoute]
    },
    {
      path: mainPath.blogs,
      children: [BlogRoute]
    },
    {
      path: mainPath.events,
      children: [EventRoute]
    },
    {
      path: mainPath.order,
      children: [OrderRoute]
    },
    {
      path: mainPath.orderTracking,
      children: [OrderTrackingRoute]
    },
    {
      path: adminPath.mainPage,
      children: [AdminRoute]
    },
    {
      path: '',
      children: [AuthenticationRoute]
    },
    {
      path: '',
      children: [MainRoute]
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <NotFoundPage />
        </MainLayout>
      )
    }
  ])

  return routeElements
}
