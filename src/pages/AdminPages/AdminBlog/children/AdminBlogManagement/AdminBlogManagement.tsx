import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import blogApi from 'src/apis/blog.api'
import LoadingSection from 'src/components/LoadingSection'
import useBlogListQueryConfig, { BLOG_LIMIT } from 'src/hooks/useBlogListQueryConfig'
import { useViewport } from 'src/hooks/useViewport'
import { BlogListConfig } from 'src/types/blog.type'
import AdminBlogCard from '../../components/AdminBlogCard'
import UsePagination from 'src/components/UsePagination'
import { ceil } from 'lodash'
import AdminBlogSorter from '../../components/AdminBlogSorter'

export default function AdminBlogManagement() {
  const isMobile = useViewport().width < 768

  //! Get blog list
  const blogListQuery = useBlogListQueryConfig()
  const { data: blogsData, isFetching } = useQuery({
    queryKey: ['blogs', blogListQuery],
    queryFn: () => {
      return blogApi.getBlogList(blogListQuery as BlogListConfig)
    },
    staleTime: 3 * 60 * 1000
  })

  return (
    <div className='space-y-4'>
      <AdminBlogSorter />
      <div className='w-full'>
        {isFetching && <LoadingSection />}
        {blogsData && (
          <Fragment>
            <div className='grid w-full grid-cols-1 gap-2 tablet:grid-cols-2 tablet:gap-3 desktop:gap-4'>
              {blogsData.data.data.map((blog) => (
                <div className='col-span-1' key={blog.id}>
                  <AdminBlogCard blog={blog} />
                </div>
              ))}
            </div>
            <UsePagination
              totalPage={ceil(blogsData.data.paging.total / BLOG_LIMIT)}
              isMobile={isMobile}
              queryConfig={blogListQuery}
            />
          </Fragment>
        )}
      </div>
    </div>
  )
}
