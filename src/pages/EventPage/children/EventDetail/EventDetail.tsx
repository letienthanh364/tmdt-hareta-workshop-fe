import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import LoadingSection from 'src/components/LoadingSection'
import PathBar from 'src/components/PathBar'
import mainPath from 'src/constants/path'
import EventProductCard from '../../components/EventProductCard'
import DOMPurify from 'dompurify'
import { getIdFromNameId } from 'src/utils/utils'
import eventApi from 'src/apis/event.api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

export default function EventDetail() {
  const currentUrl = useLocation().pathname
  const { eventId: nameId } = useParams()
  const eventId = getIdFromNameId(nameId as string)

  //! Multi languages
  const { t } = useTranslation('event')

  //! Get event detail
  const { data: eventDetailData } = useQuery({
    queryKey: ['events', 'detail', eventId],
    queryFn: () => eventApi.getEventDetail(eventId)
  })
  const eventDetail = eventDetailData?.data.data
  const productsInEvent = eventDetail?.items || []

  return (
    <div className='bg-lightBg py-2 pb-12 duration-200 dark:bg-darkBg tablet:py-3 tablet:pb-16 desktop:py-4 desktop:pb-20'>
      {!eventDetail && <LoadingSection />}
      {eventDetail && (
        <div className='container space-y-6'>
          <PathBar
            pathList={[
              { pathName: t('path.event'), url: mainPath.events },
              { pathName: eventDetail.overall_content, url: currentUrl }
            ]}
          />

          <div className='space-y-6'>
            <p className='text-center text-xl font-bold uppercase text-haretaColor  tablet:text-2xl desktop:text-3xl desktop:leading-10 desktop:tracking-wide'>
              {eventDetail.overall_content}
            </p>

            <div className='flex w-full items-center justify-center'>
              {eventDetail.avatar ? (
                <img
                  src={eventDetail.avatar}
                  alt={'Event'}
                  className='h-full w-full object-scale-down tablet:w-10/12 desktop:w-8/12'
                />
              ) : (
                <div className='h-full w-full object-scale-down tablet:w-10/12 desktop:w-8/12'>
                  <FontAwesomeIcon icon={faTriangleExclamation} fontSize={60} />
                </div>
              )}
            </div>
            <div className='grid grid-cols-1 gap-4 tablet:grid-cols-12'>
              <div className='col-span-1 space-y-6 border-black/60 dark:border-white/60 tablet:col-span-8 tablet:border-r tablet:px-4'>
                <div className='py-1 text-sm tablet:text-base desktop:text-xl'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(eventDetail.detail_content)
                    }}
                    className='overflow-visible'
                  />
                </div>

                <div className='flex w-full items-center justify-center'>
                  <Link
                    to={mainPath.store}
                    className='rounded-2xl bg-unhoveringBg px-4 py-2 text-lg font-medium text-black hover:bg-hoveringBg desktop:px-6 desktop:text-xl'
                  >
                    {t('detail.Shopping now')}
                  </Link>
                </div>
              </div>

              <div className='col-span-1 space-y-4 tablet:col-span-4'>
                <p className='text-center text-xl font-semibold uppercase text-haretaColor desktop:text-2xl'>
                  {t('detail.Products in event')}
                </p>

                <div className='grid w-full grid-cols-2 flex-col gap-6 tablet:grid-cols-1 tablet:px-4 desktop:gap-8'>
                  {productsInEvent.map((product) => (
                    <div key={product.item.id} className='col-span-1'>
                      <EventProductCard product={product.item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
