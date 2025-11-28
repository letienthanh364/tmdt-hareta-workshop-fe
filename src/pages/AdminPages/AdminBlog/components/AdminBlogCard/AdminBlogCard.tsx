import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DOMPurify from 'dompurify'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { adminPath } from 'src/constants/path'
import { BlogType } from 'src/types/blog.type'
import { formatDate, generateNameId } from 'src/utils/utils'

interface Props {
  blog: BlogType
  disableClick?: boolean
}

export default function AdminBlogCard({ blog, disableClick = false }: Props) {
  const navigate = useNavigate()

  //! HANDLE ENTER ITEM
  const handleClickItem = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (disableClick) {
      event.preventDefault()
    } else {
      navigate({ pathname: `${adminPath.blogs}/${generateNameId({ name: blog.title, id: blog.id })}` })
    }
  }

  //! Avatar
  const avatarUrl = blog.avatar ? blog.avatar : null

  return (
    <button
      className='relative grid w-full grid-cols-5 gap-2 overflow-hidden rounded-xl border border-white/20 bg-darkColor900 p-2 duration-200 hover:bg-darkColor700 tablet:gap-4 tablet:p-3 desktop:gap-6 desktop:p-4'
      onClick={handleClickItem}
    >
      <div className='col-span-2'>
        <div className='relative w-full pt-[100%]'>
          <div className='absolute left-0 top-0 h-full w-full'>
            {avatarUrl ? (
              <img src={avatarUrl} alt={blog.title} className='absolute left-0 top-0 h-full w-full object-cover' />
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
          <p className='over h-full w-full justify-start overflow-hidden truncate text-left text-sm font-semibold uppercase text-haretaColor tablet:text-lg desktop:text-lg'>
            {blog.title}
          </p>

          <p className='text-left text-xs desktop:text-sm'>{formatDate(blog.created_at)}</p>

          <div className='flex w-full items-center space-x-2 text-xs desktop:text-sm'>
            <div className='font-semibold'>Tag:</div>
            <div className='text-left'>
              {blog.tags.map((tag, index) => (
                <span key={index} className='pr-1'>
                  #{tag.tag}
                  {index != blog.tags.length - 1 && <span className=''>,</span>}
                </span>
              ))}
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.overall)
            }}
            className='over line-clamp-2 h-full w-full justify-start overflow-hidden text-left text-sm font-semibold '
          />
        </div>
      </div>
    </button>
  )
}
