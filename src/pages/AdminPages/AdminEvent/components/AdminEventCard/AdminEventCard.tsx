import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DOMPurify from 'dompurify'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { adminPath } from 'src/constants/path'
import { EventType } from 'src/types/event.type'
import { formatDateVi, generateNameId } from 'src/utils/utils'

interface Props {
  event: EventType
  disableClick?: boolean
}

export default function AdminEventCard({ event, disableClick = false }: Props) {
  const navigate = useNavigate()

  //! HANDLE ENTER ITEM
  const handleClickItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (disableClick) {
      e.preventDefault()
    } else {
      navigate({ pathname: `${adminPath.events}/${generateNameId({ name: event.overall_content, id: event.id })}` })
    }
  }

  return (
    <button
      className='relative grid w-full grid-cols-5 gap-2 overflow-hidden rounded-xl border border-white/20 bg-darkColor900 p-2 duration-200 hover:bg-darkColor700 tablet:gap-4 tablet:p-3 desktop:gap-6 desktop:p-4'
      onClick={handleClickItem}
    >
      <div className='col-span-2'>
        <div className='relative w-full pt-[100%]'>
          <div className='absolute left-0 top-0 h-full w-full'>
            {event.avatar ? (
              <img src={event.avatar} alt={'Event'} className='absolute left-0 top-0 h-full w-full object-cover' />
            ) : (
              <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
                <FontAwesomeIcon icon={faTriangleExclamation} fontSize={60} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='col-span-3 flex min-h-full items-center'>
        <div className='sm:px-3 lg:px-4 lg:pt-4 flex flex-col items-start justify-start space-x-1 space-y-2 overflow-hidden px-2 pt-2'>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(event.overall_content)
            }}
            className='h-full w-full justify-start overflow-hidden truncate text-left text-sm font-semibold uppercase text-haretaColor tablet:text-lg desktop:text-lg'
          />

          <p className='flex space-x-4  text-xs desktop:text-sm'>
            <span className='font-medium'>Bắt đầu</span>
            <span className=''>{formatDateVi(event.date_start)}</span>
          </p>
          <p className='flex space-x-4  text-xs desktop:text-sm'>
            <span className='font-medium'>Kết thúc</span>
            <span className=''>{formatDateVi(event.date_end)}</span>
          </p>
        </div>
      </div>
    </button>
  )
}
