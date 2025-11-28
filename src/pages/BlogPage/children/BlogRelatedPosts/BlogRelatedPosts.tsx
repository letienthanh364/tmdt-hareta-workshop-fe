import { useQuery } from '@tanstack/react-query'
import blogApi from 'src/apis/blog.api'
import LoadingSection from 'src/components/LoadingSection'
import BlogCard from '../../components/BlogCard'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useNavigate } from 'react-router-dom'
import mainPath from 'src/constants/path'

interface Props {
  blogTag: string
  currentBlogId: string
}

export default function BlogRelatedPosts({ blogTag, currentBlogId }: Props) {
  //! Multi languages
  const { t } = useTranslation('blog')

  //! Get related post
  const { data: blogsData, isFetched } = useQuery({
    queryKey: ['blogs', 'related', blogTag],
    queryFn: () => blogApi.getBlogList({ tag: blogTag })
  })
  const blogs = blogsData?.data.data || []

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

  return (
    <div className=''>
      {!isFetched && <LoadingSection />}
      {isFetched && blogs.length > 1 && (
        <div className='space-y-4'>
          <div className='flex w-full items-center justify-center pt-8'>
            <div className='tablet w-full border-t border-black/60 dark:border-white/60 tablet:w-10/12 desktop:w-8/12'></div>
          </div>
          <p className='text-xl font-semibold uppercase tracking-wide tablet:text-2xl desktop:text-3xl'>
            {t('detail.Related posts')}
          </p>
          <div className='grid grid-cols-2 gap-4 desktop:grid-cols-3 desktop:gap-8'>
            {blogs.slice(0, 3).map((blog) => {
              if (blog.id != currentBlogId)
                return (
                  <div key={blog.id} className=''>
                    <BlogCard blog={blog} handleChooseTag={handleChooseTag} />
                  </div>
                )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
