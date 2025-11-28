import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import blogApi from 'src/apis/blog.api'
import LoadingSection from 'src/components/LoadingSection'
import { blogPath } from 'src/constants/path'
import { BlogListQueryConfig } from 'src/hooks/useBlogListQueryConfig'
import { generateNameId } from 'src/utils/utils'

export default function HomeIntroduction() {
  //! Multi languagee
  const { t } = useTranslation('home')

  //! Get introduce blog
  const blogsQueryConfig: BlogListQueryConfig = { tag: 'introduction' }
  const { data: blogsData } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogApi.getBlogList(blogsQueryConfig)
  })
  const blogs = blogsData?.data.data || []

  const introBlog = blogs[0]

  //! Handle click block
  const navigate = useNavigate()
  const handleClick = () => {
    navigate({
      pathname: `${blogPath.blogs}/${generateNameId({
        name: introBlog.title,
        id: introBlog.id
      })}`
    })
  }

  if (!introBlog) return
  return (
    <div className='space-y-6'>
      <p className='text-center text-2xl font-bold uppercase tracking-widest text-haretaColor tablet:text-3xl desktop:text-4xl desktopLarge:text-5xl'>
        {t('introduction.About Hareta Workshop')}
      </p>

      {!blogsData && <LoadingSection />}
      {blogsData && introBlog && (
        <div className='relative grid grid-cols-1 gap-4 tablet:grid-cols-3 desktop:gap-6'>
          <div className='col-span-1'>
            <div className='relative w-full pt-[75%]'>
              <img
                src={introBlog.avatar}
                alt={introBlog.title}
                className='absolute left-0 top-0 h-full w-full object-cover'
              />
            </div>
          </div>
          <div className='relative col-span-1 space-y-4 tablet:col-span-2 desktop:space-y-8'>
            <div
              className='text-left text-lg desktop:text-xl desktopLarge:text-2xl'
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(introBlog.overall)
              }}
            />
            <div className='flex w-full items-center justify-end tablet:justify-center'>
              <button
                onClick={handleClick}
                className='flex items-center justify-center rounded-xl bg-unhoveringBg px-3 py-1 text-black hover:bg-hoveringBg desktop:px-6 desktop:py-2 desktop:text-xl '
              >
                {t('introduction.Go to post')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
