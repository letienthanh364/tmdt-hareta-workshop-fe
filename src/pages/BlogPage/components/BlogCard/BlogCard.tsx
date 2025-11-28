import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DOMPurify from 'dompurify'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { blogPath } from 'src/constants/path'
import { BlogType } from 'src/types/blog.type'
import { formatDateEn, formatDateVi, generateNameId } from 'src/utils/utils'

interface Props {
  blog: BlogType
  handleChooseTag: (tag: string) => () => void
}

export default function BlogCard({ blog, handleChooseTag }: Props) {
  //! Blog info
  const avatarUrl = blog.avatar

  //! Handle click
  const navigate = useNavigate()
  const handleClick = () => {
    navigate({
      pathname: `${blogPath.blogs}/${generateNameId({
        name: blog.title,
        id: blog.id
      })}`
    })
  }

  //! Multi languages
  const { t } = useTranslation('blog')
  const { i18n } = useTranslation()
  const currentLan = i18n.language

  return (
    <div className='group min-h-full w-full overflow-hidden rounded-xl bg-lightColor900 hover:bg-lightColor700 dark:bg-darkColor900 dark:hover:bg-darkColor700'>
      <button onClick={handleClick} className='w-full'>
        <div className='relative w-full pt-[100%]'>
          <div className='absolute left-0 top-0 h-full w-full'>
            {avatarUrl != '' ? (
              <img src={avatarUrl} alt={blog.title} className='absolute left-0 top-0 h-full w-full object-cover' />
            ) : (
              <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
                <FontAwesomeIcon icon={faTriangleExclamation} fontSize={60} />
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col justify-between space-x-1 space-y-2 overflow-hidden px-4 py-4 tabletSmall:px-3 desktop:space-y-3 desktop:px-4'>
          <p className='justify-center overflow-hidden truncate text-center text-sm font-bold uppercase group-hover:text-primaryColor dark:text-lightText desktop:text-2xl'>
            {blog.title}
          </p>

          <p className='text-left'>
            {t('card.Posted on')} {currentLan == 'en' ? formatDateEn(blog.created_at) : formatDateVi(blog.created_at)}
          </p>

          <div
            className='line-clamp-4 h-20 max-h-20 overflow-hidden text-left'
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.overall)
            }}
          />
        </div>
      </button>
      <div className='line-clamp-2 flex space-x-2 px-2 pb-6 pt-2 tabletSmall:px-3 desktop:px-4'>
        {blog.tags.map((tag) => (
          <button
            key={tag.tag}
            onClick={handleChooseTag(tag.tag)}
            className='rounded-lg border border-black/40 bg-lightColor700 px-2 py-1 hover:text-primaryColor dark:border-white/40 dark:bg-darkColor700'
          >
            {tag.tag}
          </button>
        ))}
      </div>
    </div>
  )
}
