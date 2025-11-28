import { ceil } from 'lodash'
import { Fragment } from 'react'
import LoadingSection from 'src/components/LoadingSection'
import UsePagination from 'src/components/UsePagination'
import useEventListQueryConfig, { EVENT_LIMIT } from 'src/hooks/useEventListQueryConfig'
import AdminEventCard from '../../components/AdminEventCard'
import { useViewport } from 'src/hooks/useViewport'
import { eventQuery } from 'src/hooks/queries/useEventQuery'

export default function AdminEventManagement() {
  const isMobile = useViewport().width < 768

  //! Get event list
  const eventListQueryConfig = useEventListQueryConfig()
  const { data: eventsData } = eventQuery.useEventListForAdmin(eventListQueryConfig)

  return (
    <div className='space-y-4'>
      <div className='w-full'>
        {!eventsData && <LoadingSection />}
        {eventsData && (
          <Fragment>
            <div className='grid w-full grid-cols-1 gap-2 tablet:grid-cols-2 tablet:gap-3 desktop:gap-4'>
              {eventsData.data.data.map((event) => (
                <div className='col-span-1' key={event.id}>
                  <AdminEventCard event={event} />
                </div>
              ))}
            </div>
            <UsePagination
              totalPage={ceil(eventsData.data.paging.total / EVENT_LIMIT)}
              isMobile={isMobile}
              queryConfig={eventListQueryConfig}
            />
          </Fragment>
        )}
      </div>
    </div>
  )
}
