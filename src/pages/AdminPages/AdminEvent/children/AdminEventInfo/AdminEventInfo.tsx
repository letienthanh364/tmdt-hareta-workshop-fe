import DOMPurify from 'dompurify'
import { EventType } from 'src/types/event.type'
import { InformationField } from 'src/types/utils.type'
import { formatDateVi } from 'src/utils/utils'

interface Props {
  eventDetail: EventType
}

export default function AdminEventInfo({ eventDetail }: Props) {
  //! Styles
  const wrapperStyle = 'grid grid-cols-4 items-center gap-2 border border-black/20 py-1 px-2 rounded-md'
  const inforStyle = 'py-1 px-2 text-sm tablet:text-base desktop:text-lg'
  const titleStyle = 'text-xs tablet:text-sm font-semibold uppercase text-primaryBlue lg:text-base'

  //! Infos
  const infos: InformationField[] = [
    {
      title: 'Ngày tạo',
      info: formatDateVi(eventDetail.created_at)
    },
    {
      title: 'Chỉnh sửa gần nhất',
      info: formatDateVi(eventDetail.updated_at)
    },
    {
      title: 'Bắt đầu',
      info: formatDateVi(eventDetail.date_start)
    },
    {
      title: 'Kết thúc',
      info: formatDateVi(eventDetail.date_end)
    },
    {
      title: 'Giảm giá (%)',
      info: eventDetail.discount
    }
  ]

  return (
    <div className='flex flex-col space-y-4'>
      <div className={wrapperStyle}>
        <div className='col-span-1'>
          <p className={titleStyle}>Ảnh</p>
        </div>
        <div className='col-span-3 '>
          <div className='flex w-full flex-col items-center space-y-4 py-4 tabletSmall:w-8/12 tablet:w-6/12 desktop:w-4/12 '>
            <div className='relative w-full overflow-hidden rounded-md border-2 pt-[100%]'>
              <img
                src={eventDetail.avatar}
                alt={'Event'}
                className='absolute left-0 top-0 h-full w-full object-cover '
              />
            </div>
          </div>
        </div>
      </div>

      <div className='px-2 py-1'>
        <p className={titleStyle}>Phần giới thiệu</p>
        <div className={'py-1 text-sm tablet:text-base desktop:text-lg'}>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(eventDetail.overall_content)
            }}
            className='overflow-visible'
          />
        </div>
      </div>

      {infos.map((info, index) => (
        <div key={index} className={wrapperStyle}>
          <div className='col-span-1'>
            <p className={titleStyle}>{info.title}</p>
          </div>
          <div className='col-span-3'>
            <p className={inforStyle}>{info.info}</p>
          </div>
        </div>
      ))}

      <div className='px-2 py-1'>
        <p className={titleStyle}>Nội dung</p>
        <div className={'py-1 text-sm tablet:text-base desktop:text-lg'}>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(eventDetail.detail_content)
            }}
            className='overflow-visible'
          />
        </div>
      </div>
    </div>
  )
}
