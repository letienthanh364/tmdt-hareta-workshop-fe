import { useTranslation } from 'react-i18next'
import { EventType } from 'src/types/event.type'
import EventProductCard from '../EventProductCard'
import { Link } from 'react-router-dom'
import { generateNameId } from 'src/utils/utils'
import { eventPath } from 'src/constants/path'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

interface Props {
  event: EventType
}

export default function EventCard({ event }: Props) {
  //! Multi languages
  const { t } = useTranslation('event')

  return (
    <div className='space-y-4 rounded-xl border border-black/60 p-2 dark:border-white/60 desktop:p-4'>
      <div className='relative flex h-96 w-full items-center justify-center bg-white'>
        <img
          src={event.avatar}
          alt={event.overall_content}
          className='absolute left-0 top-0 h-full w-full object-cover'
          draggable={false}
        />
        <p className='absolute bottom-4 left-1/2 line-clamp-2 w-11/12 -translate-x-1/2 overflow-hidden text-pretty rounded-full bg-black/80 px-8 py-1  text-left text-lg font-semibold tracking-wide tablet:text-xl desktop:bottom-8 desktop:w-1/2 desktop:text-2xl'>
          {event.overall_content}
        </p>
      </div>

      <div className='flex justify-center space-x-4 py-2 tablet:space-x-6 desktop:space-x-8'>
        <p className='text-center text-lg font-medium target:text-xl desktop:text-2xl'>
          {t('detail.Products in event')}
        </p>
        <Link
          to={`${eventPath.events}/${generateNameId({ name: event.overall_content, id: event.id })}`}
          className='flex items-center justify-center space-x-2 rounded-2xl bg-unhoveringBg px-4 py-2 font-medium text-darkText hover:bg-hoveringBg desktop:px-6'
        >
          <span className=''>{t('list.Go to event')}</span>
          <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>

      <div className='grid grid-cols-2 gap-4 tablet:grid-cols-3 desktop:grid-cols-4'>
        {event.items.map((product) => (
          <div key={product.item.id} className='col-span-1'>
            <EventProductCard product={product.item} />
          </div>
        ))}
      </div>
    </div>
  )
}
