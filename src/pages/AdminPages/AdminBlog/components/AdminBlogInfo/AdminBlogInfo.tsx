import classNames from 'classnames'
import DOMPurify from 'dompurify'
import { useContext, useEffect, useState } from 'react'
import { AdminBlogContext } from 'src/contexts/adminblog.context'
import { BlogDetail } from 'src/types/blog.type'
import { InformationField } from 'src/types/utils.type'
import AnimateChangeInHeight from 'src/components/AnimateChangeInHeight'
import { useLocation } from 'react-router-dom'
import { formatDate } from 'src/utils/utils'
import AdminBlogTagEditor from '../AdminBlogTagEditor'

interface Props {
  blogDetail: BlogDetail
}

export default function AdminBlogInfo({ blogDetail }: Props) {
  const { state } = useLocation()

  const { setUpdateTags } = useContext(AdminBlogContext)
  const [editingTag, setEditingTag] = useState<boolean>(state && state.from == 'AdminBlogCreate')

  useEffect(() => {
    setUpdateTags(blogDetail.tags.map((tag) => tag.tag))
  }, [setUpdateTags, blogDetail])

  //! Styles
  const wrapperStyle = 'grid grid-cols-4 items-center gap-2 border border-black/20 py-1 px-2 rounded-md'
  const inforStyle = 'py-1 px-2 text-sm tablet:text-base desktop:text-lg'
  const titleStyle = 'text-xs tablet:text-sm font-semibold uppercase text-primaryBlue lg:text-base'

  //! Infos
  const infos: InformationField[] = [
    {
      title: 'Tiêu đề',
      info: blogDetail.title
    },
    {
      title: 'Ngày tạo',
      info: formatDate(blogDetail.created_at)
    },
    {
      title: 'Ngày chỉnh sửa',
      info: formatDate(blogDetail.updated_at)
    }
  ]

  //! Handle edit tags
  const toggleEditTag = () => {
    setEditingTag((prev) => !prev)
  }

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
                src={blogDetail.avatar}
                alt={blogDetail.title}
                className='absolute left-0 top-0 h-full w-full object-cover '
              />
            </div>
          </div>
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

      <div
        className={classNames('w-full space-y-2', {
          'rounded-xl outline outline-1 outline-primaryColor': editingTag
        })}
      >
        <AnimateChangeInHeight>
          <div className={wrapperStyle}>
            <div className='col-span-1'>
              <p className={titleStyle}>Tags</p>
            </div>
            <div className='col-span-3'>
              <div className={classNames(inforStyle, 'flex items-center space-x-2')}>
                {blogDetail.tags.length == 0 && (
                  <p className='font-medium uppercase text-alertRed'>Chưa có danh mục </p>
                )}
                {blogDetail.tags.map((tag, index) => (
                  <span key={index} className='justify-center rounded-md border border-primaryBlue px-2 py-0.5'>
                    {tag.tag}
                  </span>
                ))}
                <button
                  type='button'
                  onClick={toggleEditTag}
                  className='translate-x-4 rounded-md bg-unhoveringBg px-2 py-1 hover:bg-hoveringBg'
                >
                  {editingTag ? 'Hủy' : 'Chỉnh sửa tag'}
                </button>
              </div>
            </div>
          </div>

          {editingTag && (
            <div className='px-4'>
              <AdminBlogTagEditor blogId={blogDetail.id} />
            </div>
          )}
        </AnimateChangeInHeight>
      </div>

      <div className='px-2 py-1'>
        <p className={titleStyle}>Phần giới thiệu</p>
        <div className={'py-1 text-sm tablet:text-base desktop:text-lg'}>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blogDetail.overall)
            }}
            className='overflow-visible'
          />
        </div>
      </div>

      <div className='px-2 py-1'>
        <p className={titleStyle}>Nội dung</p>
        <div className={'py-1 text-sm tablet:text-base desktop:text-lg'}>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blogDetail.content)
            }}
            className='overflow-visible'
          />
        </div>
      </div>
    </div>
  )
}
