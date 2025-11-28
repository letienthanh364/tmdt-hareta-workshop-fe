import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useLocation, useNavigate, useParams } from 'react-router-dom'
import blogApi from 'src/apis/blog.api'
import LoadingSection from 'src/components/LoadingSection'
import PathBar from 'src/components/PathBar'
import mainPath from 'src/constants/path'
import { getIdFromNameId, truncateString } from 'src/utils/utils'
import BlogRelatedPosts from '../BlogRelatedPosts'
import { Helmet } from 'react-helmet-async'
import { convert } from 'html-to-text'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'

export default function BlogDetail() {
  const { theme } = useContext(AppContext)
  const currentUrl = useLocation().pathname

  //! Get blog detail
  const { blogId: paramBlogId } = useParams()
  const blogId = getIdFromNameId(paramBlogId as string)

  const { data: blogData } = useQuery({
    queryKey: ['blogs', 'details', blogId],
    queryFn: () => blogApi.getBlogDetail(blogId)
  })
  const blogDetail = blogData?.data.data

  //! Handle choose tag
  const navigate = useNavigate()
  const handleChooseTag = (tag: string) => () => {
    navigate({
      pathname: mainPath.blogs,
      search: createSearchParams({
        tag: tag
      }).toString()
    })
  }

  //! Multi languages
  const { t } = useTranslation('blog')

  return (
    <div
      className='relative bg-lightBg py-2 pb-12 duration-200 dark:bg-darkBg tablet:py-3 tablet:pb-16 desktop:py-4 desktop:pb-20'
      style={{
        backgroundImage: `${
          theme == 'dark'
            ? 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))'
            : 'linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6))'
        }, url(${blogDetail?.avatar})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      {!blogDetail && <LoadingSection />}
      {blogDetail && (
        <div className='container space-y-8'>
          <Helmet>
            <title>{blogDetail.title} | Hareta Workshop</title>
            <meta
              name='description'
              content={convert(truncateString(blogDetail.overall, 150), {
                limits: { maxInputLength: 160 }
              })}
            />
          </Helmet>
          <PathBar
            pathList={[
              { pathName: t('path.blog'), url: mainPath.blogs },
              { pathName: blogDetail.title, url: currentUrl }
            ]}
          />

          <div className='space-y-6'>
            <p className='text-center text-xl font-bold uppercase leading-10 tracking-widest text-haretaColor tablet:text-3xl desktop:text-6xl'>
              {blogDetail.title}
            </p>

            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blogDetail.content)
              }}
              className='overflow-visible'
            />

            <div className='flex items-center space-x-4 text-sm desktop:text-base'>
              <span className=''>Tags</span>
              <div className='flex items-center space-x-2'>
                {blogDetail.tags.map((tag) => (
                  <button
                    key={tag.tag}
                    onClick={handleChooseTag(tag.tag)}
                    className='rounded-lg bg-lightColor700 px-3 py-0.5 hover:bg-lightColor500 dark:bg-darkColor700 dark:hover:bg-darkColor500 '
                  >
                    #{tag.tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <BlogRelatedPosts blogTag={blogDetail.tags[0]?.tag || ''} currentBlogId={blogId} />
        </div>
      )}
    </div>
  )
}
