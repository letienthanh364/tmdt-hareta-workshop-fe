import { Suspense, lazy } from 'react'
import { Outlet, RouteObject } from 'react-router-dom'
import LoadingWithEmptyContent from 'src/components/LoadingWithEmptyContent'
import { eventPath } from 'src/constants/path'
import MainLayout from 'src/layouts/MainLayout'

const EventPage = lazy(() => import('src/pages/EventPage'))
const EventDetail = lazy(() => import('src/pages/EventPage/children/EventDetail'))

function EventRouteWrapper() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingWithEmptyContent />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  )
}

const EventRoute: RouteObject = {
  path: '',
  element: <EventRouteWrapper />,
  children: [
    {
      path: '',
      element: <EventPage />
    },
    {
      path: eventPath.eventDetail,
      element: <EventDetail />
    }
  ]
}

export default EventRoute
